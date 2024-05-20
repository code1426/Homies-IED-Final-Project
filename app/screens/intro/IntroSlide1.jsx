import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function IntroSlide1({ navigation }) {
  const back = require("../../assets/Faster_search.png");
  return (
    <View style={styles.container}>
      <Image
        source={back}
        style={[
          styles.backImg,
          { width: "100%", height: "40%", marginTop: "40%", right: "16%" },
        ]}
      />

      <View style={styles.formContainer}>
        <Text style={styles.Text1}>Faster Search</Text>
        <Text style={styles.Text2}>
          convenient platform for renters to search for properties, view
          listings, schedule viewings, and submit rental applications all in one
          place
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Slide2")}
          style={styles.Text3}
        >
          <Text style={styles.Text}>Next</Text>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E225C",
  },
  formContainer: {
    backgroundColor: "#FBFBFB",
    flex: 1,
    borderRadius: 20,
    padding: 20,
    position: "absolute",
    top: "50%",
    bottom: "0%",
    left: "0%",
    right: "0%",
    alignItems: "center",
  },
  Text1: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: "5%",
  },
  Text2: {
    fontWeight: "200",
    fontSize: 18,
    color: "#444444",
    textAlign: "center",
    marginTop: "10%",
  },
  Text3: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#538DAD",
    alignItems: "center",
    borderRadius: 20,
    position: "absolute",
    bottom: 50,
    color: "#538DAD",
  },
  Text: {
    width: 200,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  arrow: {
    color: "white",
    right: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
});
