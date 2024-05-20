import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListingScreen from "../../ListingScreen";
import PostDetailScreen from "../../homeStacks/PostDetailScreen";
import MessagingRoomScreen from "../../messageStacks/MessagingRoomScreen";

const Stack = createNativeStackNavigator();

const ListingStackNav = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Listing" component={ListingScreen} />
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
                navigation.navigate("Listing");
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

      <Stack.Screen name="MessagingRoom" component={MessagingRoomScreen} />
    </Stack.Navigator>
  );
};

export default ListingStackNav;

const styles = StyleSheet.create({
  button: {
    width: 25,
    height: 25,
  },
});
