import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import HeaderComponent from '../components/HeaderComponent';

const NotificationScreen = () => {
  return (
    <SafeAreaView>
      <HeaderComponent title='Notifications' />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
