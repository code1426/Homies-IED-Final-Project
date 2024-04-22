import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseAuth } from '../../firebase.config';

function ForgotPasswordScreen(props) {
  const [email, setEmail] = useState('');
  
  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(FirebaseAuth, email);
      console.log('Email reset password sent');
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <SafeAreaView>
      <HeaderComponent title={'Forgot Password'} />
      <View style={{ paddingHorizontal: '10%' }}>
        <TextInput
          style={styles.input}
          placeholder='Email Adress'
          onChangeText={setEmail}
        />
        <TouchableOpacity onPress={handleResetPassword}>
          <Text style={styles.editButton}>Send Verification</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ABAEB6',
    borderWidth: 1.2,
    borderColor: 'black',
    borderRadius: 10,
    paddingVertical: '4%',
    paddingHorizontal: '3%',
    marginTop: '3%',
  },
  editButton: {
    marginTop: '4%',
    marginLeft: '48%',
    borderWidth: 0.6,
    borderColor: 'black',
    borderRadius: 15,
    paddingVertical: '1.2%',
    paddingHorizontal: '10%',
    fontWeight: '800',
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
