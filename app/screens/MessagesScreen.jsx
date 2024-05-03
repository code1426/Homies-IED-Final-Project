import React, { useContext, useEffect, useState } from "react";
import MessageCard from "../components/MessageCard.jsx";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator
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

import { MessageStateContext } from "../../Contexts.js";

function MessagesScreen({ navigation }) {
  const currentUser = useContext(UserContext);
  const { dispatch } = useContext(MessageContext);
  const [messages, setMessages] = useState([]);

  const { setMessageState } = useContext(MessageStateContext);

  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    setMessageState((state) => state + 1);
    const q = query(doc(FirebaseDB, "UserMessages", currentUser.uid));
    const unsub = onSnapshot(q, (doc) => {
      setMessages(doc.data());
      setScreenLoading(false);
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

  if (!screenLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <HeaderComponent title="Messages" />
        {Object.entries(messages).map((message) => (
          <MessageCard
            profilePic={{ uri: message[1].userInfo.photoURL }}
            name={
              message[1].userInfo.firstName + " " + message[1].userInfo.lastName
            }
            latestMessage={message[1].latestMessage?.text}
            time={message[1].date}
            key={message[0]}
            onPress={() => {
              handleSelect(message[1].userInfo);
            }}
          />
        ))}
      </SafeAreaView>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="midnightblue" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: '#ECEFF6',
  },
});

export default MessagesScreen;
