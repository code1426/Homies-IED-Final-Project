import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostDetailScreen from "../PostDetailScreen.jsx";
import HomeScreen from "../HomeScreen";
import NotificationScreen from "../NotificationScreen.jsx";

const Stack = createNativeStackNavigator();

const HomeStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" component={HomeScreen} />

      <Stack.Screen
        name="postDetails"
        component={PostDetailScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontWeight: "bold", color: "white" },
          headerStyle: { backgroundColor: "#4285F4", color: "white" },
          headerTitle: "Detail",
        }}
      />

      <Stack.Screen name='Notifications' component={NotificationScreen}/>
      
    </Stack.Navigator>
  );
};

export default HomeStackNav;

const styles = StyleSheet.create({});
