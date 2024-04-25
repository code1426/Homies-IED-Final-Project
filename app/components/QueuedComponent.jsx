import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { FirebaseAuth, FirebaseDB } from "../../firebase.config";

const QueuedComponent = ({ applicant, postData, updateList }) => {
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    isApplicantApproved();
  }, []);

  const isApplicantApproved = async () => {
    try {
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${postData.postID}/Applicants`,
        applicant.uid
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

  const confirmApprove = () => {
    Alert.alert(
      "Approve Application",
      "Are you sure you want to approve this application?",
      [
        { text: "Cancel", onPress: () => console.log("Cancel") },
        { text: "Yes", onPress: () => handleApprove() },
      ]
    );
  };

  const handleApprove = async () => {
    try {
      setIsApproved(true);
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${postData.postID}/Applicants`,
        applicant.uid
      );
      await updateDoc(postRef, {
        isApproved: true,
      });
      console.log("updated post Applicant");
    } catch (err) {
      console.log(err);
      setIsApproved(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Remove Applicant",
      "Are you sure you want to remove this applicant?",
      [
        { text: "Cancel", onPress: () => console.log("Cancel") },
        { text: "Yes", onPress: () => handleDelete() },
      ]
    );
  };

  const handleDelete = async () => {
    try {
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${postData.postID}/Applicants`,
        applicant.uid
      );
      const applicantRef = doc(
        FirebaseDB,
        `Users/${FirebaseAuth.currentUser.uid}/Applicants`,
        applicant.uid
      );
      await updateDoc(postRef, {
        isDeletedByOwner: "yes",
      });
      updateList();
      await updateDoc(applicantRef, {
        isDeletedByOwner: "yes",
      });
      console.log("Removed Applicant");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={require("../assets/profile.jpg")}
        />
        <Text numberOfLines={1} style={styles.name}>
          {applicant.firstName}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        {!isApproved ? (
          <>
            <TouchableOpacity onPress={confirmApprove} style={styles.button}>
              <Text style={styles.buttonLabel}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmDelete}
              style={styles.cancelContainer}
            >
              <Image
                style={styles.cancelImage}
                source={require("../assets/cancel.png")}
              />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.messageButton}>
            <Image
              style={{ width: 16, height: 16 }}
              source={require("../assets/navigationBarIcons/nonactiveMessages.png")}
            />
            <Text style={{ ...styles.buttonLabel, color: "black" }}>
              Message
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 65,
    paddingHorizontal: 12,
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    height: "100%",
    flexDirection: "row",
    alignSelf: "center",
  },
  profileContainer: {
    // flex: 2,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    // backgroundColor: 'red'
  },
  profile: {
    height: 40,
    width: 40,
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  name: {
    fontWeight: "500",
    fontSize: 16,
  },
  buttonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    columnGap: 8,
    // flex: 1
  },
  approveContainer: {
    width: "70%",
    height: "100%",
    justifyContent: "center",
  },
  cancelImage: {
    height: 25,
    width: 25,
    borderRadius: 25,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: "limegreen",
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BBE0F5",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 15,
    columnGap: 8,
  },
});

export default QueuedComponent;
