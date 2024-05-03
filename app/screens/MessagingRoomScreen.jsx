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
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// import HeaderComponent from "../components/HeaderComponent";
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
import { useRef } from 'react';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

function MessagingRoomScreen({ navigation }) {
  const currentUser = useContext(UserContext);
  const { data } = useContext(MessageContext);
  const [messages, setMessages] = useState([]);
  // const ref = useRef();

  // useEffect(() => {
  //   ref.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);
  // console.log(currentUser);
  console.log(data.MessageId);

  useEffect(() => {
    try {
      const unSub = onSnapshot(
        doc(FirebaseDB, 'Messages', data.MessageId),
        (doc) => {
          doc.exists() && setMessages(doc.data().messages.reverse());
        }
      );
      return () => {
        unSub();
      };
    } catch (e) {
      console.log(e.message);
    }
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
      setText('');
      if (text !== '') {
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
          [data.MessageId + '.date']: Timestamp.now().toDate().toString().split(" ")[4].split(":"),
        });

        await updateDoc(doc(FirebaseDB, 'UserMessages', data.user.uid), {
          [data.MessageId + '.latestMessage']: {
            text,
          },
          [data.MessageId + '.date']: Timestamp.now().toDate().toString().split(" ")[4].split(":"),
        });
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -55}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <MessagingRoomHeaderComponent
          title={data.user.firstName + ' ' + data.user.lastName}
          profilePic={{ uri: data.user.photoURL }}
        />
        <FlatList
          keyboardDismissMode='interactive'
          style={styles.room}
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          inverted
        />
        <View style={styles.inputContainer}>
          <TextInput
            // textAlign="center"
            // numberOfLines={4}
            // multiline={true}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'F5F5F5',
    flexDirection: 'column',
  },
  room: {
    // backgroundColor: "white",
  },
  inputContainer: {
    // marginLeft: 30,
    // flex: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    // backgroundColor: "#E0E0E0",
    justifyContent: 'center',
    alignItems: 'center',
    height: 72,
  },
  input: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    height: 40,
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderRadius: 15,
    padding: 8,
    minHeight: 40,
    fontSize: 16,
    // backgroundColor: "red",
    // maxHeight: 0,
  },
  sendButton: {
    width: 25,
    height: 25,
    // marginHorizontal: 20,
  },
});
export default MessagingRoomScreen;
