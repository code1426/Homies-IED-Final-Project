import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FirebaseAuth } from "../../../firebase.config";

function ButtonSettings({
  settingName,
  settingIcon,
  tailIcon,
  tailIconActive,
}) {
  const navigation = useNavigation();
  const [notificationsActive, setNotificationsActive] = useState(true);
  const [tailIconPlaced, setIconPlaced] = useState(tailIcon);

  const handleClick = () => {
    if (settingName === "Notifications") {
      if (notificationsActive === true) {
        // icon = tailIconActive;
        setIconPlaced(tailIconActive);
      } else {
        setIconPlaced(tailIcon);
      }

      setNotificationsActive(!notificationsActive);

      // notifications should be manipulated here -----------------------------------------------------------------------
    } else if (settingName === "Log Out") {
      FirebaseAuth.signOut();
    } else {
      navigation.navigate(settingName);
    }
  };

  return (
    <TouchableOpacity onPress={() => handleClick()} style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.icon} source={settingIcon} />
        <Text style={styles.settingTitle}>{settingName}</Text>
        <View style={styles.arrowContainer}>
          <Image style={styles.arrow} source={tailIconPlaced} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    width: "100%",
    height: 42,
    borderRadius: 25,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowColor: "black",
    shadowRadius: 2,
  },
  content: {
    width: "100%",
    flexDirection: "row",
    left: 36,
  },
  settingTitle: {
    left: 10,
    fontWeight: "bold",
  },
  icon: {
    width: 18,
    height: 18,
  },
  arrowContainer: {
    position: "absolute",
    right: 53,
  },
  arrow: {
    width: 20,
    height: 20,
  },
});

export default ButtonSettings;
