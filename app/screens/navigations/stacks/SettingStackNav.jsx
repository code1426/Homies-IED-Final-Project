import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../../settingsStacks/SettingsScreen";
import PrivacyScreen from "../../settingsStacks/PrivacyScreen";
import RolesScreen from "../../settingsStacks/RolesScreen";
import EditProfileScreen from "../../settingsStacks/EditProfileScreen";

const Stack = createNativeStackNavigator();

const SettingStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Edit Profile" component={EditProfileScreen} />

      <Stack.Screen name="Privacy" component={PrivacyScreen} />

      <Stack.Screen name="Roles" component={RolesScreen} />
    </Stack.Navigator>
  );
};

export default SettingStackNav;

const styles = StyleSheet.create({});
