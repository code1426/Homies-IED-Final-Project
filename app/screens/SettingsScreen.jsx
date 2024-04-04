import React from 'react';
import { Text, SafeAreaView, View, Image, StyleSheet } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import Button from '../components/SettingsComponents/Button';

const userName = 'Username'; // should be change to fetching
const email = 'Email@gmail.com'; // should be changed to fetching
const contactNumber = '09123456789'; // should be changed to fetching
const location = 'somewhere'; // should be changed to fetching
const gCashSync = 'synced'; // should be changed to fetching
const businessPermit = 'verified'; // should be changed to fetching

function SettingsScreen(props) {
  return (
    <SafeAreaView>
      <HeaderComponent title='Settings' />
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.image}
            source={require('../assets/settingsIcons/noProfilePlaceholder.png')}
          />
          <View>
            <Text>{userName}</Text>
            <View>
              <Text>{email}</Text>
              <Text>{contactNumber}</Text>
              <Text>{location}</Text>
              <Text>{gCashSync}</Text>
              <Text>{businessPermit}</Text>
            </View>
          </View>
        </View>

        <Button
          settingName='Privacy'
          settingIcon={require('../assets/settingsIcons/privacyIcon.png')}
        />
        <Button
          settingName='Roles'
          settingIcon={require('../assets/settingsIcons/roleChangeIcon.png')}
        />
        <Button
          settingName='Notifications'
          settingIcon={require('../assets/settingsIcons/notificationIcon.png')}
          tailIcon={require('../assets/settingsIcons/arrowHead.png')}
        />
        <Button
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
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});

export default SettingsScreen;
