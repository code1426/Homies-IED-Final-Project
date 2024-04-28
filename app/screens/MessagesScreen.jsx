import React, { useContext, useEffect, useState } from 'react';
import Message from '../components/Message.jsx';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';

import HeaderComponent from '../components/HeaderComponent';
import {
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { FirebaseDB } from '../../firebase.config.js';
import { UserContext } from '../../Contexts.js';

function MessagesScreen(props) {
  const currentUser = useContext(UserContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(FirebaseDB, 'UserMessages', currentUser.uid),
      (doc) => {
        setMessages(doc.data());
      }
    );
    return () => {
      unsub();
    };
  }, [currentUser.uid]);

  return (
    <SafeAreaView style={styles.screen}>
      <HeaderComponent title='Messages' />
      {Object.entries(messages)?.map((message) => (
        <Message
          profilePic={{ uri: message[1].userInfo.photoURL }}
          name={message[1].userInfo.displayName}
          latestMessage={message[1].userInfo.latestMessage}
          time='8:15 PM'
        />
      ))}
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
