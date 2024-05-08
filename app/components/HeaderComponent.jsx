import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const HeaderComponent = ({
  title,
  backButtonOn = false,
  editModeHeader = false,
  onPressEdit,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      {backButtonOn && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/backIcon.png')}
            style={styles.backButton}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.header}>{title}</Text>
      {editModeHeader && (
        <TouchableOpacity
          style={styles.edit}
          onPress={onPressEdit}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'android' ? 26 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 62,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    width: 25,
    height: 25,
  },
  edit: {
    position: 'absolute',
    right: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
