import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const MessagingRoomHeaderComponent = ({ title, profilePic }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require("../assets/backIcon.png")}
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
      <Image
        // source={require('../assets/placeholder.png')}
        source={profilePic}
        style={styles.profilePic}
      />
      <Text style={styles.header}>{title}</Text>
    </SafeAreaView>
  );
};

export default MessagingRoomHeaderComponent;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#0093D6",
    marginTop: Platform.OS === "android" ? 26 : 0,
    alignItems: "center",
    // justifyContent: 'center',
    height: 72,
    flexDirection: "row",
    paddingHorizontal: 20,
    // borderBottomWidth: 10,
    // borderBottomColor: '#E5F0F6',
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  profilePic: {
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    resizeMode: "cover",
    // marginLeft: 10,
  },
  backButton: {
    // backgroundColor: 'red',
    marginRight: 12,
  },
  backButtonImage: {
    width: 25,
    height: 25,
  },
});
