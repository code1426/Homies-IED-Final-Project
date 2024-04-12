import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function SignUpScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    if (!form.email) errors.email = "Email is required";
    if (!form.password) errors.password = "Password is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Submitted", form.email, form.password);
      setForm({ email: "", password: "" });
      setErrors({});
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("./Images/signin-bg.png")}
          style={styles.headerImg}
        />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputControl]}
              placeholder="Email"
              placeholderTextColor="#6b7280"
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputControl]}
              placeholder="Password"
              placeholderTextColor="#6b7280"
              value={form.password}
              secureTextEntry
              onChangeText={(password) => setForm({ ...form, password })}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSubmit}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign In</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.inputLabel}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signInContainer}>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.signInButton}>
              <Image
                source={require("./Images/Facebook-Logo.png")}
                style={styles.facebookImg}
              />
              <Text>Sign In</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.signInButton}>
              <Image
                source={require("./Images/Google_logo.png")}
                style={styles.GoogleImg}
              />
              <Text>Sign In</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formFooterContainer}>
          <Text style={styles.formFooter}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.signUpColor}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: "#E8F4FF",
    top: -50,
  },
  headerImg: {
    width: 500,
    height: 200,
    alignSelf: "center",
    resizeMode: "contain",
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    position: "absolute",
    top: 200,
    bottom: 0,
    left: 0,
    right: 0,
  },
  form: {
    marginTop: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  formFooter: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.15,
    color: "#ABAEB6",
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ABAEB6",
    borderWidth: 1,
    borderColor: "#ABAEB6",
    borderRadius: 5,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
    marginTop: 20,
  },
  inputControl: {
    height: 54,
    backgroundColor: "#EDF0F7",
    paddingHorizontal: 16,
    borderRadius: 120,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  formAction: {
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#243470",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#243470",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 120,
    width: 330,
    height: 54,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "300",
    textAlign: "center",
  },
  signUpColor: {
    color: "#243B7F",
    marginLeft: 5,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 60,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 120,
    width: 150,
    height: 54,
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

