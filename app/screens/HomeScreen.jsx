import React, {useState} from "react";
import { 
  Text, 
  SafeAreaView, 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  ScrollView,
 } from 'react-native';
import PostCard from "../components/post";

function HomeScreen({ navigation }) {
  const [alignItems, setAlignItems] = useState('center');

  return (
    <ScrollView style={{width: 414, backgroundColor: "#ECEFF6"}}>
      <View style={{height: 80, width: 414, flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{height: 80, width: 80 }}>
          <TouchableOpacity onPress={() => console.log("Profile tapped")}> 
            <Image
              style={{height: 50, width: 50, borderRadius: 25, margin: 20 }} 
              source={require('../assets/profile.jpg')}/>
          </TouchableOpacity>
        </View>
        <View style={{height: 100, width: 90 }}>
          <TouchableOpacity onPress={() => console.log("Notifications tapped")}> 
            <Image style={{height: 33, width: 33, borderRadius: 25, margin: 30}}
                  source={require("../assets/notification.png")}/>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.tagline}>Find Your Dream Home</Text>
      <View style={styles.searchbarContainer}>
        <TouchableOpacity style={[styles.searchbar, styles.shadow]} onPress={() => console.log("Searchbar tapped")}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>          
        <TouchableOpacity style={styles.filter} onPress={() => console.log("Filter tapped")}>
          <Image
            style={{height: 20, width: 20, alignSelf: 'center'}}
            source={require("../assets/filter.png")}/>
        </TouchableOpacity>
      </View>
      <PreviewLayout
        selectedValue={alignItems}
        values={['All', 'Apartment', 'Boarding House', 'Dorm']}
        setSelectedValue={setAlignItems}>
      </PreviewLayout>
      <View style={{justifyContent: 'flex-start', paddingBottom: 50}}>
        <PostCard></PostCard>
        <PostCard></PostCard>
        <PostCard></PostCard>
      </View>
    </ScrollView>
  );
}


const PreviewLayout = ({
values, 
selectedValue,
setSelectedValue,
}) => (
<View style={styles.categoryContainer}>
  <View style={styles.row}>
    {values.map(value => (
      <TouchableOpacity
        key={value}
        onPress={() => setSelectedValue(value)}
        style={[styles.button, selectedValue === value && styles.selected]}>
        <Text
          style={[
            styles.buttonLabel,
            selectedValue === value && styles.selectedLabel,
          ]}>
          {value}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>
);


const styles = StyleSheet.create({
tagline: {
  width: 200,
  margin: 30,
  fontFamily: "Arial",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: 28,
  lineHeight: 29,
  color: "black",
},
categoryContainer: {
  alignItems: "center",
  paddingVertical: 7,
},
row: {
  flexDirection: 'row',
},
button: {
  paddingHorizontal: 18,
  paddingVertical: 7,
  borderRadius: 15,
  backgroundColor: 'lightcyan',
  margin: 3,
  borderWidth: 1.3,
  borderColor:'midnightblue',
},
selected: {
  backgroundColor: 'midnightblue',
},
buttonLabel: {
  fontSize: 12,
  fontWeight: '500',
  color: 'midnightblue',
  textAlign: 'center',
},
selectedLabel: {
  color: 'white',
},
profile: {
  alignSelf: "flex-start",
  padding: 20,
  height: 45,
  width: 37,
},
searchText: {
  marginLeft: 20,
  fontFamily: "Arial",
  fontSize: 14,
  fontWeight: 600,
  color: "grey",
  paddingTop: 10,
},
searchbarContainer: {
  height: 55,
  width: 414,
  flexDirection: 'row',
  justifyContent: 'center',
},
searchbar: {
  height: 36,
  width: 240,
  backgroundColor: 'white',
  borderRadius: 25, 
  marginRight: 12,
},
filter: {
  height: 40,
  width: 45,
  backgroundColor: 'midnightblue',
  borderRadius: 13, 
  justifyContent: 'center',
},
shadow: {
  shadowColor: 'grey',
  shadowOffset: {width: 0, height: 3},
  shadowRadius: 10,
}

});

export default HomeScreen;

