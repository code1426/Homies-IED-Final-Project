import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PinnedScreen from '../PinnedScreen';

const Stack = createNativeStackNavigator();

const PinnedStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Pinned" component={PinnedScreen} />
    </Stack.Navigator>
  )
}

export default PinnedStackNav

const styles = StyleSheet.create({})