import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

// import

// Screens
import HomeScreen from '../screens/HomeScreen';
// import PinnedScreen from '../screens/PinnedScreen';
import ListingScreen from '../screens/ListingScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddPropertyScreen from '../screens/AddPropertyScreen';

const Tab = createBottomTabNavigator();

// Screen Names Renters View
const home = 'Home';
const listing = 'Listing';
const messages = 'Messages';
const settings = 'Settings';
const addProperty = 'AddProperty';

// Deactive Icon Images
const homeIcon = require('../assets/navigationBarIcons/nonactiveHome.png');
const listIcon = require('../assets/navigationBarIcons/inactiveListIcon.png');
const messagesIcon = require('../assets/navigationBarIcons/nonactiveMessages.png');
const settingsIcon = require('../assets/navigationBarIcons/nonactiveSettings.png');

// Active Icon Images
const activeHomeIcon = require('../assets/navigationBarIcons/activeHome.png');
const activePinnedIcon = require('../assets/navigationBarIcons/activePin.png');
const activeMessagesIcon = require('../assets/navigationBarIcons/activeMessages.png');
const activeSettingsIcon = require('../assets/navigationBarIcons/activeSettings.png');

// Middle Button
const addPropertyIcon = require('../assets/navigationBarIcons/addPropertyIcon.png');

function NavBarOwners() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={home}
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: { paddingHorizontal: 7 },
          tabBarIcon: ({ focused }) => {
            let iconName;
            let styleType;
            let routeName = route.name;

            if (routeName === home) {
              iconName = focused ? activeHomeIcon : homeIcon;
              styleType = styles.styleSmallIcons;
            } else if (routeName === listing) {
              iconName = focused ? activePinnedIcon : listIcon;
              styleType = styles.styleSmallIcons;
            } else if (routeName === messages) {
              iconName = focused ? activeMessagesIcon : messagesIcon;
              styleType = styles.styleSmallIcons;
            } else if (routeName === settings) {
              iconName = focused ? activeSettingsIcon : settingsIcon;
              styleType = styles.styleSmallIcons;
            } else if (routeName === addProperty) {
              iconName = addPropertyIcon;
              styleType = styles.styleMiddleIcon;
            }
            if (routeName != addProperty)
              return (
                <View>
                  <Image
                    source={iconName}
                    style={styleType}
                    resizeMode='contain'
                  />
                </View>
              );
            else
              return (
                <View style={[styles.midIcon]}>
                  <View style={[styles.midIconShadow]}>
                    <Image
                      source={iconName}
                      style={styleType}
                      resizeMode='contain'
                    />
                  </View>
                </View>
              );
          },
        })}>
        <Tab.Screen
          name={home}
          component={HomeScreen}
        />
        <Tab.Screen
          name={listing}
          component={ListingScreen}
        />
        <Tab.Screen
          name={addProperty}
          component={AddPropertyScreen}
        />
        <Tab.Screen
          name={messages}
          component={MessagesScreen}
        />
        <Tab.Screen
          name={settings}
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  smallIconsView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleSmallIcons: {
    width: 25,
    height: 25,
    top: 7,
  },
  midIcon: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 60,
    bottom: 10, 
  },
  styleMiddleIcon: {
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  midIconShadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 3.5, 
  },
});

export default NavBarOwners;
