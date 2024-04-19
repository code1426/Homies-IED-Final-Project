import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

// import

// Screens
import AddPropertyScreen from '../screens/AddPropertyScreen';

// StackNav Screens
import HomeStackNav from '../screens/navigations/HomeStackNav';
import ListingStackNav from '../screens/navigations/ListingStackNav';
import MessageStackNav from '../screens/navigations/MessageStackNav';
import SettingStackNav from '../screens/navigations/SettingStackNav';

const Tab = createBottomTabNavigator();

// Screen Names Renters View
const home = 'HomeStackNav'; // changed to stack nav
const listing = 'ListingStackNav'; // changed to stack nav
const messages = 'MessagesStackNav'; // changed to stack nav
const settings = 'SettingsStackNav'; // changed to stack nav
const addProperty = 'AddProperty';

// Deactive Icon Images
const homeIcon = require('../assets/navigationBarIcons/nonactiveHome.png');
const listIcon = require('../assets/navigationBarIcons/inactiveListIcon.png');
const messagesIcon = require('../assets/navigationBarIcons/nonactiveMessages.png');
const settingsIcon = require('../assets/navigationBarIcons/nonactiveSettings.png');

// Active Icon Images
const activeHomeIcon = require('../assets/navigationBarIcons/activeHome.png');
const activeListIcon = require('../assets/navigationBarIcons/activeList.png'); // to be changed the icon to activeList
const activeMessagesIcon = require('../assets/navigationBarIcons/activeMessages.png');
const activeSettingsIcon = require('../assets/navigationBarIcons/activeSettings.png');

// Middle Button
const addPropertyIcon = require('../assets/navigationBarIcons/addPropertyIcon.png');

function NavBarOwners() {
  return (
      <Tab.Navigator
        initialRouteName={home}
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            let iconName;
            let styleType;
            let routeName = route.name;

            if (routeName === home) {
              iconName = focused ? activeHomeIcon : homeIcon;
              styleType = styles.styleSmallIcons;
            } else if (routeName === listing) {
              iconName = focused ? activeListIcon : listIcon;
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
          component={HomeStackNav} // changed all components to stackNav
        />
        <Tab.Screen
          name={listing}
          component={ListingStackNav}
        />
        <Tab.Screen
          name={addProperty}
          component={AddPropertyScreen}
        />
        <Tab.Screen
          name={messages}
          component={MessageStackNav}
        />
        <Tab.Screen
          name={settings}
          component={SettingStackNav}
        />
      </Tab.Navigator>
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
    top: Platform.OS === 'ios' ? 7 : 0,
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
