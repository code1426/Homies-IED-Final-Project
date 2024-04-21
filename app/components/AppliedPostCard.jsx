import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import QueuedComponent from "./QueuedComponent";
import PostCard from "./PostCard";

import { collection, getDocs } from "firebase/firestore";
import { FirebaseDB } from "../../firebase.config";

const AppliedPostCard = ({ data }) => {
  const [applicantList, setApplicantList] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   getApplicantList();
  // }, []);

  const getApplicantList = async () => {
    try {
      setLoading(true);
      setApplicantList([]);
      const querySnapshot = await getDocs(
        collection(FirebaseDB, `OwnerPosts/${data.postID}/Applicants`)
      );
      setLoading(false);
      querySnapshot.forEach((doc) => {
        setApplicantList((property) => [...property, doc.data()]);
      });
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <PostCard data={data} />
      <View style={styles.statusContainer}>
        <View style={styles.buttonsContainer}>
          <Button title="Queued" bgc="#4285F4" color="white" />
          <CancelButton />
        </View>
      </View>
    </View>
  );
};

const Button = ({ title, bgc, color }) => {
  return (
    <View style={{ ...styles.button, backgroundColor: bgc }}>
      <Text style={{...styles.buttonText, color: color}}>{title}</Text>
    </View>
  );
};

const CancelButton = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Cancel</Text>
    </TouchableOpacity>
  );
}

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
    backgroundColor: 'white'
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: "#BBE0F5",
  },
  buttonText: {
    // color: "white",
    fontSize: 15,
    fontWeight: "500"
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    // backgroundColor: "red",
    marginLeft: 12
  }
});

export default AppliedPostCard;
