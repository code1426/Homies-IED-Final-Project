import React, { useContext, useEffect, useState } from 'react';
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
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { UserContext } from '../../Contexts';
import {
  FirebaseAuth,
  FirebaseDB,
  firebaseStorage,
} from '../../firebase.config';
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
import { updateDoc, doc, getDoc } from 'firebase/firestore';

import * as ImagePicker from 'expo-image-picker';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { set } from 'firebase/database';
import { useIsFocused } from '@react-navigation/native';

export default function EditProfileScreen({ navigation }) {
  const currentUser = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  //  refresh
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1);
    }, 5000);
  });
  // const timer = setTimeout(setRefresh(), 5000);

  useEffect(() => {
    userAuth;
  }, [count, useIsFocused()]);

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
      passwordErrors.currentPassword = 'Please type in your Current Password.';
    // TypeError: Cannot read property 'length' of undefined
    if (passwords.newPassword.length <= 8) {
      passwordErrors.newPassword = 'New Password is Invalid.';
    }
    setPasswordErrors(passwordErrors);
    return Object.keys(passwordErrors).length === 0;
  };

  const handleInputPassword = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        userAuth.email,
        passwords.currentPassword
      );
      await reauthenticateWithCredential(userAuth, credential).catch((error) =>
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: 'Wrong Password',
        })
      );
      await updatePassword(userAuth, passwords.newPassword).catch((error) =>
        Alert.alert(error.message)
      );
    } catch (error) {
      console.log('Change Password', error.message);
      setPasswordErrors({
        ...passwordErrors,
        currentPassword: 'Wrong Password',
      });
    }
  };

  const handleChangePassword = async () => {
    if (validatePassword()) {
      await handleInputPassword();
      resetPasswordValidation();
    }
  };

  const resetPasswordValidation = () => {
    setPasswordErrors({});
    onChangePassword({ currentPassword: '', newPassword: '' });
  };

  // Location
  const firestoreLocation = currentUser.location;

  const [location, onChangeLocation] = useState(firestoreLocation);

  const handleChangeLocation = async () => {
    await updateDoc(doc(FirebaseDB, 'Users', currentUser.uid), {
      location: location,
    });
  };

  // Profile Picture

  const [profile, setProfilePic] = useState(userAuth.photoURL);

  const pickProfilePic = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [5, 4],
        quality: 1,
      });
      if (!result.canceled) {
        setProfilePic(result.assets[0].uri);
        console.log('Image Picker');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChangeProfile = async () => {
    setLoading(true);
    try {
      const profilePicRes = await fetch(profile);
      console.log('Fetched');

      const profileBlob = await profilePicRes.blob();
      console.log('Blobbed');

      const profilePicRef = ref(
        firebaseStorage,
        'Users/photoURL/' + Date.now() + '.jpg'
      );

      await uploadBytesResumable(profilePicRef, profileBlob);
      console.log('Uploaded');

      const profilePicURL = await getDownloadURL(profilePicRef);
      console.log('Downloaded');

      await updateProfile(userAuth, { photoURL: profilePicURL });
      console.log('Changed Successfully');
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
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
            <Text style={styles.text}>Profile Picture</Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <TouchableOpacity
                onPress={async () => {
                  {
                    await pickProfilePic(), console.log(profile);
                  }
                }}>
                <Image
                  style={[styles.image, { flex: 1 }]}
                  source={
                    profile === undefined
                      ? { uri: userAuth.photoURL }
                      : { uri: profile }
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonProfile}
                onPress={handleChangeProfile}>
                {loading ? (
                  <ActivityIndicator
                    size='small'
                    style={{ alignSelf: 'center' }}
                  />
                ) : (
                  <Text style={styles.changeProfileButton}>Edit Profile</Text>
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>Email Adress</Text>
            <Text style={styles.emailAdress}>{userAuth.email}</Text>
            <Text style={styles.text}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder={userFirstName}
              onChangeText={onChangeFirstName}
              placeholderTextColor='#6b7280'
              autoCapitalize='words'
            />

            <TextInput
              style={styles.input}
              placeholder={userLastName}
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
              placeholder={''}
              onChangeText={(currentPassword) => [
                onChangePassword({ ...passwords, currentPassword }),
                console.log(passwords),
              ]}
              secureTextEntry
              placeholderTextColor='#6b7280'
            />
            {passwordErrors.currentPassword && (
              <Text style={[styles.errorText, { marginTop: '3%' }]}>
                {passwordErrors.currentPassword}
              </Text>
            )}
            <Text style={[styles.text, { marginTop: '3%' }]}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder={''}
              onChangeText={(newPassword) =>
                onChangePassword({ ...passwords, newPassword })
              }
              secureTextEntry
              placeholderTextColor='#6b7280'
            />
            {passwordErrors.newPassword && (
              <Text style={[styles.errorText, { marginTop: '3%' }]}>
                {passwordErrors.newPassword}
              </Text>
            )}
            <TouchableOpacity onPress={handleChangePassword}>
              <Text style={styles.edit}>Change Password</Text>
            </TouchableOpacity>
            <Text style={styles.text}></Text>

            <Text style={styles.text}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder={location === null ? 'Enter Your Location' : location}
              placeholderTextColor='#6b7280'
              onChangeText={onChangeLocation}
            />
            <TouchableOpacity onPress={handleChangeLocation}>
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
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    marginBottom: 100,
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
    color: 'black',
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
  changeProfileButton: {
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontWeight: '800',
  },
  buttonProfile: {
    borderColor: 'black',
    borderRadius: 15,
    borderWidth: 0.6,
    marginLeft: '18%',
    height: 33,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: '5%',
    marginBottom: '5%',
    width: 135,
    height: 135,
    borderRadius: 67.5,
    resizeMode: 'cover',
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
