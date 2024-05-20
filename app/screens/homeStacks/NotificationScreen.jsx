import { SafeAreaView, StyleSheet } from "react-native";
import React from "react";

import HeaderComponent from "../../components/HeaderComponent";
import NotificationCardComponent from "../../components/NotificationCardComponent";

const NotificationScreen = () => {
  return (
    <SafeAreaView>
      <HeaderComponent title="Notifications" />
      <NotificationCardComponent
        profilePic={require("../../assets/settingsIcons/noProfilePlaceholder.png")}
        notificationContent="Do you want to build a snowman? aasdas asd aasd  asd asd asd asd a asda d asa sd as da da d asda sdas da sda das daa sdasd asd asd asd"
        timePassed="1min."
      />
      <NotificationCardComponent
        profilePic={require("../../assets/settingsIcons/noProfilePlaceholder.png")}
        notificationContent="Do you want to build a snowman? aasdas asd aasd  asd asd asd asd a asda d asa sd as da da d asda sdas da sda das daa sdasd asd asd asd"
        timePassed="1min."
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
