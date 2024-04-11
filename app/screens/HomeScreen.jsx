import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import PostCard from "../components/PostCard";
import CategoryButton from "../components/CategoryButton.jsx";

import { FirebaseDB } from "../../firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";

function HomeScreen({ navigation }) {

  const [categoryName, setCategoryName] = useState("All");
  const [propertyList, setPropertyList] = useState([]);

  const propertyTypes = ["All", "Apartment", "Boarding House", "Dorm"];

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

  const getFilteredPropertyList = async (name) => {
    setPropertyList([]);
    const q = query(
      collection(FirebaseDB, "OwnerPosts"),
      where("propertyType", "==", name)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setPropertyList((property) => [...property, doc.data()]);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setCategoryName("All");
      getAllPropertyList();
      setRefreshing(false);
    }, 750);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  marginTop: 12,
                }}
                source={require("../assets/profile.jpg")}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
              >
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 25,
                    marginTop: 12,
                    resizeMode: "contain",
                  }}
                  source={require("../assets/notification.png")}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.tagline}>Find Your Dream Home</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <TouchableOpacity
                style={[styles.searchbar, styles.shadow]}
                onPress={() => console.log("Search")}
              >
                <Text style={styles.searchText}>Search</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filter}
                onPress={() => console.log("Filter tapped")}
              >
                <Image
                  style={{ height: 20, width: 20, alignSelf: "center" }}
                  source={require("../assets/filter.png")}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {propertyTypes.map((value, index) => (
                <CategoryButton
                  key={index}
                  value={value}
                  setSelectedValue={setCategoryName}
                  selectedValue={categoryName}
                  getAllList={getAllPropertyList}
                  getList={getFilteredPropertyList}
                />
              ))}
            </View>
          </View>

          <View style={styles.postsContainer}>
            {propertyList.map((property, index) => (
              <PostCard key={index} data={property} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: 26,
    paddingHorizontal: 30,
    marginBottom: 30,
    width: "100%",
  },
  header: {
    flexDirection: "column",
    marginTop: Platform.OS === "android" ? 26 : 0,
    width: "100%",
  },
  tagline: {
    width: 200,
    marginVertical: 30,
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 28,
    lineHeight: 29,
    color: "black",
  },
  postsContainer: {
    flexDirection: "column",
    marginTop: 12,
    // paddingVertical: 8
  },
  profile: {
    alignSelf: "flex-start",
    padding: 20,
    height: 45,
    width: 37,
  },
  searchText: {
    marginLeft: 20,
    fontSize: 14,
    fontWeight: "bold",
    color: "grey",
    // alignSelf: 'center',
    // paddingTop: 10,
  },
  searchbarContainer: {
    height: 55,
    width: "60%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  searchbar: {
    height: 40,
    width: "75%",
    backgroundColor: "white",
    borderRadius: 25,
    marginRight: 12,
    // alignItems: 'center',
    justifyContent: "center",
  },
  filter: {
    height: 40,
    width: 45,
    backgroundColor: "midnightblue",
    borderRadius: 13,
    justifyContent: "center",
  },
  shadow: {
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
});

export default HomeScreen;
