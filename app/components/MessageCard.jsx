import { update } from 'firebase/database';
import {
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FirebaseDB } from '../../firebase.config';
import { UserContext } from '../../Contexts';

// name is just a string of a name of the person
// profilePic property must have a req('img') as input
// latest_message is a string remove the {} and just use quotations
// time is the time the last message has been sent remove the {} and just use quotations

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
  // get UserMessages Data
  // const [messages, setMessages] = useState();
  // useEffect(() => {
  //   const q = query(doc(FirebaseDB, 'UserMessages', currentUser.uid));
  //   const unsub = onSnapshot(q, (doc) => {
  //     setMessages(doc.data());
  //   });
  //   return () => {
  //     unsub();
  //   };
  // }, [currentUser.uid]);

  const handleDeleteMessages = async () => {
    try {
      console.log('Deletion Start');
      console.log(messageId);
      await deleteDoc(doc(FirebaseDB, 'Messages', messageId));
      console.log('Messages Deleted');
      await updateDoc(doc(FirebaseDB, 'UserMessages', currentUser.uid), {
        [messageId]: deleteField(),
      });
      await updateDoc(doc(FirebaseDB, 'UserMessages', userMessageId), {
        [messageId]: deleteField(),
      });
      console.log('UserMessage Deleted');
      console.log('Deletion Successful');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        disabled={editMode}
        style={styles.pressableContent}
        onPress={onPress}>
        <Image
          source={profilePic}
          style={styles.profilePicStyle}
        />
        <View style={[styles.messageContent]}>
          <Text style={styles.profileName}>{name}</Text>
          <Text
            style={styles.message}
            numberOfLines={1}>
            {latestMessage}
          </Text>
        </View>
        <View>
          {editMode === true ? (
            <TouchableOpacity onPress={handleDeleteMessages}>
              <Image
                style={styles.delete}
                source={require('../assets/delete.png')}
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
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    // borderWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#BDBDBD',
  },
  profilePicStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  profileName: {
    fontSize: 16.5,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeUpdated: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  delete: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
});

export default MessageCard;
