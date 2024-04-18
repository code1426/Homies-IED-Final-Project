import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PinnedScreen from "../PinnedScreen";
import PostDetailScreen from "../PostDetailScreen";

const Stack = createNativeStackNavigator();

const PinnedStackNav = ({ navigation, route }) => {
  const { currentUser } = route.params;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        initialParams={{ currentUser: currentUser }}
        name="Pinned"
        component={PinnedScreen}
      />
      <Stack.Screen
        name='postDetails'
        component={PostDetailScreen}
        initialParams={{currentUser: currentUser}}
        options={{
          headerShown: true,
          headerTitleStyle: { fontWeight: 'bold', color: 'white' },
          headerStyle: { backgroundColor: '#4285F4', color: 'white' }, 
          headerTitleAlign: 'center',
          headerTitle: 'Room Details',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Pinned");
                // navigation.goBack()
              }}>
              <Image
                source={require('../../assets/backIcon.png')}
                style={styles.button}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default PinnedStackNav;

const styles = StyleSheet.create({
  button: {
    width: 25,
    height: 25,
  },
});
