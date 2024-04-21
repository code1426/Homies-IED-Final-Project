import React from 'react';
import {
  Text,
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import HeaderComponent from '../components/HeaderComponent';
import ButtonSettings from '../components/SettingsComponents/ButtonSettings';

import { FirebaseAuth } from '../../firebase.config';

function SettingsScreen({ navigation }) {
  const user = FirebaseAuth.currentUser;

  // const userName = user?.displayName;
  // const email = user?.email;
  const contactNumber = '09123456789'; // should be changed to fetching
  const location = 'somewhere'; // should be changed to fetching
  const gCashSync = 'synced'; // should be changed to fetching
  const businessPermit = 'verified'; // should be changed to fetching

  return (
    <SafeAreaView>
      <HeaderComponent title='Settings' />
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Edit Profile');
            }}>
            <Image
              style={styles.image}
              source={require('../assets/settingsIcons/noProfilePlaceholder.png')}
            />
          </TouchableOpacity>
          <View>
            <Text>{user.displayName}</Text>
            <View>
              <Text>{user.email}</Text>
              <Text>{contactNumber}</Text>
              <Text>{location}</Text>
              <Text>{gCashSync}</Text>
              <Text>{businessPermit}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={{ textAlign: 'center' }}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ButtonSettings
          settingName='Privacy'
          settingIcon={require('../assets/settingsIcons/privacyIcon.png')}
        />
        <ButtonSettings
          settingName='Roles'
          settingIcon={require('../assets/settingsIcons/roleChangeIcon.png')}
        />
        <ButtonSettings
          settingName='Notifications'
          settingIcon={require('../assets/settingsIcons/notificationIcon.png')}
          tailIcon={require('../assets/switchOff.png')}
          tailIconActive={require('../assets/switchOn.png')}
        />
        <ButtonSettings
          settingName='Log Out'
          settingIcon={require('../assets/settingsIcons/logOutIcon.png')}
          tailIcon={require('../assets/settingsIcons/arrowHead.png')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 30,
    height: '100%',
  },
  profileContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
    resizeMode: 'cover',
  },
  editButton: {
    backgroundColor: '#D5E7F0',
    height: 25,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 12.5,
    borderWidth: 1,
    borderColor: '#85BCDC',
    marginTop: 10,
  },
});

export default SettingsScreen;
