import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";

import {
  SafeAreaView,
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { FirebaseDB } from "../../../firebase.config";
import { UserContext } from "../../../Contexts";
import React, { useContext } from "react";

function MessageCard({
  name,
  profilePic,
  latestMessage,
  time,
  onPress,
  editMode,
  messageId,
  userMessageId,
}) {
  const currentUser = useContext(UserContext);

  const handleDeleteMessages = async () => {
    try {
      console.log("Deletion Start");
      console.log(messageId);
      await deleteDoc(doc(FirebaseDB, "Messages", messageId));
      console.log("Messages Deleted");
      await updateDoc(doc(FirebaseDB, "UserMessages", currentUser.uid), {
        [messageId]: deleteField(),
      });
      await updateDoc(doc(FirebaseDB, "UserMessages", userMessageId), {
        [messageId]: deleteField(),
      });
      console.log("UserMessage Deleted");
      console.log("Deletion Successful");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        disabled={editMode}
        style={styles.pressableContent}
        onPress={onPress}
      >
        <Image source={profilePic} style={styles.profilePicStyle} />
        <View style={[styles.messageContent]}>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.message} numberOfLines={1}>
            {latestMessage}
          </Text>
        </View>
        <View>
          {editMode === true ? (
            <TouchableOpacity onPress={handleDeleteMessages}>
              <Image
                style={styles.delete}
                source={require("../../assets/delete.png")}
              />
            </TouchableOpacity>
          ) : (
            <Text style={styles.timeUpdated}>{`${time[0]}:${time[1]}`}</Text>
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pressableContent: {
    height: 80,
    backgroundColor: "white",
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    // borderWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#BDBDBD",
  },
  profilePicStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  profileName: {
    fontSize: 16.5,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    fontWeight: "bold",
  },
  timeUpdated: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  delete: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
});

export default MessageCard;
