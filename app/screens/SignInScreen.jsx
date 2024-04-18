import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { FirebaseAuth, FirebaseDB } from "../../firebase.config";

export default function SignInScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setErrors({});
    setForm({ email: "", password: "" });
  };

  const getUser = async (uid) => {
    const docRef = doc(FirebaseDB, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!form.email) errors.email = "Email is required";
    if (!form.password) errors.password = "Password is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAuth = async () => {
    try {
      setLoading(true);
      const resp = await signInWithEmailAndPassword(
        FirebaseAuth,
        form.email,
        form.password
      ).catch((error) => {
        setLoading(false);
        Alert.alert("Invalid Credential", "please try again.");
        console.log(error.code);
      });
      const user = resp?.user;
      if (user && !user.emailVerified) {
        setLoading(false);
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in.",
          [
            {
              text: "OK",
              onPress: () => {
                sendEmailVerification(user)
                  .then(() => console.log("Email Verification Sent - SIGN IN"))
                  .catch((error) =>
                    console.log("ERROR IN SIGN IN VERIFICATION:", error.message)
                  );
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      setLoading(false);
      console.log("SIGN-IN", error.message);
      Alert.alert(error.message);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    if (validateForm()) {
      handleAuth();
      resetForm();
    } else setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../assets/signup-bg.png")}
          style={styles.headerImg}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={{ fontSize: 30, fontWeight: "600" }}>Sign In</Text>
        <View style={styles.form}>
          {errors.message && (
            <Text
              style={{ ...styles.errorText, fontSize: 16, marginBottom: 8 }}
            >
              {errors.message}
            </Text>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputControl]}
              placeholder="Email"
              placeholderTextColor="#6b7280"
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
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
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.formAction} onPress={handleSubmit}>
            <View style={styles.btn}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>Sign In</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.inputLabel}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formFooterContainer}>
          <Text style={styles.formFooter}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              resetForm();
              navigation.navigate("Role");
            }}
          >
            <Text style={styles.signUpColor}>Sign Up</Text>
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
    alignSelf: "center",
    resizeMode: "contain",
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 20,
    position: "absolute",
    top: 260,
    bottom: -50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  form: {
    marginTop: 24,
    width: "100%",
  },
  formFooterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // position: 'absolute',
    marginTop: 140,
    // bottom: 50
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
    marginTop: 20,
  },
  btn: {
    backgroundColor: "#243470",
    borderWidth: 1,
    borderColor: "#243470",
    borderRadius: 120,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "300",
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
    marginBottom: 0,
    marginLeft: 16,
  },
});
