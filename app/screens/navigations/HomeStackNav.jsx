import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostDetailScreen from '../PostDetailScreen.jsx';
import HomeScreen from '../HomeScreen';
import NotificationScreen from '../NotificationScreen.jsx';

const Stack = createNativeStackNavigator();

const HomeStackNav = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {height: 200}
      }}>
      <Stack.Screen
        name='home'
        component={HomeScreen}
      />

      <Stack.Screen
        name='postDetails'
        component={PostDetailScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontWeight: 'bold', color: 'white' },
          headerStyle: { backgroundColor: '#4285F4', color: 'white' },
          headerTitleAlign: 'center',
          headerTitle: 'Room Details',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../assets/backIcon.png')}
                style={styles.button}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name='Notifications'
        component={NotificationScreen}
      />
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
