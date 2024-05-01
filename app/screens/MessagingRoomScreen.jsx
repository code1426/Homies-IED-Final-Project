import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import MessagingRoomHeaderComponent from '../components/MessagingRoomHeaderComponent';
import { MessageContext, UserContext } from '../../Contexts';
import Message from '../components/MessagingComponents/Message';
import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { FirebaseDB } from '../../firebase.config';

function MessagingRoomScreen({ navigation }) {
  const currentUser = useContext(UserContext);
  const { data } = useContext(MessageContext);
  const [messages, setMessages] = useState([]);

  console.log(currentUser);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(FirebaseDB, 'Messages', data.MessageId),
      (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      }
    );
    return () => {
      unSub();
    };
  }, [data.MessageId]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none',
        bottom: 0,
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  // Sending Message
  const [text, setText] = useState('');
  const handleSend = async () => {
    try {
      await updateDoc(doc(FirebaseDB, 'Messages', data.MessageId), {
        messages: arrayUnion({
          id: Math.random().toString(16).slice(2),
          text,
          senderId: currentUser.uid,
          data: Timestamp.now(),
        }),
      });

      await updateDoc(doc(FirebaseDB, 'UserMessages', currentUser.uid), {
        [data.MessageId + '.latestMessage']: {
          text,
        },
        [data.MessageId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(FirebaseDB, 'UserMessages', data.user.uid), {
        [data.MessageId + '.latestMessage']: {
          text,
        },
        [data.MessageId + '.date']: serverTimestamp(),
      });

      setText('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <MessagingRoomHeaderComponent
            title={data.user.displayName}
            profilePic={{ uri: data.user.photoURL }}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/backIcon.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.room}>
          {messages.map((m) => (
            <Message
              message={m}
              key={m.id}
            />
          ))}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setText}
            value={text}
          />
          <TouchableOpacity onPress={handleSend}>
            <Image
              source={require('../assets/send-message.png')}
              style={styles.sendButton}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ABCEE2',
    // top: -50,
    // paddingTop: 50,
    flex: 1,
  },
  backButton: {
    // width: 25,
    // height: 25,
    top: -47,
    left: 25,
  },
  backButtonImage: {
    width: 25,
    height: 25,
    position: 'absolute',
  },
  room: {
    backgroundColor: 'pink',
    // top: -50,
    flex: 10,
    // bottom: -35,
    // paddingTop: 40,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    // bottom: -35,
    // paddingBottom: 40,
  },
  input: {
    width: '80%',
    height: '60%',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 8,
  },
  sendButton: {
    width: 25,
    height: 25,
    margin: 10,
  },
});
export default MessagingRoomScreen;
