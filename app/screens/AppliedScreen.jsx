import React from 'react';
import { Text, SafeAreaView } from 'react-native';

import HeaderComponent from '../components/HeaderComponent';

function AppliedScreen(props) {
  return (
    <SafeAreaView>
      <HeaderComponent title='Applied'/>
    </SafeAreaView>
  );
}

export default AppliedScreen;
