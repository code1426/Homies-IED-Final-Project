import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';

function ButtonSettings({
  settingName,
  settingIcon,
  tailIcon,
  tailIconActive,
}) {
  const navigation = useNavigation();
  const [notificationsActive, setNotificationsActive] = useState(false);

  const [tailIconPlaced, setIconPlaced] = useState(tailIcon);

  const handleClick = () => {
    //write conditions to trigger navigation
    if (settingName === 'Notifications') {
      // temporarily disable
      setNotificationsActive(!notificationsActive);

      if (notificationsActive) {
        icon = tailIconActive;
        setIconPlaced(tailIconActive)
      } else {
        setIconPlaced(tailIcon)
      };

      // notifications should be manipulated here -----------------------------------------------------------------------
    }
    if (settingName === 'Log Out') {
      // temporarily disabled
    } else {
      navigation.navigate(settingName);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => handleClick()}
      style={styles.container}>
      <View style={styles.content}>
        <Image
          style={styles.icon}
          source={settingIcon}
        />
        <Text style={styles.settingTitle}>{settingName}</Text>
        <View style={styles.arrowContainer}>
          <Image
            style={styles.arrow}
            source={tailIconPlaced}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    // alignItems: 'stretch',
    justifyContent: 'center',
    width: '100%',
    height: 42,
    borderRadius: 25,
    marginBottom: 12,
    // flexDirection: 'column',
    // direction: 'ltr',
  },
  content: {
    // height: 'auto',
    width: '100%',
    flexDirection: 'row',
    left: 36,
  },
  settingTitle: {
    left: 10,
    fontWeight: 'bold',
  },
  icon: {
    width: 18,
    height: 18,
  },
  arrowContainer: {
    position: 'absolute',
    right: 53,
  },
  arrow: {
    width: 20,
    height: 20,
  },
});

export default ButtonSettings;
