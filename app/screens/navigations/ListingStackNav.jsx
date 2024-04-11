import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListingScreen from '../ListingScreen';

const Stack = createNativeStackNavigator();

const ListingStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Listing" component={ListingScreen} />
    </Stack.Navigator>
  )
}

export default ListingStackNav

const styles = StyleSheet.create({})