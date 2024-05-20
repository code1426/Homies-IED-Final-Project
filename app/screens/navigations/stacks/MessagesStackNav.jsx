import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessagesScreen from "../../messageStacks/MessagesScreen";
import MessagingRoomScreen from "../../messageStacks/MessagingRoomScreen";

const Stack = createNativeStackNavigator();

const MessageStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="MessagingRoom" component={MessagingRoomScreen} />
    </Stack.Navigator>
  );
};

export default MessageStackNav;
