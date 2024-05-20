import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  ActivityIndicator,
} from "react-native";

import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { FirebaseDB } from "../../../firebase.config";
import MessagingRoomHeaderComponent from "../../components/messageComponents/MessagingRoomHeaderComponent";
import { MessageContext, UserContext } from "../../../Contexts";
import Message from "../../components/messageComponents/Message";

function MessagingRoomScreen({ navigation }) {
  const currentUser = useContext(UserContext);
  const { data } = useContext(MessageContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(data.MessageId);

  useEffect(() => {
    try {
      const unSub = onSnapshot(
        doc(FirebaseDB, "Messages", data.MessageId),
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
  const [reserveFee, setReserveFee] = useState();
  const [popUpFunctions, setPopUpFunctions] = useState(false);
  const [reservePopUp, setReservePopUp] = useState(false);

  const handleReserve = async () => {
    try {
      setReserveFee("");
      if (reserveFee !== "") {
        await updateDoc(doc(FirebaseDB, "Messages", data.MessageId), {
          messages: arrayUnion({
            id: Math.random().toString(16).slice(2),
            reserveFee: parseInt(reserveFee) + parseInt(reserveFee) * 0.01,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            reserveMode: true,
          }),
        });

        await updateDoc(doc(FirebaseDB, "UserMessages", currentUser.uid), {
          [data.MessageId + ".latestMessage"]: {
            text: `Reservation Offer: Php ${(
              parseInt(reserveFee) * 1.01
            ).toLocaleString()}`,
          },
          [data.MessageId + ".date"]: Timestamp.now()
            .toDate()
            .toString()
            .split(" ")[4]
            .split(":"),
        });

        await updateDoc(doc(FirebaseDB, "UserMessages", data.user.uid), {
          [data.MessageId + ".latestMessage"]: {
            text: `Reservation Offer: Php ${(
              parseInt(reserveFee) * 1.01
            ).toLocaleString()}`,
          },
          [data.MessageId + ".date"]: Timestamp.now()
            .toDate()
            .toString()
            .split(" ")[4]
            .split(":"),
        });
      }
      setReservePopUp(false);
      setReserveAvailability(false);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = async () => {
    try {
      setText("");
      if (text !== "") {
        await updateDoc(doc(FirebaseDB, "Messages", data.MessageId), {
          messages: arrayUnion({
            id: Math.random().toString(16).slice(2),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            reserveMode: false,
          }),
        });

        await updateDoc(doc(FirebaseDB, "UserMessages", currentUser.uid), {
          [data.MessageId + ".latestMessage"]: {
            text,
          },
          [data.MessageId + ".date"]: Timestamp.now()
            .toDate()
            .toString()
            .split(" ")[4]
            .split(":"),
        });

        await updateDoc(doc(FirebaseDB, "UserMessages", data.user.uid), {
          [data.MessageId + ".latestMessage"]: {
            text,
          },
          [data.MessageId + ".date"]: Timestamp.now()
            .toDate()
            .toString()
            .split(" ")[4]
            .split(":"),
        });
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  // reserve errors
  const [reserveAvailability, setReserveAvailability] = useState(false);
  const onPressReserve = async () => {
    const intReserveFee = parseInt(reserveFee);
    console.log(isNaN(intReserveFee) || intReserveFee === 0);

    setLoading(true);
    isNaN(intReserveFee) || intReserveFee <= 0
      ? setReserveAvailability(true)
      : await handleReserve();
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -55}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <MessagingRoomHeaderComponent
          title={data.user.firstName + " " + data.user.lastName}
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
          <TouchableOpacity
            style={styles.functionButtons}
            onPress={() => {
              setPopUpFunctions(true);
            }}
          >
            <Image
              style={styles.functionButtonsImage}
              source={require("../../assets/three-dots.png")}
            />
          </TouchableOpacity>
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
              source={require("../../assets/send-message.png")}
              style={styles.sendButton}
            />
          </TouchableOpacity>
        </View>
        {popUpFunctions && (
          <View style={styles.popUpContainer}>
            <View style={styles.popUp}>
              <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                <Text style={styles.popUpTitle}> Reservation </Text>
              </View>
              <View>
                <View style={styles.popUpButtons}>
                  <TouchableOpacity
                    style={[styles.popUpButton, { backgroundColor: "#5edf95" }]}
                    onPress={() => {
                      setReservePopUp(true);
                      setPopUpFunctions(false);
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      Offer Reservation
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.popUpButton}
                    onPress={() => {
                      setPopUpFunctions(false);
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        {reservePopUp && (
          <View style={styles.popUpContainer}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <View style={styles.popUp}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                  <Text style={styles.popUpTitle}>Reservation Offer</Text>
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#505050",
                      marginTop: 8,
                    }}
                  >
                    We will add a 1% service fee.
                  </Text>
                  <TextInput
                    placeholder="How much?"
                    style={styles.reserveFee}
                    onChangeText={setReserveFee}
                    value={reserveFee}
                    maxLength={5}
                    keyboardType="numeric"
                  />
                </View>
                {reserveAvailability && (
                  <Text
                    style={{
                      textAlign: "center",
                      color: "red",
                      marginBottom: 12,
                      marginTop: -12,
                    }}
                  >
                    Reserve Fee not Available.
                  </Text>
                )}

                <View>
                  <View style={styles.popUpReserveButtons}>
                    <TouchableOpacity
                      style={styles.popUpReserveButton}
                      onPress={() => {
                        setReserveFee("");
                        setReservePopUp(false);
                        setReserveAvailability(false);
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.popUpReserveButton,
                        {
                          backgroundColor: "#5edf95",
                          borderLeftWidth: 0.6,
                          borderBottomRightRadius: 15,
                        },
                      ]}
                      onPress={async () => {
                        onPressReserve();
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          flex: 1,
                        }}
                      >
                        Offer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    flexDirection: "column",
  },
  room: {
    // backgroundColor: "white",
  },
  inputContainer: {
    // marginLeft: 30,
    // flex: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    // backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    height: 72,
  },
  input: {
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
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
  functionButtons: {
    padding: 5,
  },
  functionButtonsImage: {
    width: 40,
    height: 40,
  },
  popUpContainer: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    alignSelf: "center",
    // paddingHorizontal: '25%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popUp: {
    // position: 'absolute',
    backgroundColor: "lightgray",
    borderColor: "black",
    borderWidth: 0.6,
    borderRadius: 15,
    // width: 'auto',
    // height: 'auto',
    // bottom: 350,
    // flex: 1,
  },
  popUpTitle: {
    // backgroundColor: 'pink',
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 26,
    // top: -10,
  },
  popUpButtons: {
    flexDirection: "column",
    // justifyContent: 'center',
    // alignItems: 'center',
    right: 0,
    left: 0,
    overflow: "hidden",
    // backgroundColor: 'red',
  },
  popUpButton: {
    paddingVertical: 10,
    borderTopWidth: 0.6,
    // backgroundColor: 'pink',
    width: "100%",
  },
  popUpReserveButtons: {
    flexDirection: "row",
    borderTopWidth: 0.6,
    // backgroundColor: 'red',
    // marginBottom: -16,
  },
  popUpReserveButton: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  reserveFee: {
    fontSize: 12,
    fontWeight: "600",
    color: "black",
    borderWidth: 0.8,
    borderColor: "black",
    borderRadius: 10,
    paddingVertical: "2%",
    paddingHorizontal: "3%",
    marginTop: "3%",
    top: 10,
    width: 200,
  },
});
export default MessagingRoomScreen;
