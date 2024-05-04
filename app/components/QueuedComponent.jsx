import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { FirebaseAuth, FirebaseDB } from '../../firebase.config';
import {
  MessageContext,
  UserContext,
  MessageStateContext,
  ApplicantContext,
} from '../../Contexts';
import { useNavigation } from '@react-navigation/native';

const QueuedComponent = ({
  applicant,
  postData,
  updateList,
  visible: setPopUpVisible,
}) => {
  const navigation = useNavigation();
  const currentUser = useContext(UserContext);
  const { dispatch } = useContext(MessageContext);

  const { messageState } = useContext(MessageStateContext);
  const { setApplicant } = useContext(ApplicantContext);

  const [isApproved, setIsApproved] = useState(false);

  const [screenLoading, setScreenLoading] = useState(true);
  // console.log(applicant);

  useEffect(() => {
    isApplicantApproved();
  }, []);

  const isApplicantApproved = async () => {
    try {
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${postData.postID}/Applicants`,
        applicant.uid
      );
      const docsnap = await getDoc(postRef);
      if (docsnap.exists()) {
        if (docsnap.data().isApproved) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      }
    } catch (err) {
      console.log(err).message;
    } finally {
      setScreenLoading(false);
    }
  };

  const confirmApprove = () => {
    Alert.alert(
      'Approve Application',
      'Are you sure you want to approve this application?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel') },
        { text: 'Yes', onPress: () => handleApprove() },
      ]
    );
  };

  const handleApprove = async () => {
    try {
      setIsApproved(true);
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${postData.postID}/Applicants`,
        applicant.uid
      );
      await updateDoc(postRef, {
        isApproved: true,
      });
      console.log('updated post Applicant');
    } catch (err) {
      console.log(err);
      setIsApproved(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Remove Applicant',
      'Are you sure you want to remove this applicant?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel') },
        { text: 'Yes', onPress: () => handleDelete() },
      ]
    );
  };

  const [messageLoading, setMessageLoading] = useState(false);

  const handleMessage = async () => {
    console.log(currentUser);
    // combine the ids
    const combinedID =
      currentUser.uid > applicant.uid
        ? currentUser.uid + applicant.uid
        : applicant.uid + currentUser.uid;
    // using that id to make a document
    try {
      // checking if the document already exists
      setMessageLoading(true);
      const res = await getDoc(doc(FirebaseDB, 'Messages', combinedID));
      console.log('Messages Checked');
      // if the document doesn't exist then make a new one
      if (!res.exists()) {
        await setDoc(doc(FirebaseDB, 'Messages', combinedID), { messages: [] });
        console.log('Messages Between Two Users has been Created.');

        // Updating the MESSAGES DATA for the CURRENT USER
        await updateDoc(doc(FirebaseDB, 'UserMessages', currentUser.uid), {
          [combinedID + '.userInfo']: {
            uid: applicant.uid,
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            photoURL: applicant.photoURL,
          },
          [combinedID + '.date']: Timestamp.now()
            .toDate()
            .toString()
            .split(' ')[4]
            .split(':'),
        });
        console.log('currentUser message set');
        // Updating the MESSAGES DATA for the APPLICANT
        await updateDoc(doc(FirebaseDB, 'UserMessages', applicant.uid), {
          [combinedID + '.userInfo']: {
            uid: currentUser.uid,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + '.date']: Timestamp.now()
            .toDate()
            .toString()
            .split(' ')[4]
            .split(':'),
        });
        console.log('applicant message set');
      }

      await handleSelect(applicant);
    } catch (error) {
      console.log(error);
      setMessageLoading(false);
    }
  };

  const handleSelect = async (user) => {
    console.log(user);
    await dispatch({ type: 'MESSAGE_PRESSED', payload: user });
    setMessageLoading(false);
    messageState !== 0
      ? navigation.navigate('MessagingRoom')
      : Alert.alert(
          'Open Messages',
          'To view your messages, please open the message screen.'
        );
  };

  const handleDelete = async () => {
    try {
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${postData.postID}/Applicants`,
        applicant.uid
      );
      await updateDoc(postRef, {
        isDeletedByOwner: 'yes',
      });
      updateList();
      console.log('Removed Applicant');
    } catch (err) {
      console.log(err);
    }
  };

  const handleProfileDescription = () => {
    setApplicant(applicant);
    setTimeout(() => {
      setPopUpVisible(true);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleProfileDescription()}
        style={styles.profileContainer}>
        <View>
          <Image
            style={styles.profileImage}
            source={{ uri: applicant.photoURL }}
          />
        </View>
        <View>
          <Text
            numberOfLines={1}
            style={styles.name}>
            {applicant.firstName}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.buttonsContainer}>
        {screenLoading ? (
          <ActivityIndicator
            style={{ alignSelf: 'center' }}
            color='midnightblue'
            size='small'
          />
        ) : (
          <>
            {/* {" "} */}
            {!isApproved ? (
              <>
                <TouchableOpacity
                  onPress={confirmApprove}
                  style={styles.button}>
                  <Text style={styles.buttonLabel}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmDelete}
                  style={styles.cancelContainer}>
                  <Image
                    style={styles.cancelImage}
                    source={require('../assets/cancel.png')}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.messageButton}
                onPress={handleMessage}>
                {messageLoading ? (
                  <ActivityIndicator
                    color='white'
                    size='small'
                  />
                ) : (
                  <>
                    <Image
                      style={{ width: 16, height: 16 }}
                      source={require('../assets/navigationBarIcons/nonactiveMessages.png')}
                    />
                    <Text style={{ ...styles.buttonLabel, color: 'black' }}>
                      Message
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 65,
    paddingHorizontal: 12,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    height: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    // backgroundColor: "red",
  },
  profile: {
    height: 40,
    width: 40,
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  name: {
    fontWeight: '500',
    fontSize: 16,
  },
  buttonsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 8,
    minWidth: 75,
    // flex: 1
  },
  approveContainer: {
    width: '70%',
    height: '100%',
    justifyContent: 'center',
  },
  cancelImage: {
    height: 25,
    width: 25,
    borderRadius: 25,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: 'limegreen',
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  messageButton: {
    width: 112,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BBE0F5',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 15,
    columnGap: 8,
  },
});

export default QueuedComponent;
