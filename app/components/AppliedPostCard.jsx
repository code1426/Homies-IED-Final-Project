import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import QueuedComponent from "./QueuedComponent";
import PostCard from "./PostCard";

import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { FirebaseAuth, FirebaseDB } from "../../firebase.config";

import { UserContext } from "../../userContext";

const AppliedPostCard = ({ data, updateList }) => {
  const currentUser = useContext(UserContext);
  const [isApproved, setIsApproved] = useState(false);
  const [isdeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    isApplicantApproved();
    isDeletedByOwner();
  }, []);

  const isApplicantApproved = async () => {
    try {
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${data.postID}/Applicants`,
        FirebaseAuth.currentUser.uid
      );
      const docsnap = await getDoc(postRef);
      // console.log("isApproved:", docsnap.exists());
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
      // console.log("CancelButton: canceled");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <PostCard data={data} />
      <View style={styles.statusContainer}>
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
            <MessageButton />
          ) : (
            <CancelButton onPress={handleCancel} />
          )}
        </View>
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

const MessageButton = ({}) => {
  return (
    <TouchableOpacity style={styles.messageButton}>
      <Image
        style={{ width: 16, height: 16 }}
        source={require("../assets/navigationBarIcons/nonactiveMessages.png")}
      />
      <Text style={{ ...styles.buttonLabel, color: "black" }}>Message</Text>
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
    position: "relative",
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
    // backgroundColor: "red",
  },
  messageButton: {
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
