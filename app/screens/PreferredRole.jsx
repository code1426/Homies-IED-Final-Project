import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import SelectButton from "../components/SelectButton";

function PreferredRole() {

  const [isRenterSelected, setisRenterSelected] = useState(false)
  return (
    <SafeAreaView style={{ height: 736, width: 414 }}>
      <View>
        <Image
          style={{ height: 330, width: 414 }}
          source={require("../assets/signup.png")}
        />
      </View>
        <View
          style={{
            height: '81%',
            width: '100%',
            backgroundColor: "#ECEFF6",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            marginTop: -40,
            justifyContent: 'center'
          }}
        >
          <View style={{height: '80%', width: '100%'}}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Arial",
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: 25,
              marginTop: 30,
              color: "midnightblue",
            }}
          >
            Choose your role.
          </Text>
          <View
            style={{
              height: 300,
              width: 414,
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingTop: 35,
            }}
          >
            <TouchableOpacity
              style={styles.role}
              onPress={() => {
                setisRenterSelected(!isRenterSelected);
                console.log(isRenterSelected)
              }}
            >
              <View style={{ height: '10%', width: '10%', marginLeft: '10%', marginTop: '10%'}}>
                <SelectButton isSelected={isRenterSelected} ></SelectButton>
              </View>
              <View style={{height: '70%', width: '90%', alignSelf: 'center'}}>
                <Image style={{height: '100%', width: '100%', objectFit: 'contain'}}source={require('../assets/renter.png')}/>
              </View>
              <View style={{ height: '8%', width: '100%', alignItems: 'center', marginVertical: '10%'}}>
                <Text style={{fontWeight: 'bold'}}>Renter</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.role}
              onPress={() => console.log("Owner tapped")}
            >
              <View style={{ height: '10%', width: '10%', marginLeft: '10%', marginTop: '10%'}}>
                <SelectButton isSelected={isRenterSelected} ></SelectButton>
              </View>
              <View style={{height: '70%', width: '90%', alignSelf: 'center'}}>
                <Image style={{height: '100%', width: '100%', objectFit: 'contain'}}source={require('../assets/owner.png')}/>
              </View>
              <View style={{ height: '8%', width: '100%', alignItems: 'center', marginVertical: '10%'}}>
                <Text style={{fontWeight: 'bold'}}>Owner</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => Alert.alert("Proceed button pressed")}>
            <View
              style={{
                height: 40,
                width: 200,
                alignSelf: "center",
                backgroundColor: "midnightblue",
                borderRadius: 15,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  paddingVertical: 10,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Proceed
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  role: {
    height: '80%',
    width: '40%',
    backgroundColor: "white",
    borderRadius: 18,
    justifyContent: 'space-evenly'
  },
});

export default PreferredRole;
