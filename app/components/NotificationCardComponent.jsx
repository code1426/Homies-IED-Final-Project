import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

function NotificationCardComponent({
  profilePic,
  notificationContent,
  timePassed,
}) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.profilePicStyle}
        source={profilePic}
      />
      <Text style={styles.notifContent}>{notificationContent}</Text>
      <Text style={styles.timePassedStyle}>{timePassed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D9D9D9',
    marginHorizontal: 40,
    marginVertical: 5,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  profilePicStyle: {
    // alignSelf: 'center',
    width: 55,
    height: 55,
    borderRadius: 27.5,
    // marginLeft: 35,
    margin: 10,
    resizeMode: 'cover',
  },
  notifContent: {
    margin: 10,
    marginLeft: 5,
    marginBottom: 25,
    width: 240,
  },
  timePassedStyle: {
    position: 'absolute',
    bottom: 12,
    right: 20,
    fontWeight: 'bold',
  },
});

export default NotificationCardComponent;
