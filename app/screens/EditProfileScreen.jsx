import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { UserContext } from '../../userContext';
import { FirebaseAuth, FirebaseDB } from '../../firebase.config';
import {
  RecaptchaVerifier,
  sendEmailVerification,
  updateEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

import HeaderComponent from '../components/HeaderComponent';
import { updateDoc, doc } from 'firebase/firestore';

export default function EditProfileScreen({ navigation }) {
  const currentUser = useContext(UserContext);

  const userAuth = FirebaseAuth.currentUser;
  // DisplayName
  const nameSeparated = userAuth.displayName.split(' ');
  const userFirstName = nameSeparated.slice(0, -1).join(' ');
  const userLastName = nameSeparated.slice(-1).toString();

  const [firstName, onChangeFirstName] = useState(userFirstName);
  const [lastName, onChangeLastName] = useState(userLastName);

  // Password
  const [passwords, onChangePassword] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const validatePassword = () => {
    let passwordErrors = {};
    if (passwords.currentPassword === '')
      passwordErrors.currentPassword = 'Wrong Password';
    // TypeError: Cannot read property 'length' of undefined
    // else if (passwords.currentPassword.length <= 8) {
    //   passwordErrors.newPassword = 'New Password is Invalid';
    //   console.log('Please enter a valid password');
    // }
    setPasswordErrors(passwordErrors);
    return Object.keys(passwordErrors).length === 0;
  };

  const handleInputPassword = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        userAuth.email,
        passwords.currentPassword
      );
      await reauthenticateWithCredential(userAuth, credential);
      updatePassword(userAuth, passwords.newPassword);
    } catch (error) {
      console.log('Change Password', error.message);
      Alert.alert(error.message);
    }
  };

  const handleChangePassword = async () => {
    if (validatePassword()) {
      await handleInputPassword();
    } else {
      resetPasswordValidation();
    }
  };

  const resetPasswordValidation = () => {
    setPasswordErrors({});
    onChangePassword({ currentPassword: '', newPassword: '' });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <HeaderComponent title='Profile Details' />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Settings')}>
          <Image
            source={require('../assets/backIcon.png')}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>
        <View style={styles.formContainer}>
          <Text style={styles.text}>Email Adress</Text>
          <Text style={styles.emailAdress}>{userAuth.email}</Text>
          <Text style={styles.text}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder={firstName}
            onChangeText={onChangeFirstName}
            placeholderTextColor='#6b7280'
            autoCapitalize='words'
          />

          <TextInput
            style={styles.input}
            placeholder={lastName}
            onChangeText={onChangeLastName}
            placeholderTextColor='#6b7280'
            autoCapitalize='words'
          />
          <TouchableOpacity
            onPress={async () => [
              await updateProfile(userAuth, {
                displayName: `${firstName} ${lastName}`,
              }),
              // checker
              console.log(userAuth),
              console.log(userAuth.displayName),
            ]}>
            <Text style={styles.edit}>Edit Name</Text>
          </TouchableOpacity>
          <Text style={styles.text}>Current Password</Text>
          <TextInput
            style={styles.input}
            placeholder={passwords.currentPassword}
            onChangeText={(currentPassword) => [
              onChangePassword({ ...passwords, currentPassword }),
              console.log(passwords),
            ]}
            placeholderTextColor='#6b7280'
          />
          {!passwordErrors.currentPassword || (
            <Text style={[styles.errorText, { marginTop: '3%' }]}>
              {passwordErrors.currentPassword}
            </Text>
          )}
          <Text style={[styles.text, { marginTop: '3%' }]}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder={passwords.newPassword}
            onChangeText={(newPassword) =>
              onChangePassword({ ...passwords, newPassword })
            }
            placeholderTextColor='#6b7280'
          />
          {!passwordErrors.newPassword || (
            <Text style={styles.errorText}>{passwordErrors.newPassword}</Text>
          )}
          <TouchableOpacity onPress={handleChangePassword}>
            <Text style={styles.edit}>Change Password</Text>
          </TouchableOpacity>
          <Text style={styles.text}></Text>

          <Text style={styles.text}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder={
              currentUser.location === null
                ? 'Enter Your Location'
                : currentUser.location
            }
            placeholderTextColor='#6b7280'
          />
          <TouchableOpacity>
            <Text style={styles.edit}>Edit Location</Text>
          </TouchableOpacity>

          <View>
            <View style={styles.GcashAndBusinessPermit}>
              <Text style={styles.text}>Gcash Synced</Text>
              <View>
                <TouchableOpacity style={styles.ChangeAccount}>
                  <Text>Change Account</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.GcashAndBusinessPermit}>
              <Text style={styles.text}>Business Permit Verified</Text>
              <View style={styles.Verified}>
                <TouchableOpacity>
                  <Text>Verified</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'ECEFF6',
  },
  backButton: {
    width: 25,
    height: 25,
    top: -47,
    left: 20,
  },
  formContainer: {
    backgroundColor: 'ECEFF6',
    marginLeft: '10%',
    marginRight: '10%',
  },
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
  text: {
    fontWeight: '600',
  },
  emailAdress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ABAEB6',
    borderWidth: 1.2,
    borderColor: 'black',
    borderRadius: 10,
    paddingVertical: '4%',
    paddingHorizontal: '3%',
    marginTop: '3%',
    color: '#6b7280',
    marginBottom: '3%',
  },
  edit: {
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
  LocationTexts: {
    marginTop: '4%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    paddingVertical: '1%',
    paddingHorizontal: '7%',
    fontWeight: '600',
    textAlign: 'center',
    color: '#6b7280',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '4%',
  },
  GcashAndBusinessPermit: {
    marginTop: '4%',
    textAlign: 'center',
  },
  ChangeAccount: {
    marginTop: '4%',
    alignSelf: 'center',
    borderWidth: 0.6,
    borderColor: 'black',
    borderRadius: 15,
    paddingVertical: '1.2%',
    paddingHorizontal: '10%',
    textAlign: 'center',
    backgroundColor: '#D5E7F0',
    justifyContent: 'center',
    fontWeight: '100',
    borderColor: '#85BCDC',
    textAlign: 'center',
    marginRight: '48%',
  },
  Verified: {
    marginTop: '4%',
    alignSelf: 'center',
    borderWidth: 0.6,
    borderColor: 'black',
    borderRadius: 15,
    paddingVertical: '1.2%',
    paddingHorizontal: '10%',
    textAlign: 'center',
    backgroundColor: '#D5E7F0',
    justifyContent: 'center',
    fontWeight: '100',
    borderColor: '#85BCDC',
    textAlign: 'center',
    marginRight: '63%',
  },
  backButtonImage: {
    width: 25,
    height: 25,
    position: 'absolute',
  },
  errorText: {
    color: 'red',
    marginBottom: 0,
    marginLeft: 16,
  },
};
