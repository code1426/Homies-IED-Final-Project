import React, { useState, useEffect, useContext } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import PostCard from "../components/PostCard";
import CategoryButton from "../components/CategoryButton.jsx";

import { FirebaseDB } from "../../firebase.config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import { AddPropertyContext, UserContext } from "../../Contexts.js";

function HomeScreen({ navigation }) {
  const [categoryName, setCategoryName] = useState("All");
  const [propertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { addState } = useContext(AddPropertyContext);
  const currentUser = useContext(UserContext);

  const propertyTypes = ["All", "Apartment", "Boarding House", "Dorm"];

  useEffect(() => {
    getAllPropertyList();
  }, [addState]);

  const getAllPropertyList = async () => {
    try {
      setPropertyList([]);
      setLoading(true);
      const q = query(
        collection(FirebaseDB, "OwnerPosts"),
        orderBy("created_at", "desc")
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        setPropertyList((property) => [...property, doc.data()]);
      });
      setLoading(false);
    } catch (err) {
      console.log(err).message;
      setLoading(false);
    }
  };

  const getFilteredPropertyList = async (name) => {
    try {
      setPropertyList([]);
      setLoading(true);
      const q = query(
        collection(FirebaseDB, "OwnerPosts"),
        // orderBy("created_at", "desc"),
        where("propertyType", "==", name)
      );

      const querySnapshot = await getDocs(q);
      setLoading(false);
      querySnapshot.forEach((doc) => {
        // console.log("ID", doc.id)
        setPropertyList((property) => [...property, doc.data()]);
      });
    } catch (err) {
      console.log(err).message;
      setLoading(false);
    }
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
                source={{ uri: currentUser.photoURL }}
              />
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Alert",
                    "This notification feature is coming soon! We apologize for the inconvenience."
                  )
                }
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
                onPress={() => navigation.navigate("Search")}
              >
                <Image
                  style={styles.searchIcon}
                  source={require("../assets/search.png")}
                />
                <Image
                  style={styles.line}
                  source={require("../assets/line.png")}
                />
                <Text style={styles.searchText}>Search</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.filter}
                onPress={() => console.log("Filter tapped")}
              >
                <Image
                  style={{ height: 20, width: 20, alignSelf: "center" }}
                  source={require("../assets/filter.png")}
                />
              </TouchableOpacity> */}
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
            {loading ? (
              <ActivityIndicator size="large" color="midnightblue" />
            ) : propertyList[0] ? (
              propertyList.map((property, index) => (
                <PostCard key={index} data={property} />
              ))
            ) : (
              <View style={styles.placeHolderContainer}>
                <Text
                  style={{ fontSize: 14, color: "gray", textAlign: "center" }}
                >
                  The feed is currently empty. Check back soon for new listings!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginTop: 24,
  },
  profile: {
    alignSelf: "flex-start",
    padding: 20,
    height: 45,
    width: 37,
  },
  searchText: {
    // marginLeft: 20,
    fontSize: 16,
    fontWeight: "500",
    color: "grey",
  },
  searchbar: {
    flexDirection: "row",
    flex: 1,
    height: 46,
    backgroundColor: "white",
    borderRadius: 23,
    // marginRight: 12,
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "midnightblue",
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
  placeHolderContainer: {
    flex: 1,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginLeft: 2,
  },
  line: {
    width: 12,
    height: 24,
    marginRight: 6,
  },
});

export default HomeScreen;
