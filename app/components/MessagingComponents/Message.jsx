import React, { useContext, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { MessageContext, UserContext } from "../../../Contexts";

function Message({ message }) {
  const currentUser = useContext(UserContext);
  const { data } = useContext(MessageContext);

  return (
    <View
      style={[
        styles.container,
        message.senderId === currentUser.uid && { alignSelf: "flex-end" },
      ]}
    >
      {message.senderId === currentUser.uid ? (
        <>
          <View
            style={[
              styles.text,
              message.senderId === currentUser.uid
                ? { backgroundColor: "#B3E5FC" }
                : { backgroundColor: "#F0F0F0" },
            ]}
          >
            <Text>{message.text}</Text>
          </View>
          <Image
            style={styles.profilePic}
            source={
              // require("../../assets/placeholder.png") // placeholder
              {
                uri:
                  message.senderId === currentUser.uid
                    ? currentUser.photoURL
                    : data.user.photoURL,
              }
            }
          />
        </>
      ) : (
        <>
          <Image
            style={styles.profilePic}
            source={
              // require("../../assets/placeholder.png") // placeholder
              {
                uri:
                  message.senderId === currentUser.uid
                    ? currentUser.photoURL
                    : data.user.photoURL,
              }
            }
          />
          <View
            style={[
              message.senderId === currentUser.uid
                ? { backgroundColor: "#B3E5FC" }
                : { backgroundColor: "#E0E0E0" },
              styles.text,
            ]}
          >
            <Text>{message.text}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
    // backgroundColor: 'red',
  },
  profilePic: {
    alignSelf: "center",
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: "cover",
    marginHorizontal: 8,
  },
  you: {
    // direction: "rtl",
    alignSelf: "flex-end",
  },
  others: {
    // direction: "ltr",
    // alignSelf: "flex-end",
  },
  text: {
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    // borderWidth: 1,
    borderRadius: 14,
    width: "auto",
    maxWidth: 200,
  },
});
export default Message;
