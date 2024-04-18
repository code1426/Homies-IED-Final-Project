import React, { useState, useEffect } from "react";

import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FirebaseAuth, FirebaseDB } from "./firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import NavBarRenters from "./app/components/NavBarRenters";
import NavBarOwners from "./app/components/NavBarOwners";
import SignInScreen from "./app/screens/SignInScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import PreferredRole from "./app/screens/PreferredRole";
import LogoScreen from "./app/screens/LogoScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      onAuthStateChanged(FirebaseAuth, async (user) => {
        try {
          console.log("USER: ", user);

          if (user && user?.emailVerified) {
            userDocRef = doc(FirebaseDB, "Users", user.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
              console.log("Document data:", docSnap.data());
              setUser(docSnap.data());
            } else {
              console.log("No user logged in");
            }
          } else {
            setUser(null);
          }
        } catch (err) {
          console.log("error onAuthStateChanged: ", err.message);
        }
      });
    } catch (err) {
      console.log("Error fetching user Data: ", err.message);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LogoScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        {user && (
          <>
            {user.role === "Owner" ? (
              <Stack.Screen
                initialParams={{ currentUser: user }}
                name="NavBarOwners"
                component={NavBarOwners}
              />
            ) : (
              <Stack.Screen
                initialParams={{ currentUser: user }}
                name="NavBarRenters"
                component={NavBarRenters}
              />
            )}
          </>
        )}

        {!user && (
          <>
            <Stack.Screen name="LogoScreen" component={LogoScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Role" component={PreferredRole} />
          </>
        )}
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
