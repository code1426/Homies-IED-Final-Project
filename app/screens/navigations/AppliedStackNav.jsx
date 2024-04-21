import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppliedScreen from "../AppliedScreen";
import PostDetailScreen from "../PostDetailScreen";

const Stack = createNativeStackNavigator();

const AppliedStackNav = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Applied" component={AppliedScreen} />

      <Stack.Screen
        name="postDetails"
        component={PostDetailScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontWeight: "bold", color: "white" },
          headerStyle: { backgroundColor: "#4285F4", color: "white" },
          headerTitleAlign: "center",
          headerTitle: "Room Details",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Applied");
                // navigation.goBack()
              }}
            >
              <Image
                source={require("../../assets/backIcon.png")}
                style={styles.button}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AppliedStackNav;

const styles = StyleSheet.create({
  button: {
    width: 25,
    height: 25,
  },
});
