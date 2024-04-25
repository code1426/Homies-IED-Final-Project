import { StyleSheet, Text, SafeAreaView, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { FirebaseAuth } from '../../firebase.config';

export default function LogoScreen({ navigation }) {
  useEffect(() => {
    try {
      setTimeout(() => {
        FirebaseAuth.currentUser || navigation.navigate('SignIn');
      }, 2750);
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  const appLogo = require('../assets/homies-logo.png');
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.icon}
        source={appLogo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#CBE6F6",
    backgroundColor: '#B0DBF3',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 210,
    width: 210,
  },
});
