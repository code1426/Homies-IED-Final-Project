import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import HeaderComponent from "../components/HeaderComponent";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { FirebaseAuth, FirebaseDB } from "../../firebase.config";
import { UserContext } from "../../Contexts";

const RolesScreen = ({ navigation }) => {
  const currentUser = useContext(UserContext);

  async function updatingRole(roleChange) {
    await updateDoc(doc(FirebaseDB, "Users", currentUser.uid), {
      role: roleChange,
    });
  }

  async function updateRole() {
    let role = currentUser.role === "Owner" ? "Renter" : "Owner";
    console.log(role);
    updatingRole(role);
  }

  return (
    <SafeAreaView>
      <HeaderComponent title="Roles" />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <Image
          source={require("../assets/backIcon.png")}
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={async () => [
            Alert.alert(
              "Do you want to Change Roles?",
              "Changing will log you out of your account.",
              [
                {
                  text: "YES",
                  onPress: () => {
                    updateRole();
                    FirebaseAuth.signOut();
                  },
                },
                {
                  text: "CANCEL",
                  onPress: () => {
                    console.log("cancelled");
                  },
                },
              ]
            ),
            { cancelable: true },
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.roleSwitchName}>Owner Mode</Text>
            <Image
              style={styles.button}
              source={
                currentUser.role === "Owner"
                  ? require("../assets/switchOn.png")
                  : require("../assets/switchOff.png")
              }
            />
          </View>
        </TouchableOpacity>
        <View style={{ margin: 20 }}>
          <Text style={{ marginBottom: 20 }}>
            Active: Interface features include displaying the photo, as well as
            the title, adding description, prices, location and other features
            of the apartment or boarding house and approving the desired renter.
          </Text>
          <Text>
            Deactive: Interface features include filtering apartments by
            location, price range, number of bedrooms/bathrooms, amenities, and
            other preferences, allowing you to choose the space of your
            preference. If you are interested in any listings, you can apply or
            reserve for rent and pin them for later use. You can also view,
            change, and remove listings you have saved.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    paddingHorizontal: 50,
    // marginTop: 15,
    height: "100%",
    // backgroundColor: 'red'
  },
  button: {
    width: 34,
    height: 27,
    top: 5,
    right: 25,
  },
  roleSwitchName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    width: "100%",
    // marginRight: 200,
  },
  backButton: {
    width: 25,
    height: 25,
    top: -47,
    left: 20,
  },
  backButtonImage: {
    width: 25,
    height: 25,
    position: "absolute",
  },
});

export default RolesScreen;
