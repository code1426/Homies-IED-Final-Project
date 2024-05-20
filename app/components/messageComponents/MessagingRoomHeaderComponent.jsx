import {
  StyleSheet,
  Text,
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
          source={require("../../assets/backIcon.png")}
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
      <Image source={profilePic} style={styles.profilePic} />
      <Text style={styles.header}>{title}</Text>
    </SafeAreaView>
  );
};

export default MessagingRoomHeaderComponent;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#8bb5ef",
    marginTop: Platform.OS === "android" ? 26 : 0,
    alignItems: "center",
    height: 72,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
  },
  profilePic: {
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    resizeMode: "cover",
  },
  backButton: {
    marginRight: 12,
  },
  backButtonImage: {
    width: 25,
    height: 25,
  },
});
