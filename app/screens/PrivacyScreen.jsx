import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';

// this must have a function

function PrivacySettingScreen({ navigation }) {
  const [privacy, setPrivacy] = useState(false);
  return (
    <SafeAreaView>
      <HeaderComponent backButtonOn={true} title='Privacy' />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setPrivacy(!privacy)}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.privacySwitch}>Privacy</Text>
            <Image
              style={styles.button}
              source={
                privacy
                  ? require('../assets/switchOn.png')
                  : require('../assets/switchOff.png')
              }
            />
          </View>
        </TouchableOpacity>
        <View style={{ margin: 20 }}>
          <Text style={{ marginBottom: 20 }}>
            Active: Your information is only seen by you.
          </Text>
          <Text>Deactive: Everyone can see your information.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    paddingHorizontal: 50,
    // marginTop: 10,
    height: '100%',
    // backgroundColor: 'red'
  },
  button: {
    width: 34,
    height: 27,
    top: 5,
    right: 43,
  },
  privacySwitch: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    width: '100%',
    // marginRight: 200,
  },
  backButton: {
    width: 25,
    height: 25,
    top: -47,
    left: 20,
  },
  backButtonImage: {
    width: 25,
    height: 25,
    position: 'absolute',
  },
});

export default PrivacySettingScreen;
