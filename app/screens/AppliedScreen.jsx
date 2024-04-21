import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { getDocs, collection } from "firebase/firestore";

import HeaderComponent from "../components/HeaderComponent";
import PostCard from "../components/PostCard";
import { FirebaseDB } from "../../firebase.config";
import { UserContext } from "../../userContext";

import AppliedPostCard from "../components/AppliedPostCard";

function AppliedScreen(props) {
  const [appliedPropertyList, setAppliedPropertyList] = useState([]);
  const currentUser = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getAppliedPropertyList();
      setRefreshing(false);
    }, 750);
  }, []);

  useEffect(() => {
    getAppliedPropertyList();
  }, []);

  const getAppliedPropertyList = async () => {
    try {
      setLoading(true);
      setAppliedPropertyList([]);
      const querySnapshot = await getDocs(
        collection(FirebaseDB, `Users/${currentUser.uid}/Applied`)
      );
      setLoading(false);
      querySnapshot.forEach((doc) => {
        setAppliedPropertyList((property) => [...property, doc.data()]);
      });
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  };
  return (
    <SafeAreaView>
      <HeaderComponent title="Applied" />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={styles.container}>
        <View style={styles.appliedContainer}>
        {loading ? (
          <ActivityIndicator color="midnightblue" size="large" />
        ) : appliedPropertyList[0] ? (
          appliedPropertyList.map((property, index) => (
            <AppliedPostCard key={index} data={property} />
          ))
        ) : (
          <View style={styles.placeHolderContainer}>
            <Text style={{ fontSize: 14, color: "gray", textAlign: "center" }}>
              You haven't listed any rooms yet. Add your boarding house,
              apartment, or dorm to start finding tenants!
            </Text>
          </View>
        )}
        </View>
        <View style={{ height: 80 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AppliedScreen;

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
  appliedContainer: {
    flexDirection: "column",
    marginTop: 12,
    marginBottom: 30,
  },
});
