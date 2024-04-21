import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";

const QueuedComponent = ({ applicant }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={require("../assets/profile.jpg")}
        />
        <Text numberOfLines={1} style={styles.name}>
          {applicant.firstName}
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonLabel}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelContainer}>
          <Image
            style={styles.cancelImage}
            source={require("../assets/cancel.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 65,
    paddingHorizontal: 12,
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    height: "100%",
    flexDirection: "row",
    alignSelf: "center",
  },
  profileContainer: {
    // flex: 2,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    // backgroundColor: 'red'
  },
  profile: {
    height: 40,
    width: 40,
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  name: {
    fontWeight: "500",
    fontSize: 16,
  },
  buttonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    columnGap: 8,
    // flex: 1
  },
  approveContainer: {
    width: "70%",
    height: "100%",
    justifyContent: "center",
  },
  cancelImage: {
    height: 25,
    width: 25,
    borderRadius: 25,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: "limegreen",
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default QueuedComponent;
