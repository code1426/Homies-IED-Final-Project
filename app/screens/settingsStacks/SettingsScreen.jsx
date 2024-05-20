import React, { useContext, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import HeaderComponent from "../../components/HeaderComponent";
import ButtonSettings from "../../components/settingsComponents/ButtonSettings";
import { FirebaseAuth } from "../../../firebase.config";
import { UserContext } from "../../../Contexts";
import { useIsFocused } from "@react-navigation/native";

function SettingsScreen({ navigation }) {
  const currentUser = useContext(UserContext);
  const userAuth = FirebaseAuth.currentUser;
  const isFocused = useIsFocused();

  useEffect(() => {
    userAuth;
  }, [isFocused]);

  const businessPermit = currentUser.isBusinessVerified
    ? "Verified"
    : "Unverified";

  return (
    <SafeAreaView>
      <HeaderComponent title="Settings" />
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image style={styles.image} source={{ uri: userAuth.photoURL }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text>{userAuth.displayName}</Text>
            <View>
              <Text>{currentUser.email}</Text>
              <Text>{currentUser.location}</Text>
              <Text>Gcash</Text>
              <Text>{businessPermit}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  navigation.navigate("Edit Profile");
                }}
              >
                <Text style={{ textAlign: "center" }}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ButtonSettings
          settingName="Privacy"
          settingIcon={require("../../assets/settingsIcons/privacyIcon.png")}
        />
        <ButtonSettings
          settingName="Roles"
          settingIcon={require("../../assets/settingsIcons/roleChangeIcon.png")}
        />
        <ButtonSettings
          settingName="Notifications"
          settingIcon={require("../../assets/settingsIcons/notificationIcon.png")}
          tailIcon={require("../../assets/switchOff.png")}
          tailIconActive={require("../../assets/switchOn.png")}
        />
        <ButtonSettings
          settingName="Log Out"
          settingIcon={require("../../assets/settingsIcons/logOutIcon.png")}
          tailIcon={require("../../assets/settingsIcons/arrowHead.png")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    height: "100%",
  },
  profileContainer: {
    paddingHorizontal: 0,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
    resizeMode: "cover",
  },
  editButton: {
    alignSelf: "center",
    backgroundColor: "#D5E7F0",
    height: 25,
    width: 120,
    justifyContent: "center",
    borderRadius: 12.5,
    borderWidth: 1,
    borderColor: "#85BCDC",
    marginTop: 10,
  },
});

export default SettingsScreen;
