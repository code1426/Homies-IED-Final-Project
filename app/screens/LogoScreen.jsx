import { StyleSheet, Text, SafeAreaView, Image, Button } from "react-native";
import { useEffect, useState } from "react";
import { FirebaseAuth } from "../../firebase.config";

export default function LogoScreen({ navigation }) {

  useEffect(() => {
    try {
      setTimeout(() => {
        FirebaseAuth.currentUser || navigation.navigate("SignIn");
      }, 2750);
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  const appLogo = require("../assets/homies-logo-with-app-name.png");
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.icon} source={appLogo} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#9CC6DE",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    bottom: 100,
  },
});
