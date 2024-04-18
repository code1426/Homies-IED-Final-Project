import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";

import HeaderComponent from "../components/HeaderComponent";
import PostCard from "../components/PostCard";
import { FirebaseDB } from "../../firebase.config";
import {
  doc,
  query,
  getDoc,
  collection,
  where,
  getDocs,
} from "firebase/firestore";

import { useState, useEffect } from "react";

function PinnedScreen({ route }) {
  const { currentUser } = route.params;

  useEffect(() => {
    getData();
  }, [pinnedPropertyList]);

  const [pinnedPropertyList, setPinnedPropertyList] = useState([]);

  const getCurrentUserPinned = async () => {
    try {
      const currentUserRef = doc(FirebaseDB, "Users", currentUser.uid);
      const docSnap = await getDoc(currentUserRef);
      if (docSnap.exists()) {
        return docSnap.data().pinned;
      } else {
        return [];
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const getPinnedPropertyList = async () => {
    try {
      setPinnedPropertyList([]);
      const userPinnedIdList = await getCurrentUserPinned();
      const q = query(
        collection(FirebaseDB, "OwnerPosts"),
        where("postID", "in", userPinnedIdList)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setPinnedPropertyList((property) => [...property, doc.data()]);
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const getData = async () => {
    await getPinnedPropertyList();
    console.log(pinnedPropertyList);
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getData();
      setRefreshing(false);
    }, 750);
  }, []);

  return (
    <SafeAreaView>
      <HeaderComponent title="Pinned Places" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.container}
      >
        <View style={styles.pinnedContainer}>
          {pinnedPropertyList.map((property, index) => (
            <PostCard key={index} data={property} />
          ))}
        </View>
        <View style={{ height: 80 }}></View>
      </ScrollView>
      {/* <View style={{height: 40, backgroundColor: 'blue'}}></View> */}
    </SafeAreaView>
  );
}

export default PinnedScreen;

const styles = StyleSheet.create({
  container: {
    // paddingTop: 26,
    paddingHorizontal: 30,
    // paddingBottom: 80,
    width: "100%",
    // backgroundColor: 'red'
    // height: "100%",
  },
  pinnedContainer: {
    flexDirection: "column",
    marginTop: 12,
    marginBottom: 30,
  },
});
