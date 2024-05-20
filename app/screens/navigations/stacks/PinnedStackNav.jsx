import { StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PinnedScreen from "../../PinnedScreen";
import PostDetailScreen from "../../homeStacks/PostDetailScreen";

const Stack = createNativeStackNavigator();

const PinnedStackNav = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Pinned" component={PinnedScreen} />
      <Stack.Screen
        name="postDetails"
        component={PostDetailScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontWeight: "bold", color: "white" },
          headerStyle: { backgroundColor: "#4285F4", color: "white" },
          headerTitleAlign: "center",
          headerTitle: "Room Details",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Pinned");
                // navigation.goBack()
              }}
            >
              <Image
                source={require("../../../assets/backIcon.png")}
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
