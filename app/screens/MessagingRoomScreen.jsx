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
        <TextInput style={styles.input} onChangeText={setText} value={text} />
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
    // flex: 1,
    height: "100%",
    backgroundColor: "white",
    flexDirection: "column",
  },
  room: {
    backgroundColor: "pink",
    // flex: 1,
    // height: 400,
    // alignContent: "flex-end",
    // flexDirection: "column-reverse",
  },
  inputContainer: {
    // alignSelf: "flex-end",
    flexDirection: "row",
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    height: 72,
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  input: {
    width: "80%",
    height: "60%",
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
