import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { UserContext } from "../../Contexts";
import {
  FirebaseAuth,
  FirebaseDB,
  firebaseStorage,
} from "../../firebase.config";
import {
  RecaptchaVerifier,
  sendEmailVerification,
  updateEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from "firebase/auth";

import HeaderComponent from "../components/HeaderComponent";
import {
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  query,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";

import * as ImagePicker from "expo-image-picker";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { useIsFocused } from "@react-navigation/native";
import { bgCyan } from "colorette";

export default function EditProfileScreen({ navigation }) {
  const currentUser = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [newCurrentUser, setNewCurrentUser] = useState(currentUser);
  console.log(newCurrentUser);

  //  refresh
  const [count, setCount] = useState(0);

  const getUserData = async () => {
    const ownerRef = doc(FirebaseDB, "Users", currentUser.uid);

    const snapshot = await getDoc(ownerRef);
    if (snapshot.exists()) {
      setNewCurrentUser(snapshot.data());
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setCount((count) => count + 1);
  //   }, 5000);
  // });
  // const timer = setTimeout(setRefresh(), 5000);
  // useEffect(() => {
  //   try {
  //     const unSub = onSnapshot(
  //       doc(FirebaseDB, 'Messages', newCurrentUser.uid),
  //       (doc) => {
  //         doc.exists() && setNewCurrentUser(doc.data());
  //       }
  //     );
  //     return () => {
  //       unSub();
  //     };
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // }, [newCurrentUser.uid]);

  useEffect(() => {
    userAuth;
  }, [count, useIsFocused()]);

  useEffect(() => {
    getUserData();
  }, []);

  const userAuth = FirebaseAuth.currentUser;
  // DisplayName
  const nameSeparated = userAuth.displayName.split(" ");
  const userFirstName = nameSeparated.slice(0, -1).join(" ");
  const userLastName = nameSeparated.slice(-1).toString();

  const [firstName, onChangeFirstName] = useState(userFirstName);
  const [lastName, onChangeLastName] = useState(userLastName);

  // Password
  const [passwords, onChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const validatePassword = () => {
    let passwordErrors = {};
    if (passwords.currentPassword === "")
      passwordErrors.currentPassword = "Please type in your Current Password.";
    // TypeError: Cannot read property 'length' of undefined
    if (passwords.newPassword.length <= 8) {
      passwordErrors.newPassword = "New Password is Invalid.";
    }
    setPasswordErrors(passwordErrors);
    return Object.keys(passwordErrors).length === 0;
  };

  const handleInputPassword = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        userAuth.email,
        passwords.currentPassword
      );
      await reauthenticateWithCredential(userAuth, credential).catch((error) =>
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: "Wrong Password",
        })
      );
      await updatePassword(userAuth, passwords.newPassword).catch((error) =>
        Alert.alert(error.message)
      );
    } catch (error) {
      console.log("Change Password", error.message);
      setPasswordErrors({
        ...passwordErrors,
        currentPassword: "Wrong Password",
      });
    }
  };

  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChangePassword = async () => {
    try {
      if (validatePassword()) {
        setPasswordLoading(true);
        await handleInputPassword();
        resetPasswordValidation();
        Alert.alert("Success", "Changed password successfully!");
        setPasswordLoading(false);
      } else setPasswordLoading;
    } catch (e) {
      console.log(e.message);
    }
  };

  const resetPasswordValidation = () => {
    setPasswordErrors({});
    onChangePassword({ currentPassword: "", newPassword: "" });
  };

  // Location
  const firestoreLocation = newCurrentUser.location;
  console.log(firestoreLocation);

  const [location, onChangeLocation] = useState(newCurrentUser.location);
  console.log(location);

  const [locationLoading, setLocationLoading] = useState(false);

  const handleChangeLocation = async () => {
    setLocationLoading(true);
    try {
      await updateDoc(doc(FirebaseDB, "Users", currentUser.uid), {
        location: location,
      });
      setLocationLoading(false);
    } catch (e) {
      console.log(e.message);
      setLocationLoading(false);
    }
  };

  // Profile Picture
  const [profile, setProfilePic] = useState(userAuth.photoURL);

  const pickProfilePic = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!result.canceled) {
        setProfilePic(result.assets[0].uri);
        console.log("Image Picker");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChangeProfile = async () => {
    setLoading(true);
    try {
      const profilePicRes = await fetch(profile);
      console.log("Fetched");

      const profileBlob = await profilePicRes.blob();
      console.log("Blobbed");

      const profilePicRef = ref(
        firebaseStorage,
        "Users/photoURL/" + Date.now() + ".jpg"
      );

      await uploadBytesResumable(profilePicRef, profileBlob);
      console.log("Uploaded");

      const profilePicURL = await getDownloadURL(profilePicRef);
      console.log("Downloaded");

      await updateProfile(userAuth, { photoURL: profilePicURL });
      await updateDoc(doc(FirebaseDB, "Users", currentUser.uid), {
        photoURL: profilePicURL,
      });
      currentUser.photoURL = profilePicURL;
      console.log("Changed Successfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Character Deletion
  const [inputPasswordReqDelete, setInputPasswordReqDelete] = useState();
  const [popUp, setPopUp] = useState(false); // default false

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(userAuth);
      console.log("Account Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletionProcess = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        userAuth.email,
        inputPasswordReqDelete
      );
      reauthenticateWithCredential(userAuth, credential)
        .then(async () => {
          console.log("Reaunthenticated");
          // const q = query(
          //   collection(FirebaseDB, "OwnerPosts"),
          //   where("uid", "==", currentUser.uid)
          // );
          // const res = await getDoc(q);
          // res.forEach(async (snapshot) => {
          //   await deleteDoc(doc(FirebaseDB, "OwnerPosts", snapshot.id));
          //   console.log("Document Deleted");
          // });
          await deleteDoc(doc(FirebaseDB, "Users", currentUser.uid));
          await handleDeleteAccount();
          console.log("Documents Deleted");
        })
        .catch((error) => {
          Alert.alert("Wrong Password", "Try again later.");
          console.log(error);
        });
    } catch (error) {
      console.log("Change Password", error.message);
      Alert.alert("Wrong Password", "Try again later.");
      setPopUp(!popUp);
    }
  };

  const [nameLoading, setNameLoading] = useState(false);

  const handleEditName = async () => {
    try {
      setNameLoading(true);
      await updateProfile(userAuth, {
        displayName: `${firstName} ${lastName}`,
      });
      setNameLoading(false);
    } catch (e) {
      setNameLoading(false);
      console.log(e.message);
    }
  };

  // Profile Description
  const [profileDescription, setProfileDescription] = useState();
  const [profileDescriptionLoading, setProfileDescriptionLoading] =
    useState(false);

  const handleChangeProfileDescription = async () => {
    try {
      setProfileDescriptionLoading(true);
      await updateDoc(doc(FirebaseDB, "Users", currentUser.uid), {
        profileDescription: profileDescription,
      });
      setProfileDescriptionLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView scrollEnabled={popUp ? false : true}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
          <HeaderComponent
            backButtonOn={
              loading || nameLoading || locationLoading || passwordLoading
                ? false
                : true
            }
            title="Profile Details"
          />
          <View style={styles.formContainer}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text style={[styles.text, { marginBottom: 12 }]}>
                  Profile Picture
                </Text>
                <TouchableOpacity
                  onPress={async () => {
                    {
                      await pickProfilePic(), console.log(profile);
                    }
                  }}
                >
                  <Image
                    style={[styles.image]}
                    source={
                      profile === undefined
                        ? { uri: userAuth.photoURL }
                        : { uri: profile }
                    }
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <TouchableOpacity
                  style={styles.buttonProfile}
                  onPress={handleChangeProfile}
                >
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color="midnightblue"
                      style={{ alignSelf: "center" }}
                    />
                  ) : (
                    <Text style={styles.changeProfileButton}>
                      Change Profile Pic
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.text}>Profile Description</Text>
            <TextInput
              style={styles.profileDescription}
              placeholder={newCurrentUser.profileDescription}
              multiline={true}
              textAlignVertical="top"
              onChangeText={setProfileDescription}
              value={profileDescription}
            />
            <TouchableOpacity
              style={styles.editContainer}
              onPress={handleChangeProfileDescription}
            >
              {profileDescriptionLoading ? (
                <ActivityIndicator
                  size="small"
                  color="midnightblue"
                  style={{ alignSelf: "center" }}
                />
              ) : (
                <Text style={styles.edit}>Edit Profile Description</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.text}>Email Adress</Text>
            <Text style={styles.emailAdress}>{userAuth.email}</Text>
            <Text style={styles.text}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder={userFirstName}
              onChangeText={onChangeFirstName}
              placeholderTextColor="#6b7280"
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder={userLastName}
              onChangeText={onChangeLastName}
              placeholderTextColor="#6b7280"
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={styles.editContainer}
              onPress={handleEditName}
            >
              {nameLoading ? (
                <ActivityIndicator
                  size="small"
                  color="midnightblue"
                  style={{ alignSelf: "center" }}
                />
              ) : (
                <Text style={styles.edit}>Edit Name</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.text}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder={""}
              onChangeText={(currentPassword) => [
                onChangePassword({ ...passwords, currentPassword }),
                console.log(passwords),
              ]}
              value={passwords.currentPassword}
              secureTextEntry
              placeholderTextColor="#6b7280"
            />
            {passwordErrors.currentPassword && (
              <Text style={[styles.errorText, { marginTop: "3%" }]}>
                {passwordErrors.currentPassword}
              </Text>
            )}
            <Text style={[styles.text, { marginTop: "3%" }]}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder={""}
              onChangeText={(newPassword) =>
                onChangePassword({ ...passwords, newPassword })
              }
              value={passwords.newPassword}
              secureTextEntry
              placeholderTextColor="#6b7280"
            />
            {passwordErrors.newPassword && (
              <Text style={[styles.errorText, { marginTop: "3%" }]}>
                {passwordErrors.newPassword}
              </Text>
            )}
            <TouchableOpacity
              style={styles.editContainer}
              onPress={handleChangePassword}
            >
              {passwordLoading ? (
                <ActivityIndicator color="midnightblue" size="small" />
              ) : (
                <Text style={styles.edit}>Change Password</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.text}></Text>

            <Text style={styles.text}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder={
                !newCurrentUser.location
                  ? "Enter Your Location"
                  : newCurrentUser.location
              }
              placeholderTextColor="#6b7280"
              onChangeText={(location) => onChangeLocation(location)}
              // value=""
            />
            <TouchableOpacity
              style={styles.editContainer}
              onPress={handleChangeLocation}
            >
              {locationLoading ? (
                <ActivityIndicator
                  size="small"
                  color="midnightblue"
                  style={{ alignSelf: "center" }}
                />
              ) : (
                <Text style={styles.edit}>Edit Location</Text>
              )}
            </TouchableOpacity>

            <View>
              <View style={styles.GcashAndBusinessPermit}>
                <Text style={styles.text}>Gcash Synced</Text>
                <View>
                  <TouchableOpacity style={styles.ChangeAccount}>
                    <Text>Change Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.GcashAndBusinessPermit}>
                <Text style={styles.text}>Business Permit Verified</Text>
                <View style={styles.Verified}>
                  <TouchableOpacity>
                    <Text>Verified</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setPopUp(!popUp);
                }}
              >
                <Text style={[styles.deleteAcc]}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
          {popUp && (
            <View style={styles.popUpContainer}>
              <View style={styles.popUp}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                  <Text style={styles.popUpTitle}>Delete Account</Text>
                  <Text style={styles.popUpDescription}>
                    Enter Your Password
                  </Text>
                  <TextInput
                    style={styles.passwordReqDeletion}
                    placeholder="password"
                    onChangeText={setInputPasswordReqDelete}
                    value={inputPasswordReqDelete}
                    secureTextEntry
                  />
                </View>
                <View>
                  <View style={styles.popUpButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        setPopUp(!popUp);
                      }}
                    >
                      <Text style={[styles.popUpButton, { right: 10 }]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeletionProcess}>
                      <Text style={[styles.popUpButton, { color: "red" }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    // marginBottom: 100,
    backgroundColor: "ECEFF6",
  },
  formContainer: {
    backgroundColor: "ECEFF6",
    marginLeft: "10%",
    marginRight: "10%",
  },
  input: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
    borderWidth: 1.2,
    borderColor: "black",
    borderRadius: 10,
    paddingVertical: "4%",
    paddingHorizontal: "3%",
    marginTop: "3%",
  },
  text: {
    marginTop: 12,
    fontWeight: "600",
    // marginBottom: 12,
  },
  emailAdress: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ABAEB6",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingVertical: "4%",
    paddingHorizontal: "3%",
    marginTop: "3%",
    color: "#6b7280",
    marginBottom: "3%",
  },
  editContainer: {
    backgroundColor: "#ABDCFF",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    width: 160,
    paddingVertical: 4,
    textAlign: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  edit: {
    fontWeight: "700",
  },
  deleteButton: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    width: 170,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    marginTop: 50,
    marginBottom: 50,
  },
  deleteAcc: {
    fontWeight: "800",
    textAlign: "center",
    color: "white",
  },
  changeProfileButton: {
    fontWeight: "800",
  },
  buttonProfile: {
    borderColor: "black",
    borderRadius: 15,
    borderWidth: 1,
    height: 33,
    width: 160,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ABDCFF",
    // marginTop: 50,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 100,
    resizeMode: "cover",
  },
  LocationTexts: {
    marginTop: "4%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    paddingVertical: "1%",
    paddingHorizontal: "7%",
    fontWeight: "600",
    textAlign: "center",
    color: "#6b7280",
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "4%",
  },
  GcashAndBusinessPermit: {
    marginTop: "4%",
    textAlign: "center",
  },
  ChangeAccount: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "#D5E7F0",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "100",
    borderColor: "#85BCDC",
    width: 160,
    height: 30,
    marginVertical: 8,
  },
  Verified: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "#D5E7F0",
    justifyContent: "center",
    fontWeight: "100",
    borderColor: "#85BCDC",
    justifyContent: "center",
    alignItems: "center",
    width: 160,
    height: 30,
    marginVertical: 8,
  },
  backButtonImage: {
    width: 25,
    height: 25,
    position: "absolute",
  },
  errorText: {
    color: "red",
    marginBottom: 0,
    marginLeft: 16,
  },
  popUpContainer: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    // paddingHorizontal: "15%",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    alignSelf: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popUp: {
    position: "absolute",
    backgroundColor: "lightgray",
    borderColor: "black",
    borderWidth: 0.6,
    borderRadius: 15,
    width: "auto",
    height: "auto",
    bottom: 350,
  },
  popUpTitle: {
    // backgroundColor: 'pink',
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    // top: -10,
  },
  popUpDescription: {
    textAlign: "center",
    paddingVertical: 5,
    fontSize: 12,
  },
  passwordReqDeletion: {
    fontSize: 12,
    fontWeight: "600",
    color: "black",
    borderWidth: 0.8,
    borderColor: "black",
    borderRadius: 10,
    paddingVertical: "2%",
    paddingHorizontal: "3%",
    marginTop: "3%",
    top: 10,
    width: 200,
  },
  popUpButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderTopWidth: 0.6,
  },
  popUpButton: {
    paddingVertical: 10,
  },
  profileDescription: {
    minHeight: 200,
    width: "auto",
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 10,
    padding: 10,
  },
};
