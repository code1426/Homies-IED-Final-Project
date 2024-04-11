import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessagesScreen from '../MessagesScreen';

const Stack = createNativeStackNavigator();

const MessageStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Messages" component={MessagesScreen} />
    </Stack.Navigator>
  )
}

export default MessageStackNav

const styles = StyleSheet.create({})