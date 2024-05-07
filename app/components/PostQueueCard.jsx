import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import QueuedComponent from "./QueuedComponent";
import PostCard from "./PostCard";

import { collection, getDocs, query, where } from "firebase/firestore";
import { FirebaseDB } from "../../firebase.config";

const PostQueueCard = ({ data, visible }) => {
  const [applicantList, setApplicantList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getApplicantList();
  }, []);

  const getApplicantList = async () => {
    try {
      setLoading(true);
      setApplicantList([]);
      const q = query(
        collection(FirebaseDB, `OwnerPosts/${data.postID}/Applicants`),
        where("isDeletedByOwner", "==", "no")
      );
      const querySnapshot = await getDocs(q);
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
      <PostCard data={data} shadow={false} />
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Queue</Text>
        </View>

        <View style={styles.queueContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="midnightblue" />
          ) : applicantList[0] ? (
            applicantList.map((applicant, index) => (
              <QueuedComponent
                updateList={getApplicantList}
                postData={data}
                key={index}
                applicant={applicant}
                visible={visible}
              />
            ))
          ) : (
            <View style={styles.placeHolderContainer}>
              <Text
                style={{ fontSize: 14, color: "gray", textAlign: "center" }}
              >
                No applicants yet, but stay optimistic! Great tenants will find
                your listing soon.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
});

export default PostQueueCard;
