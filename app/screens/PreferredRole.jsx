import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import SelectButton from "../components/SelectButton";

import { useNavigation } from '@react-navigation/native';

function PreferredRole({}) {

  const [selectedName, setSelectedName] = useState("");
  const navigation = useNavigation();

  const handleProceed = () => {
    if (selectedName) {
      navigation.push("SignUp", {role: selectedName})
    } else {
      alert("Please select a role")
    }
  }

  return (
    <SafeAreaView style={{ height: 736, width: "100%" }}>
      <View>
        <Image
          style={{ height: 330, width: 414 }}
          source={require("../assets/signup.png")}
        />
      </View>
      <View
        style={{
          height: "81%",
          width: "100%",
          backgroundColor: "#ECEFF6",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          marginTop: -40,
          justifyContent: "center",
        }}
      >
        <View style={{ height: "80%", width: "100%" }}>
          <Text
            style={{
              textAlign: "center",
              // fontFamily: "Arial",
              // fontStyle: "normal",
              fontWeight: 600,
              fontSize: 25,
              // marginTop: 30,
              color: "midnightblue",
            }}
          >
            Choose your role.
          </Text>
          <View
            style={{
              height: 300,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingTop: 35,
            }}
          >
            <TouchableOpacity
              style={styles.role}
              onPress={() => {
                setSelectedName("Renter");
              }}
            >
              <View
                style={{
                  height: "10%",
                  width: "10%",
                  marginLeft: "10%",
                  marginTop: "10%",
                }}
              >
                <SelectButton name='Renter' selectedName={selectedName}></SelectButton>
              </View>
              <View
                style={{ height: "70%", width: "90%", alignSelf: "center" }}
              >
                <Image
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                  source={require("../assets/renter.png")}
                />
              </View>
              <View
                style={{
                  height: "8%",
                  width: "100%",
                  alignItems: "center",
                  marginVertical: "10%",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Renter</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.role}
              onPress={()=> setSelectedName("Owner")}
            >
              <View
                style={{
                  height: "10%",
                  width: "10%",
                  marginLeft: "10%",
                  marginTop: "10%",
                }}
              >
                <SelectButton name='Owner' selectedName={selectedName}></SelectButton>
              </View>
              <View
                style={{ height: "70%", width: "90%", alignSelf: "center" }}
              >
                <Image
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                  source={require("../assets/owner.png")}
                />
              </View>
              <View
                style={{
                  height: "8%",
                  width: "100%",
                  alignItems: "center",
                  marginVertical: "10%",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Owner</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => handleProceed()}
          >
            <View
              style={{
                height: 40,
                width: 200,
                alignSelf: "center",
                backgroundColor: "midnightblue",
                borderRadius: 15,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  paddingVertical: 10,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Proceed
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  role: {
    height: "80%",
    width: "40%",
    backgroundColor: "white",
    borderRadius: 18,
    justifyContent: "space-evenly",
  },
});

export default PreferredRole;
