import React, { useContext } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { MessageContext, UserContext } from '../../../Contexts';

function Message({ message }) {
  const currentUser = useContext(UserContext);
  const { data } = useContext(MessageContext);

  return (
    <View
      style={[
        styles.container,
        message.senderId === currentUser.uid ? styles.you : styles.others,
      ]}>
      <Image
        style={styles.profilePic}
        source={
          // require('../../assets/placeholder.png') // placeholder
          {
            uri:
              message.senderId === currentUser.uid
                ? currentUser.photoURL
                : data.user.photoURL,
          }
        }
      />
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flexDirection: 'row',
    marginVertical: 5,
    width: '70%'
  },
  profilePic: {
    alignSelf: 'center',
    width: 35,
    height: 35,
    borderRadius: 27.5,
    marginRight: 15,
    resizeMode: 'cover',
    // marginLeft: 10,
  },
  you: {
    direction: 'rtl',
    alignSelf:'flex-end'
  },
  others: {
    direction: 'ltr',
  },
  text: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderRadius: 15,
    width: 'auto',
  },
});
export default Message;
