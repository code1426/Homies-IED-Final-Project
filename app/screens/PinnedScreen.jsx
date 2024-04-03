import React from 'react';
import { Text, SafeAreaView } from 'react-native';

import HeaderComponent from '../components/HeaderComponent';

function PinnedScreen(props) {
  return (
    <SafeAreaView>
      <HeaderComponent title='Pinned Places'/>
    </SafeAreaView>
  );
}

export default PinnedScreen;