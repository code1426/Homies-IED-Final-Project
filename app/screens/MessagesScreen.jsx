import React from 'react';
import Messages from '../components/Messages.jsx';
import { View, Text, SafeAreaView, Image, StyleSheet, Platform } from 'react-native';

import HeaderComponent from '../components/HeaderComponent';

function MessagesScreen(props) {
  return (
    <SafeAreaView style={styles.screen}>
      <HeaderComponent title='Messages' />

      <Messages
        profilePic={require('../assets/icon.png')}
        name='Yay Me Yao'
        latestMessage='Hello, how are you?'
        time = '8:15 PM'
      />
      <Messages
        profilePic={require('../assets/icon.png')}
        name='Wansapanataym'
        latestMessage='Wassup bro'
        time = '8:15 AM'
      />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: '#ECEFF6',
  },
});

export default MessagesScreen;
