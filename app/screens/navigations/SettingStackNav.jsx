import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../SettingsScreen';
import PrivacyScreen from '../PrivacyScreen';
import RolesScreen from '../RolesScreen';
import EditProfileScreen from '../EditProfileScreen';

const Stack = createNativeStackNavigator();

const SettingStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name='Settings'
        component={SettingsScreen}
      />
      <Stack.Screen
        name='Edit Profile'
        component={EditProfileScreen}
      />

      <Stack.Screen
        name='Privacy'
        component={PrivacyScreen}
      />

      <Stack.Screen
        name='Roles'
        component={RolesScreen}
      />
    </Stack.Navigator>
  );
};

export default SettingStackNav;

const styles = StyleSheet.create({});
