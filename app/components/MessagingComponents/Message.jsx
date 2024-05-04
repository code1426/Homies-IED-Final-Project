import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MessageContext, UserContext } from '../../../Contexts';

function Message({ message }) {
  const currentUser = useContext(UserContext);
  const { data } = useContext(MessageContext);

  return (
    <View
      style={[
        styles.container,
        message.senderId === currentUser.uid && { alignSelf: 'flex-end' },
      ]}>
      {message.senderId === currentUser.uid ? (
        <>
          <View
            style={[
              styles.text,
              message.senderId === currentUser.uid
                ? { backgroundColor: '#B3E5FC' }
                : { backgroundColor: '#F0F0F0' },
            ]}>
            {message.reserveMode === true ? (
              <View style={styles.reservation}>
                <Text style={[styles.reservationTitle, { fontSize: 15 }]}>
                  Reservation Offer Sent
                </Text>
                <Text style={styles.reserveFee}>
                  Php{' '}
                  {parseInt(message.reserveFee) +
                    parseInt(message.reserveFee) * 0.01}{' '}
                </Text>
              </View>
            ) : (
              <Text>{message.text}</Text>
            )}
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
                ? { backgroundColor: '#B3E5FC' }
                : { backgroundColor: '#E0E0E0' },
              styles.text,
            ]}>
            {message.reserveMode === true ? (
              <View style={styles.reservation}>
                <Text style={[styles.reservationTitle, { fontSize: 20 }]}>
                  Reservation Offer
                </Text>
                <Text style={styles.reservationDescription}>
                  Would you like to reserve the place for:
                </Text>
                <Text style={styles.reserveFee}>
                  Php{' '}
                  {parseInt(message.reserveFee) +
                    parseInt(message.reserveFee) * 0.01}{' '}
                </Text>
                <View style={styles.reserveButton}>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'No GCash Function Yet',
                        'Try Again Next Time',
                        [{ text: 'OK' }]
                      );
                    }}>
                    <Text>Accept Offer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text>{message.text}</Text>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
    // backgroundColor: 'red',
  },
  profilePic: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'cover',
    marginHorizontal: 8,
  },
  you: {
    // direction: "rtl",
    alignSelf: 'flex-end',
  },
  others: {
    // direction: "ltr",
    // alignSelf: "flex-end",
  },
  text: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    // borderWidth: 1,
    borderRadius: 14,
    width: 'auto',
    maxWidth: 200,
  },
  reservation: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  reservationTitle: {
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  reservationDescription: {
    fontSize: 12,
  },
  reserveFee: {
    paddingVertical: 5,
    fontSize: 15,
  },
  reserveButton: {
    padding: 5,
    borderWidth: 0.5,
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#5edf95',
  },
});
export default Message;
