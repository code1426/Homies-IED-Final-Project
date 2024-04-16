import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";

const SelectButton = ({ name, selectedName }) => {

  return (
    <SafeAreaView style={styles.circleContainer}>
      <TouchableOpacity>
        <Image
          style={styles.circle}
          source={
            name === selectedName
              ? require("../assets/fill.png")
              : require("../assets/circle.png")
          }
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  circleContainer: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
  },
  circle: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
  },
});
export default SelectButton;
