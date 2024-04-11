import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppliedScreen from '../AppliedScreen';

const Stack = createNativeStackNavigator();

const AppliedStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Applied" component={AppliedScreen} />
    </Stack.Navigator>
  )
}

export default AppliedStackNav

const styles = StyleSheet.create({})