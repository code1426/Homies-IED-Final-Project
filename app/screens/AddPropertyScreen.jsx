import { 
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
  ActivityIndicator
} from 'react-native'

import { useState, useEffect } from 'react'

import { FirebaseDB, firebaseApp } from '../../firebase.config'
import { addDoc, collection, getDocs, } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { Formik } from 'formik'
import { Picker } from '@react-native-picker/picker'
import { SafeAreaView } from 'react-native'
import React from 'react'

import * as ImagePicker from 'expo-image-picker';

import HeaderComponent from '../components/HeaderComponent';

const storage = getStorage(firebaseApp);

function AddPropertyScreen ({ navigation }) {

  const [propertyList, setPropertyList] = useState([]);

  const [image, setImage] = useState(null);

  const [titleStyle, setTitleStyle] = useState({...styles.titleInput})
  const [descStyle, setDescStyle] = useState({...styles.descriptionInput})
  const [propertyStyle, setPropertyStyle] = useState({...styles.pickerContainer})
  const [rentStyle, setRentStyle] = useState({...styles.rentInput})
  const [regStyle, setRegStyle] = useState({...styles.regInput})
  const [imgStyle, setImgStyle] = useState({...styles.image})

  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const propertyTypes = ['Apartment', 'Boarding House', 'Dorm']

  // useEffect(() => {
  //   getPropertyList()
  //   }, [])

  // used to get the property list
  const getPropertyList = async () => {
    const querySnapshot = await getDocs(collection(FirebaseDB, "OwnerPosts"));

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setPropertyList([...propertyList, doc.data()])
    })
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    try {
let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.All,
  allowsEditing: true,
  aspect: [4, 4],
  quality: 1,
      });
  
      // console.log(result);
  
      if (!result.canceled) {
        // console.log(image);
        setImage(result.assets[0].uri);
        // console.log(image);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSubmitMethod = async (values, Method) => {
    handleInputError(values)
    let isAllInputFilled;
    // console.log(image)

    for (let [key, val] of Object.entries(values)) {
      if (!val && key !== 'image') {
        isAllInputFilled = false;
        console.log(`Error at: ${key}`)
        ToastAndroid.show('All input is required', ToastAndroid.SHORT)
        return
      } else isAllInputFilled = true;
    }

    if (isNaN(values.rentPrice)) {
      isAllInputFilled = false
      ToastAndroid.show('Please enter a number for the rent price.', ToastAndroid.SHORT)
      setRentStyle({ ...styles.rentInput, borderWidth: 2, borderColor: '#FF2525' })
      return
    }
    if (isNaN(values.registrationPrice)) {
      isAllInputFilled = false
      ToastAndroid.show('Please enter a number for the registration.', ToastAndroid.SHORT)
      setRegStyle({ ...styles.regInput, borderWidth: 2, borderColor: '#FF2525' })
      return
    }
    if (parseInt(values.rentPrice) < parseInt(values.registrationPrice)) {
      isAllInputFilled = false
      ToastAndroid.show('Down payment must be less than or equal to rent price:', ToastAndroid.SHORT)
      setRegStyle({ ...styles.regInput, borderWidth: 2, borderColor: '#FF2525' })
      return
    }

    try {
      setLoading(true)
      const response = await fetch(image)
      const blob = await response.blob()
      const storageRef = ref(storage, 'ownerPosts/'+Date.now()+'.jpg');

      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      }).then((resp) => {
        getDownloadURL(storageRef)
        .then( async (downloadUrl) => {
          // console.log(downloadUrl);
          values.image = downloadUrl
          console.log('Image set successfully', resp)
      
          if (isAllInputFilled) {
            // add the data to the firestore
            const docRef = await addDoc(collection(FirebaseDB, 'OwnerPosts'), values)
              
            if (docRef.id) {
              setLoading(false);
              console.log('document added!')
              Alert.alert('Success!', 'Post Added Successfully.', [{text: 'OK', onPress: () => {
                navigation.navigate('Home')
                setImage(null)
                setImgStyle({...styles.image})
                Method.resetForm({values: formInitialValues})
              }
            }], {cancelable: false})
            }
          }
        })
      })
    } catch (error) {
      console.log(error.message)
      setLoading(false)
      ToastAndroid.show('Image is Required', ToastAndroid.SHORT)
    }
  }

  const handleInputError = (values) => {

    if (!values.title) {
      setTitleStyle({ ...styles.titleInput, borderBottomWidth: 2, borderColor: '#FF2525' })
    } else {
      setTitleStyle({...styles.titleInput})
    } if (!values.description) {
      setDescStyle({ ...styles.descriptionInput, borderWidth: 2, borderColor: '#FF2525' })
    } else {
      setDescStyle({...styles.descriptionInput})
    } if (!values.propertyType) {
      setPropertyStyle({ ...styles.pickerContainer, borderWidth: 2, borderColor: '#FF2525' })
    } else {
      setPropertyStyle({...styles.pickerContainer})
    } if (!values.rentPrice) {
      setRentStyle({ ...styles.rentInput, borderWidth: 2, borderColor: '#FF2525' })
    } else {
      setRentStyle({...styles.rentInput})
    } if (!values.registrationPrice) {
      setRegStyle({ ...styles.regInput, borderWidth: 2, borderColor: '#FF2525' })
    } else {
      setRegStyle({...styles.regInput})
    } if (!values.registrationPrice || parseInt(values.rentPrice) < parseInt(values.registrationPrice)) {
      setRegStyle({ ...styles.regInput, borderWidth: 2, borderColor: '#FF2525' })
    } else {
      setRegStyle({...styles.regInput})
    } if (!values.image) {
      setImgStyle({ ...styles.image, borderWidth: 2, borderColor: '#FF2525' })
      console.log('Image is required')
    } else {
      setImgStyle({...styles.image})
    } if (isNaN(values.rentPrice)) {
      setRentStyle({ ...styles.rentInput, borderWidth: 2, borderColor: '#FF2525' })
    }
    if (isNaN(values.registrationPrice)) {
      setRegStyle({ ...styles.regInput, borderWidth: 2, borderColor: '#FF2525' })
    }
  } 

  const formInitialValues = {
    title:null, 
    description:null, 
    rentPrice:"", 
    propertyType:null, 
    registrationPrice:"",
    image:null
  }

  return (
    <SafeAreaView>
      <HeaderComponent title='Add Property'/>
      
      <ScrollView>
        <View>
          <Formik
            initialValues={
              formInitialValues
            }
            onSubmit={(value, resetForm) => {
              onSubmitMethod(value, resetForm);
            }}
            // validate={(values) => {
              // const errors={}

              // for (let [key, val] of Object.entries(values)) {
              //   if (!val) {
              //     errors[key] = `${key} is required`
              //   }
              // }
              // console.log(errors)
              // // handleInputError(values)
              // return errors 
            // }}
          >
            {/* handle form */}
            {({handleChange, handleBlur, handleSubmit, values, setFieldValue, errors}) => ( 
              <View style={styles.container}>

                {/* set image */}
                <TouchableOpacity onPress={pickImage}
                  style={styles.imageContainer}
                >
                  {image ? <Image source={{ uri:image }} style={styles.image}/> 
                  :
                  <>
                  <Image source={require('../assets/placeholder.png')}
                  style={imgStyle}
                  />
                  <View style={styles.addIconContainer}> 
                    <Image resizeMode='cover' style={styles.addIcon} source={require('../assets/add.png')}/>
                  </View>
                  </>}
                </TouchableOpacity>

                {/* title container */}
                <View>
                  <Text style={styles.title}>Title</Text>
                  <TextInput
                    style={titleStyle}
                    placeholder="Enter Title"
                    value={values?.title}
                    onChangeText={handleChange('title')}
                    autoCapitalize='sentences'
                  />
                </View>

                {/* description container */} 
                <View>
                  <Text style={styles.description}>Description</Text>
                  <TextInput
                    style={descStyle}
                    placeholder="List key features and amenities (bedrooms, bathrooms, air-conditioned, etc.)"
                    value={values?.description}
                    onChangeText={handleChange('description')}
                    multiline={true}
                    numberOfLines={5}
                    maxLength={150}
                    autoCapitalize='sentences'
                  />
                </View>

                {/* property type container */}
                <View>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12}}>Property Type</Text>
                  <View style={propertyStyle}>
                    <Picker
                      style={styles.picker}
                      selectedValue={values?.propertyType}
                      onValueChange={itemvalue => setFieldValue('propertyType', itemvalue)}
                      
                      >
                        <Picker.Item type='number' key={0} label={'Select'} value={null} />
                        {propertyTypes&&propertyTypes.map((type, index) => (
                          <Picker.Item key={index} label={type} value={type} />
                        ))}
                    </Picker>
                  </View >
                </View>

                {/* rent price container */}
                <View style={styles.rentContainer}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold'}}>Rent</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput 
                      style={rentStyle}
                      placeholder='Enter Amount'
                      value={values?.rentPrice}
                      onChangeText={handleChange('rentPrice')}
                      numberOfLines={1}
                      maxLength={5}
                    />
                    <Text style={{ marginLeft: 8 }}>Monthly</Text>
                  </View>
                </View>

                {/* registration price container */}
                <View style={styles.rentContainer}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold'}}>Registration (Down Payment)</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput 
                      style={regStyle}
                      placeholder='Enter Amount'
                      value={values?.registrationPrice}
                      onChangeText={handleChange('registrationPrice')}
                      numberOfLines={1}
                      maxLength={5}
                    />
                    <Text style={{ marginLeft: 8, fontSize: 12 }}>2.5% will be added as fee.</Text>
                  </View>
                </View>

                {/* submit button */}
                <TouchableOpacity style={{...styles.addPropertybutton, backgroundColor: loading? '#C3DAFF' : '#4285F4' }} onPress={handleSubmit}>
                  { loading ?
                  <ActivityIndicator color='#4285F4'/> 
                  :
                  <Text style={{fontSize: 16, color: 'white'}}>ADD PROPERTY</Text>}
                </TouchableOpacity>

              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddPropertyScreen;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingBottom: 150,
    height: '100%'
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  titleInput: {
    fontSize: 18,
    height: 40,
    width: "100%",
    borderWidth: 0,
    borderBottomWidth: 1,
    alignSelf: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionInput: {
    fontSize: 18,
    height: 150,
    width: "100%",
    backgroundColor: '#DBDBDB',
    borderWidth: 0,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
    padding: 12,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    backgroundColor: "#DBDBDB",
    borderRadius: 10,
    marginBottom: 12,
    
  },
  picker: {
    
  },
  addPropertybutton: {
    flex: 1,
    backgroundColor: '#4285F4',
    height: 40,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    margin: 10,
  },
  rentContainer: {
    flexDirection: 'column',
    marginTop: 10,
    rowGap: 4,
    marginBottom: 12
  },
  rentInput: {
    fontSize: 16,
    borderWidth: 1,
    height: 36,
    width: 150,
    justifyContent: 'center',
    borderRadius: 8,
    padding: 8,
  },
  regInput: {
    fontSize: 16,
    borderWidth: 1,
    height: 36,
    width: 150,
    justifyContent: 'center',
    borderRadius: 8,
    padding: 8,
  },
  imageContainer: {
    postion: 'relative',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 330,
    height: 330,
    marginBottom: 20,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    // resizeMode: 'contain'
  },
  addIconContainer: {
    postion: 'absolute',
    width: 46,
    height: 46,
    top: -186,
    alignSelf: 'center',
    marginBottom: -46

  },
  addIcon: {
    width: '100%',
    height: '100%'
  }
})
