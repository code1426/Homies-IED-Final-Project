import { SafeAreaView, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import PostQueueCard from "../components/PostQueueCard";
import { FirebaseDB } from "../../firebase.config";
import { getDocs, collection } from "firebase/firestore";

const ListingScreen = ({ navigation }) => {
  const [propertyList, setPropertyList] = useState([]);

  useEffect(() => {
    getAllPropertyList();
  }, []);

  const getAllPropertyList = async () => {
    setPropertyList([]);
    const querySnapshot = await getDocs(collection(FirebaseDB, "OwnerPosts"));

    querySnapshot.forEach((doc) => {
      setPropertyList((property) => [...property, doc.data()]);
    });
  };

  return (
    <SafeAreaView>
      <HeaderComponent title="Listing" />
      <ScrollView style={styles.container}>
        {propertyList.map((property, index) => (
          <PostQueueCard key={index} data={property} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListingScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingBottom: 130,
    height: "100%",
  },
});
