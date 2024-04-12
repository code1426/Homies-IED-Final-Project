import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import {useState} from 'react';


import HeaderComponent from '../components/HeaderComponent';

const RolesScreen = ({navigation}) => {
  const [ownerMode, setOwnerMode] = useState(false);
  return (
    <SafeAreaView>
      <HeaderComponent title='Roles' />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/backIcon.png')}
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setOwnerMode(!ownerMode)}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.roleSwitchName}>Owner Mode</Text>
            <Image
              style={styles.button}
              source={
                ownerMode
                  ? require('../assets/switchOn.png')
                  : require('../assets/switchOff.png')
              }
            />
          </View>
        </TouchableOpacity>
        <View style={{ margin: 20 }}>
          <Text style={{ marginBottom: 20 }}>
            Active: Interface features include displaying the photo, as well as
            the title, adding description, prices, location and other features
            of the apartment or boarding house and approving the desired renter.
          </Text>
          <Text>
            Deactive: Interface features include filtering apartments by
            location, price range, number of bedrooms/bathrooms, amenities, and
            other preferences, allowing you to choose the space of your
            preference. If you are interested in any listings, you can apply or
            reserve for rent and pin them for later use. You can also view,
            change, and remove listings you have saved.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    paddingHorizontal: 50,
    // marginTop: 15,
    height: '100%',
    // backgroundColor: 'red'
  },
  button: {
    width: 34,
    height: 27,
    top: 5,
    right: 43,
  },
  roleSwitchName: {
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

export default RolesScreen;

