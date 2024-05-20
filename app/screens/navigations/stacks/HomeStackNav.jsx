import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostDetailScreen from "../../homeStacks/PostDetailScreen.jsx";
import HomeScreen from "../../homeStacks/HomeScreen.jsx";
import NotificationScreen from "../../homeStacks/NotificationScreen.jsx";
import SearchScreen from "../../homeStacks/SearchScreen.jsx";
import SearchedContentScreen from "../../homeStacks/SearchedContentScreen.jsx";

const Stack = createNativeStackNavigator();

const HomeStackNav = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { height: 200 },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />

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
                navigation.goBack();
              }}
            >
              <Image
                source={require("../../../assets/backIcon.png")}
                style={styles.button}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen name="Notifications" component={NotificationScreen} />

      <Stack.Screen name="Search" component={SearchScreen} />

      <Stack.Screen name="SearchContent" component={SearchedContentScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNav;

const styles = StyleSheet.create({
  button: {
    width: 25,
    height: 25,
  },
});
