import React, { useRef, useState } from "react";
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

import { useRoute } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseAuth, FirebaseDB } from "../../../firebase.config";
import { sendEmailVerification } from "firebase/auth";

export default function SignUpScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const { params } = useRoute();
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const buttonRef = useRef(false);

  const uploadUserDetails = async (uid) => {
    try {
      const user = {
        uid: uid,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: params.role,
        location: "Unknown",
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/homies-ied-final-project.appspot.com/o/Users%2FphotoURL%2F1714614993869.jpg?alt=media&token=31747d4d-29eb-48a1-9ff0-763ad2d6055b",
        profileDescription: "",
        isBusinessVerified: false,
        permitPhotoURL: null,
      };
      await setDoc(doc(FirebaseDB, "Users", uid), user);
      await setDoc(doc(FirebaseDB, "UserMessages", uid), {});
      setLoading(false);
    } catch (err) {
      console.log("uploadUser Error:", err.message);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!form.firstName) errors.firstName = "First Name is required";
    if (!form.lastName) errors.lastName = "Last Name is required";
    if (!form.email) errors.email = "Email is required";
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length <= 8) {
      errors.password = "Password is Invalid";
      console.log("Please enter a valid password");
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      const resp = await createUserWithEmailAndPassword(
        FirebaseAuth,
        form.email,
        form.password
      );
      const user = resp.user;
      await updateProfile(user, {
        displayName: `${form.firstName} ${form.lastName}`,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/homies-ied-final-project.appspot.com/o/Users%2FphotoURL%2F1714614993869.jpg?alt=media&token=31747d4d-29eb-48a1-9ff0-763ad2d6055b",
      })
        .then(() => {
          console.log("username set");
          uploadUserDetails(user.uid);
        })
        .then(() => {
          sendEmailVerification(FirebaseAuth.currentUser).then(() => {
            console.log("Email verification sent");
            Alert.alert(
              "Email verification sent!",
              "Please check your email before signing in.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    navigation.navigate("SignIn");
                    FirebaseAuth.signOut();
                  },
                },
              ],
              { cancelable: false }
            );
          });
        });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("ERROR SIGN-UP:", error.message);
      Alert.alert("Email already signed Up", "Please proceed to sign in.");
    }
  };

  const resetForm = () => {
    setErrors({});
    setForm({
      email: "",
      password: "",
      userName: "",
      PreferredRole: params.role,
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    if (validateForm()) {
      handleCreateAccount();
      resetForm();
      setErrors({});
      buttonRef.current = true;
    } else setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../../assets/signup.png")}
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
        <Text style={{ fontSize: 30, fontWeight: "600" }}>Sign Up</Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.nameInputsContainer}>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <TextInput
                  style={[styles.input, styles.inputControl]}
                  placeholder="First Name"
                  placeholderTextColor="#6b7280"
                  value={form.firstName}
                  onChangeText={(firstName) => setForm({ ...form, firstName })}
                />
              </View>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <TextInput
                  style={[styles.input, styles.inputControl]}
                  placeholder="Last Name"
                  placeholderTextColor="#6b7280"
                  value={form.lastName}
                  onChangeText={(lastName) => setForm({ ...form, lastName })}
                />
              </View>
            </View>
            <View style={styles.nameInputsContainer}>
              <View style={{ flex: 1 }}>
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
              </View>
            </View>
          </View>
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
            {!errors.password || (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            disabled={buttonRef.current}
            style={styles.formAction}
            onPress={handleSubmit}
          >
            <View style={styles.btn}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>Sign Up</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formFooterContainer}>
          <Text style={styles.formFooter}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              resetForm();
              navigation.navigate("SignIn");
            }}
          >
            <Text style={styles.signUpColor}>Sign In</Text>
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
    height: 330,
    width: 414,
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
    marginTop: 140,
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
  nameInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 8,
  },
  backButton: {
    width: 25,
    height: 25,
    position: "absolute",
    top: 46,
    left: 12,
  },
});
