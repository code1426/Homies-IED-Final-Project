import React from 'react';
import {
  SafeAreaView,
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// name is just a string of a name of the person
// profilePic property must have a req('img') as input
// latest_message is a string remove the {} and just use quotations
// time is the time the last message has been sent remove the {} and just use quotations

function Message({ name, profilePic, latestMessage, time }) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.pressableContent}>
        <Image
          source={profilePic}
          style={styles.profilePicStyle}
        />
        <View style={[styles.messageContent]}>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.message}>{latestMessage}</Text>
        </View>
        <View style={[styles.updateSeen]}>
          <Text style={styles.timeUpdated}>{time}</Text>
          <Image
            source={profilePic}
            style={styles.messageSeenProfileStyle}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    alignItems: 'stretch',
    // flex: 1,
    // flexDirection: 'column',
  },
  pressableContent: {
    height: 79,
    backgroundColor: 'white',
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
  },
  profilePicStyle: {
    alignSelf: 'center',
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginLeft: 35,
    resizeMode: 'cover',
  },
  messageContent: {
    width: 227,
    left: 16,
    marginTop: 15,
  },
  profileName: {
    fontSize: 16.5,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  updateSeen: {
    direction: 'rtl',
    alignSelf: 'center',
    right: 21,
    position: 'absolute',
  },
  timeUpdated: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  messageSeenProfileStyle: {
    // alignSelf: 'center',
    width: 21,
    height: 21,
    borderRadius: 10.5,
    resizeMode: 'cover',
  },
});

export default Message;
