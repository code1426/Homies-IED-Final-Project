import React, { useState, useEffect } from "react";

import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FirebaseAuth } from "./firebase.config";
import { onAuthStateChanged } from "firebase/auth";

import NavBarRenters from "./app/components/NavBarRenters";
import NavBarOwners from "./app/components/NavBarOwners";
import SignInScreen from "./app/screens/SignInScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import PreferredRole from "./app/screens/PreferredRole";

const Stack = createNativeStackNavigator();

export default function App() {

  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   onAuthStateChanged(FirebaseAuth, (user) => {
  //     setUser(user);
  //     console.log("USER:", user);
  //   });
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{
          headerShown: false,
        }}
      >

        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Role" component={PreferredRole} />
        <Stack.Screen name="NavBarOwners" component={NavBarOwners} />
        <Stack.Screen name="NavBarRenters" component={NavBarRenters} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9CC6DE",
    alignItems: "center",
    justifyContent: "center",
  },
});
