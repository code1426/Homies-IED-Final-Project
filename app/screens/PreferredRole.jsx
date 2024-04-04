import React, {useState} from "react";
import { 
  Text, 
  SafeAreaView, 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
 } from 'react-native';

function PreferredRole() {
    return (
      <SafeAreaView style={{height: 736, width: 414}}>
        <View>
          <Image style={{height: 330, width: 414}} source={require('../assets/signup.png')}/>
        </View>
        <View style={{height: 446, width: 414, backgroundColor: '#ECEFF6', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -40}}>
          <Text style={{textAlign: 'center', fontFamily: "Arial", fontStyle: "normal", fontWeight: 600, fontSize: 25, marginTop: 30, color: 'midnightblue'}}>Choose your role.</Text>
          <View style={{backgroundColor: 'yellow', height: 300, width: 414, flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 35}}>
            <TouchableOpacity style={styles.role} onPress={() => console.log("Renter tapped")}> 
              {/* <Image 
                style={{width: 150, height: 230}}
                source={require('../assets/finder.png')}/>
               */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.role} onPress={() => console.log("Owner tapped")}> 
              {/* <Image></Image> */}
            </TouchableOpacity>
            
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Proceed button pressed')}>
            <View style={{height: 40, width: 200, alignSelf: 'center', backgroundColor: 'midnightblue', borderRadius: 15}}>
              <Text style={{color: 'white', textAlign: 'center', paddingVertical: 10, fontSize: 15, fontWeight: 600}}>Proceed</Text>
            </View>
          </TouchableOpacity>


        </View>
        {/* <View style={{height: 446, width: 414, backgroundColor: '#ECEFF6', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -40}}>
          <Text style={{textAlign: 'center', fontFamily: "Arial", fontStyle: "normal", fontWeight: 600, fontSize: 25, marginTop: 30, color: 'midnightblue'}}>Choose your role.</Text>
          <View> style={{ alignItems: 'space-between', }}

          </View>
          <View style={{width: 200, alignSelf: 'center', marginTop: 300 }}>
            <Button title="Proceed" onPress={() => Alert.alert('Proceed button pressed')} color={'midnightblue'}/>
          </View>
        </View> */}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'seagreen',
    alignItems: 'center',
    justifyContent: 'center',
  },
  role: {
    height: 230, 
    width: 150, 
    backgroundColor: 'white',

  }
});

export default PreferredRole;