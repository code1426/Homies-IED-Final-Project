import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import HeaderComponent from "../components/HeaderComponent";
import PostQueueCard from "../components/listingComponents/PostQueueCard";
import { FirebaseAuth, FirebaseDB } from "../../firebase.config";
import { getDocs, collection, query, where } from "firebase/firestore";
import { AddPropertyContext } from "../../Contexts";
import ViewProfileScreen from "../components/homeComponents/ViewProfile";

const ListingScreen = ({ navigation }) => {
  const [propertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addState } = useContext(AddPropertyContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getCurrentUserPropertyList();
      setRefreshing(false);
    }, 750);
  }, []);

  useEffect(() => {
    getCurrentUserPropertyList();
  }, [addState]);

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
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <ViewProfileScreen setModalVisible={setModalVisible} />
      </Modal>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.container}
      >
        {loading ? (
          <ActivityIndicator color="midnightblue" size="large" />
        ) : propertyList[0] ? (
          propertyList.map((property, index) => (
            <PostQueueCard
              key={index}
              data={property}
              visible={setModalVisible}
            />
          ))
        ) : (
          <View style={styles.placeHolderContainer}>
            <Text style={{ fontSize: 14, color: "gray", textAlign: "center" }}>
              You haven't listed any rooms yet. Add your boarding house,
              apartment, or dorm to start finding tenants!
            </Text>
          </View>
        )}
        <View style={{ height: 140, width: "auto" }}></View>
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
