import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import HeaderComponent from '../components/HeaderComponent'

const ListingScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <HeaderComponent title='Listing' />
    </SafeAreaView>
  )
}

export default ListingScreen

const styles = StyleSheet.create({})