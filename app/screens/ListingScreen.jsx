import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import PostQueueCard from "../components/PostQueueCard";
import { FirebaseAuth, FirebaseDB } from "../../firebase.config";
import { getDocs, collection, query, where } from "firebase/firestore";

const ListingScreen = ({ navigation }) => {
  const [propertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUserPropertyList();
  }, []);

  const getCurrentUserPropertyList = async () => {
    try {
      setPropertyList([]);
      setLoading(true);
      const q = query(
        collection(FirebaseDB, "OwnerPosts"),
        where("uid", "==", FirebaseAuth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      setLoading(false);
      querySnapshot.forEach((doc) => {
        setPropertyList((property) => [...property, doc.data()]);
      });
    } catch (err) {
      console.log(err).message;
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <HeaderComponent title="Listing" />
      <ScrollView style={styles.container}>
        {loading ? (
          <ActivityIndicator color="midnightblue" size="large" />
        ) : propertyList[0] ? (
          propertyList.map((property, index) => (
            <PostQueueCard key={index} data={property} />
          ))
        ) : (
          <View style={styles.placeHolderContainer}>
            <Text style={{ fontSize: 14, color: "gray", textAlign: "center" }}>
              You haven't listed any rooms yet. Add your boarding house,
              apartment, or dorm to start finding tenants!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListingScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    height: "100%",
  },
  placeHolderContainer: {
    flex: 1,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
