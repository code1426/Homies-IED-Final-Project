import React, { useContext, useEffect, useState } from "react";
import MessageCard from "../components/MessageCard.jsx";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Platform,
} from "react-native";

import HeaderComponent from "../components/HeaderComponent";
import {
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { FirebaseDB } from "../../firebase.config.js";
import { UserContext } from "../../Contexts.js";
import { MessageContext } from "../../Contexts.js";
import Message from "../components/MessagingComponents/Message.jsx";

function MessagesScreen({ navigation }) {
  const currentUser = useContext(UserContext);
  const { dispatch } = useContext(MessageContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(doc(FirebaseDB, "UserMessages", currentUser.uid));
    const unsub = onSnapshot(q, (doc) => {
      setMessages(doc.data());
    });
    return () => {
      unsub();
    };
  }, [currentUser.uid]);

  const handleSelect = (user) => {
    console.log(user);
    dispatch({ type: "MESSAGE_PRESSED", payload: user });
    navigation.navigate("MessagingRoom");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <HeaderComponent title="Messages" />
      {Object.entries(messages)?.map(
        (message) => (
          console.log(message[1].latestMessage0),
          (
            <MessageCard
              profilePic={{ uri: message[1].userInfo.photoURL }}
              name={message[1].userInfo.displayName}
              latestMessage={message[1].latestMessage?.text}
              time="8:15 PM"
              key={message[0]}
              onPress={() => {
                handleSelect(message[1].userInfo);
              }}
            />
          )
        )
      )}
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
