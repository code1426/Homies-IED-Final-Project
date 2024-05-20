import React, { useState, useEffect, useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FirebaseAuth, FirebaseDB } from "./firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import NavBarRenters from "./app/screens/navigations/bottomTabs/NavBarRenters.jsx";
import NavBarOwners from "./app/screens/navigations/bottomTabs/NavBarOwners.jsx";
import SignInScreen from "./app/screens/auth/SignInScreen.jsx";
import SignUpScreen from "./app/screens/auth/SignUpScreen.jsx";
import PreferredRole from "./app/screens/auth/PreferredRole.jsx";
import LogoScreen from "./app/screens/LogoScreen";
import ForgotPasswordScreen from "./app/screens/auth/ForgotPasswordScreen.jsx";
import IntroSlide1 from "./app/screens/intro/IntroSlide1.jsx";
import IntroSlide2 from "./app/screens/intro/IntroSlide2.jsx";
import IntroSlide3 from "./app/screens/intro/IntroSlide3.jsx";

import {
  UserContext,
  PinContext,
  AppliedContext,
  AddPropertyContext,
  MessageContext,
  MessageStateContext,
  ApplicantContext,
} from "./Contexts.js";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [pinState, setPinState] = useState(false);
  const [appliedState, setAppliedState] = useState(false);
  const [addState, setAddState] = useState(0);
  const [messageState, setMessageState] = useState(0);

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
          console.log("Error onAuthStateChanged: ", err.message);
        }
      });
    } catch (err) {
      console.log("Error fetching user Data: ", err.message);
    }
  };

  // Message Context
  const INITIAL_STATE = {
    MessageId: "null",
    user: {},
  };

  const MessageReducer = (state, action) => {
    switch (action.type) {
      case "MESSAGE_PRESSED":
        return {
          user: action.payload,
          MessageId:
            user.uid > action.payload.uid
              ? user.uid + action.payload.uid
              : action.payload.uid + user.uid,
        };

      default:
        return state;
    }
  };

  const MyTheme = {
    dark: false,
    colors: {
      primary: "rgb(255, 45, 85)",
      background: "rgb(242, 242, 242)",
      card: "rgb(255, 255, 255)",
      text: "rgb(28, 28, 30)",
      border: "rgb(199, 199, 204)",
      notification: "rgb(255, 69, 58)",
    },
  };

  const [state, dispatch] = useReducer(MessageReducer, INITIAL_STATE);

  const [applicant, setApplicant] = useState(null);

  return (
    <ApplicantContext.Provider value={{ applicant, setApplicant }}>
      <MessageStateContext.Provider value={{ messageState, setMessageState }}>
        <AddPropertyContext.Provider value={{ addState, setAddState }}>
          <AppliedContext.Provider value={{ appliedState, setAppliedState }}>
            <PinContext.Provider value={{ pinState, setPinState }}>
              <UserContext.Provider value={user}>
                <MessageContext.Provider value={{ data: state, dispatch }}>
                  <NavigationContainer theme={MyTheme}>
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
                              name="NavBarOwners"
                              component={NavBarOwners}
                            />
                          ) : (
                            <Stack.Screen
                              name="NavBarRenters"
                              component={NavBarRenters}
                            />
                          )}
                        </>
                      )}

                      {!user && (
                        <>
                          <Stack.Screen
                            name="LogoScreen"
                            component={LogoScreen}
                          />
                          <Stack.Screen
                            name="SignIn"
                            component={SignInScreen}
                          />
                          <Stack.Screen
                            name="SignUp"
                            component={SignUpScreen}
                          />
                          <Stack.Screen
                            name="ForgotPassword"
                            component={ForgotPasswordScreen}
                          />
                          <Stack.Screen name="Role" component={PreferredRole} />
                          <Stack.Screen name="Slide1" component={IntroSlide1} />
                          <Stack.Screen name="Slide2" component={IntroSlide2} />
                          <Stack.Screen name="Slide3" component={IntroSlide3} />
                        </>
                      )}
                    </Stack.Navigator>
                  </NavigationContainer>
                </MessageContext.Provider>
              </UserContext.Provider>
            </PinContext.Provider>
          </AppliedContext.Provider>
        </AddPropertyContext.Provider>
      </MessageStateContext.Provider>
    </ApplicantContext.Provider>
  );
}
