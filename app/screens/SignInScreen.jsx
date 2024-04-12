import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../assets/signup-bg.jpg")}
          style={styles.headerImg}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.continueWithText}>Continue with:</Text>

        <View style={styles.signInContainer}>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.signInButton}>
              <Image
                source={require("../assets/Facebook-Logo.png")}
                style={styles.facebookImg}
              />
              <Text style={styles.signInText}>Sign In</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.signInButton}>
              <Image
                source={require("../assets/Google_logo.png")}
                style={styles.GoogleImg}
              />
              <Text style={styles.signInText}>Sign In</Text>
            </View>
          </TouchableOpacity>
          
        </View>
        <View style={{height: '60%', width: '100%'}}>
            <Image style={{height: '100%', width: '100%'}}source={require("../assets/signInIllustration.jpg")}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 37,
    flex: 1,
    backgroundColor: "#E8F4FF",
    top: -50,
  },
  title: {
    paddingTop: 15,
    fontSize: 30,
    fontWeight: 'bold'
  },
  continueWithText: {
    paddingTop: 40,
    fontSize: 15,
    color: 'grey'
  },
  signInText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold'
  },
  headerImg: {
    width: 500,
    height: 240,
    alignSelf: "center",
    resizeMode: "contain",
    objectFit: "fill"
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 40,
    padding: 20,
    position: "absolute",
    top: 250,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  form: {
    marginTop: 50,
  },
  signInContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: 'center',
    marginVertical:0,
    width: '100%',
    height: '25%',
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 120,
    width: 300,
    height: 54,
    backgroundColor: 'midnightblue',
    borderWidth: 1,
    borderColor: 'grey'
  },
  facebookImg: {
    width: 40,
    height: 40,
    marginRight: 0,
    alignSelf: "center",
    resizeMode: "contain",
  },
  GoogleImg: {
    width: 20,
    height: 30,
    marginRight: 5,
    alignSelf: "center",
    resizeMode: "contain",
  },
});

