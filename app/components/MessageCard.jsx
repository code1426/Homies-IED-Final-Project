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

function MessageCard({ name, profilePic, latestMessage, time, onPress }) {
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={styles.pressableContent}
        onPress={onPress}>
        <Image
          source={profilePic}
          style={styles.profilePicStyle}
        />
        <View style={[styles.messageContent]}>
          <Text style={styles.profileName}>{name}</Text>
          <Text
            style={styles.message}
            numberOfLines={1}>
            {latestMessage}
          </Text>
        </View>
        <View>
          <Text style={styles.timeUpdated}>{`${time[1]}:${time[2]}`}</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pressableContent: {
    height: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    // borderWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#BDBDBD"
  },
  profilePicStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  profileName: {
    fontSize: 16.5,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeUpdated: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  messageSeenProfileStyle: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    resizeMode: 'cover',
  },
});

export default MessageCard;
