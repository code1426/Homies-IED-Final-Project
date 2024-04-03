import { StyleSheet, Text, View, Platform } from 'react-native'
import React from 'react'

const HeaderComponent = ({title}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>{title}</Text>
    </View>
  )
}

export default HeaderComponent

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: Platform.OS === 'android' ? 26 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 62
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
})