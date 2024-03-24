import React from 'react';
import Messages from '../components/Messages';
import { Text, SafeAreaView, Image, StyleSheet } from 'react-native';

function MessagesScreen(props) {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Messages</Text>
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
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 45,
    marginTop: 15
  },
  screen: {
    flex: 1,
    backgroundColor: '#ECEFF6',
  },
});

export default MessagesScreen;
