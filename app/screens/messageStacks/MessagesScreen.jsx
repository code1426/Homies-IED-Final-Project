import React, { useContext, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import MessageCard from "../../components/messageComponents/MessageCard.jsx";
import HeaderComponent from "../../components/HeaderComponent.jsx";
import { doc, onSnapshot, query } from "firebase/firestore";
import { FirebaseDB } from "../../../firebase.config.js";
import { UserContext } from "../../../Contexts.js";
import { MessageContext } from "../../../Contexts.js";
import { MessageStateContext } from "../../../Contexts.js";

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

  const [editMode, setEditMode] = useState(false);

  if (!screenLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <HeaderComponent
          title="Messages"
          editModeHeader={true}
          onPressEdit={() => {
            setEditMode(!editMode);
          }}
        />
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
            editMode={editMode}
            messageId={message[0]}
            userMessageId={message[1].userInfo.uid}
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
  },
});

export default MessagesScreen;
