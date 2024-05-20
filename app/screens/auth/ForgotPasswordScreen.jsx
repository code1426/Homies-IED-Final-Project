import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Platform,
} from "react-native";

import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseAuth } from "../../../firebase.config";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setErrors({});
    setEmail("");
  };

  const validateForm = () => {
    let errors = {};
    if (!email) errors.email = "Please enter your email address";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        await sendPasswordResetEmail(FirebaseAuth, email);
        resetForm();
        Alert.alert("Email Sent!", "Reset password email sent successfully", [
          { text: "OK", onPress: () => navigation.navigate("SignIn") },
        ]);
      } catch (err) {
        console.log(err.message);
        setErrors((err) => ({
          ...err,
          email: "Please check your email and try again.",
        }));
        Alert.alert("Invalid Email", " Please check your email and try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={require("../../assets/signup-bg.png")}
          style={styles.headerImg}
        />
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require("../../assets/backIcon.png")}
          style={styles.backButton}
        />
      </TouchableOpacity>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Your Password?</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <TouchableOpacity
            style={styles.btn}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.btnText}>Sending...</Text>
            ) : (
              <Text style={styles.btnText}>Send Verification</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              resetForm();
              navigation.navigate("Role");
            }}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4FF",
    padding: 24,
  },
  headerImg: {
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 24,
  },
  formContainer: {
    position: "absolute",
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
  title: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 24,
  },
  form: {
    width: "100%",
    // marginBottom: 24,
  },
  input: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#6b7280",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 6,
  },
  btn: {
    backgroundColor: "#243470",
    borderRadius: 120,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "300",
  },
  forgotPasswordText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
    marginTop: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 140,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.15,
    color: "#6b7280",
  },
  signUpText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#243B7F",
    marginLeft: 5,
  },
  errorText: {
    color: "red",
    // marginBottom: 20,
  },
  backButton: {
    width: 25,
    height: 25,
    position: "absolute",
    top: Platform.OS === "android" ? 26 : 20,
    left: 12,
  },
});
