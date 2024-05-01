import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  SafeAreaView,
} from 'react-native';
import React from 'react';

const MessagingRoomHeaderComponent = ({ title, profilePic }) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <Image
        // source={require('../assets/placeholder.png')}
        source={profilePic}
        style={styles.profilePic}
      />
      <Text style={styles.header}>{title}</Text>
    </SafeAreaView>
  );
};

export default MessagingRoomHeaderComponent;

const styles = StyleSheet.create({
  headerContainer: {
    // backgroundColor: '#0093D6',
    marginTop: Platform.OS === 'android' ? 26 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    flexDirection: 'row',
    borderBottomWidth: 10,
    borderBottomColor: '#E5F0F6',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profilePic: {
    alignSelf: 'center',
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 15,
    resizeMode: 'cover',
    // marginLeft: 10,
  },
});
