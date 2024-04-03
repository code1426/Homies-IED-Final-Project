import React from 'react';
import { Text, SafeAreaView } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';

function SettingsScreen(props) {
  return (
    <SafeAreaView>
      <HeaderComponent title='Settings' />
    </SafeAreaView>
  );
}

export default SettingsScreen;
