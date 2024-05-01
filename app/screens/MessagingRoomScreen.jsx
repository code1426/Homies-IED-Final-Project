import React, { useContext, useEffect, useState } from "react";
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
} from "react-native";
// import HeaderComponent from "../components/HeaderComponent";
import MessagingRoomHeaderComponent from "../components/MessagingRoomHeaderComponent";
import { MessageContext, UserContext } from "../../Contexts";
import Message from "../components/MessagingComponents/Message";
import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { FirebaseDB } from "../../firebase.config";
import { useRef } from "react";

function MessagingRoomScreen({ navigation }) {
  const currentUser = useContext(UserContext);
  const { data } = useContext(MessageContext);
  const [messages, setMessages] = useState([]);
  // const ref = useRef();

  // useEffect(() => {
  //   ref.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  console.log(currentUser);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(FirebaseDB, "Messages", data.MessageId),
      (doc) => {
        doc.exists() && setMessages(doc.data().messages.reverse());
      }
    );
    return () => {
      unSub();
    };
  }, [data.MessageId]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
        bottom: 0,
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  // Sending Message
  const [text, setText] = useState("");
  const handleSend = async () => {
    try {
      setText("");
      if (text !== "") {
        await updateDoc(doc(FirebaseDB, "Messages", data.MessageId), {
          messages: arrayUnion({
            id: Math.random().toString(16).slice(2),
            text,
            senderId: currentUser.uid,
            data: Timestamp.now(),
          }),
        });

        await updateDoc(doc(FirebaseDB, "UserMessages", currentUser.uid), {
          [data.MessageId + ".latestMessage"]: {
            text,
          },
          [data.MessageId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(FirebaseDB, "UserMessages", data.user.uid), {
          [data.MessageId + ".latestMessage"]: {
            text,
          },
          [data.MessageId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MessagingRoomHeaderComponent
        title={data.user.displayName}
        profilePic={{ uri: data.user.photoURL }}
      />
      <FlatList
        keyboardDismissMode="interactive"
        style={styles.room}
        data={messages}
        renderItem={({ item }) => <Message message={item} />}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          numberOfLines={4}
          multiline={true}
          style={styles.input}
          onChangeText={setText}
          value={text}
        />
        <TouchableOpacity onPress={handleSend}>
          <Image
            source={require("../assets/send-message.png")}
            style={styles.sendButton}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  room: {
    // backgroundColor: "white",
  },
  inputContainer: {
    // marginLeft: 30,
    flex: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    height: 72,
  },
  input: {
    // height: 40,
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderRadius: 15,
    padding: 8,
    minHeight: 40,
    maxHeight: 150,
  },
  sendButton: {
    width: 25,
    height: 25,
    // marginHorizontal: 20,
  },
});
export default MessagingRoomScreen;
