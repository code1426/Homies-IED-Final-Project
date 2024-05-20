import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import {
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import PostCard from "./homeComponents/PostCard";
import { FirebaseAuth, FirebaseDB } from "../../firebase.config";

import {
  MessageContext,
  UserContext,
  MessageStateContext,
} from "../../Contexts";
import { useNavigation } from "@react-navigation/native";

const AppliedPostCard = ({ data, updateList }) => {
  const currentUser = useContext(UserContext);
  const { dispatch } = useContext(MessageContext);

  const [isApproved, setIsApproved] = useState(false);
  const [isdeleted, setIsDeleted] = useState(false);
  const [ownerData, setOwnerData] = useState(null);
  const { messageState } = useContext(MessageStateContext);

  const navigation = useNavigation();

  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await getOwnerData();
    await isApplicantApproved();
    await isDeletedByOwner();
    setScreenLoading(false);
  };

  const getOwnerData = async () => {
    const ownerRef = doc(FirebaseDB, "Users", data.uid);
    const snapshot = await getDoc(ownerRef);
    if (snapshot.exists()) {
      setOwnerData(snapshot.data());
    }
  };

  const isApplicantApproved = async () => {
    try {
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${data.postID}/Applicants`,
        FirebaseAuth.currentUser.uid
      );
      const docsnap = await getDoc(postRef);
      if (docsnap.exists()) {
        if (docsnap.data().isApproved) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      }
    } catch (err) {
      console.log(err).message;
    }
  };

  const isDeletedByOwner = async () => {
    try {
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${data.postID}/Applicants`,
        FirebaseAuth.currentUser.uid
      );
      const docsnap = await getDoc(postRef);
      // console.log("isDeleted:", docsnap.exists());
      if (docsnap.exists()) {
        if (docsnap.data().isDeletedByOwner === "yes") {
          setIsDeleted(true);
        } else {
          setIsDeleted(false);
        }
      }
    } catch (err) {
      console.log(err).message;
    }
  };

  const handleCancel = async () => {
    try {
      const currentUserRef = doc(
        FirebaseDB,
        `Users/${currentUser.uid}/Applied`,
        data.postID
      );
      const postOwnerRef = doc(
        FirebaseDB,
        `Users/${data.uid}/Applicants`,
        currentUser.uid
      );
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${data.postID}/Applicants`,
        currentUser.uid
      );
      await deleteDoc(currentUserRef);
      updateList();
      await deleteDoc(postOwnerRef);
      await deleteDoc(postRef);
    } catch (err) {
      console.log(err.message);
    }
  };

  // MESSAGE BUTTON

  const [messageLoading, setMessageLoading] = useState(false);

  const handleMessage = async () => {
    console.log(currentUser);
    // combine the ids
    const combinedID =
      currentUser.uid > ownerData.uid
        ? currentUser.uid + ownerData.uid
        : ownerData.uid + currentUser.uid;
    // using that id to make a document
    try {
      setMessageLoading(true);
      // checking if the document already exists
      const res = await getDoc(doc(FirebaseDB, "Messages", combinedID));
      console.log("Messages Checked");
      // if the document doesn't exist then make a new one
      if (!res.exists()) {
        await setDoc(doc(FirebaseDB, "Messages", combinedID), { messages: [] });
        console.log("Messages Between Two Users has been Created.");

        // Updating the MESSAGES DATA for the CURRENT USER
        await updateDoc(doc(FirebaseDB, "UserMessages", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: ownerData.uid,
            firstName: ownerData.firstName,
            lastName: ownerData.lastName,
            photoURL: ownerData.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
        console.log("currentUser message set");
        // Updating the MESSAGES DATA for the ownerData
        await updateDoc(doc(FirebaseDB, "UserMessages", ownerData.uid), {
          [combinedID + ".userInfo"]: {
            uid: currentUser.uid,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
        console.log("applicant message set");
      }
      await handleSelect(ownerData);
      console.log(ownerData);
    } catch (error) {
      console.log(error);
      setMessageLoading(false);
    }
  };

  const handleSelect = async (user) => {
    // console.log(ownerData);
    await dispatch({ type: "MESSAGE_PRESSED", payload: user });
    setMessageLoading(false);
    messageState !== 0
      ? navigation.navigate("MessagingRoom")
      : Alert.alert(
          "Open Messages",
          "To view your messages, please open the message screen."
        );
  };

  return (
    <View style={styles.container}>
      <PostCard data={data} shadow={false} />
      <View style={styles.statusContainer}>
        {screenLoading ? (
          <ActivityIndicator
            style={{ alignSelf: "center", flex: 1 }}
            size="small"
            color="midnightblue"
          />
        ) : (
          <>
            <View style={styles.buttonsContainer}>
              {isdeleted ? (
                <Button title="Unavailable" bgc="#F44336" color="white" />
              ) : (
                <Button
                  title={isApproved ? "Approved" : "Queued"}
                  bgc={isApproved ? "limegreen" : "#4285F4"}
                  color="white"
                />
              )}

              {isApproved ? (
                <MessageButton
                  loading={messageLoading}
                  onPress={handleMessage}
                />
              ) : (
                <CancelButton onPress={handleCancel} />
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const Button = ({ title, bgc, color }) => {
  return (
    <View style={{ ...styles.button, backgroundColor: bgc }}>
      <Text style={{ ...styles.buttonText, color: color }}>{title}</Text>
    </View>
  );
};

const CancelButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>Cancel</Text>
    </TouchableOpacity>
  );
};

const MessageButton = ({ onPress, loading }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.messageButton}>
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          <Image
            style={{ width: 16, height: 16 }}
            source={require("../assets/navigationBarIcons/nonactiveMessages.png")}
          />
          <Text style={{ ...styles.buttonLabel, color: "black" }}>Message</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 20,
    // position: "relative",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  titleContainer: {
    marginTop: -40,
    width: "100%",
    justifyContent: "center",
    padding: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
  placeHolderContainer: {
    marginTop: -15,
    flex: 1,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: {
    flex: 1,
    borderRadius: 20,
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    alignSelf: "center",
    height: 50,
    width: "100%",
    bottom: 0,
    backgroundColor: "white",
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: "#BBE0F5",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    marginLeft: 12,
  },
  messageButton: {
    width: 112,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#BBE0F5",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 15,
    columnGap: 8,
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default AppliedPostCard;
