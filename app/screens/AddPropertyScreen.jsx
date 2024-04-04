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
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

import HeaderComponent from '../components/HeaderComponent';

const storage = getStorage(firebaseApp);

function AddPropertyScreen ({ navigation }) {

  const [propertyList, setPropertyList] = useState([]);

  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState({image1: null, image2: null, image3: null})

  const [titleStyle, setTitleStyle] = useState({...styles.titleInput})
  const [descStyle, setDescStyle] = useState({...styles.descriptionInput})
  const [propertyStyle, setPropertyStyle] = useState({...styles.pickerContainer})
  const [rentStyle, setRentStyle] = useState({...styles.rentInput})
  const [regStyle, setRegStyle] = useState({...styles.regInput})
  const [imgStyle, setImgStyle] = useState({...styles.thumbnail })
  const [featureStyle, setFeatureStyle] = useState({...styles.featuresContainer})
  const [image1Style, setImage1Style] = useState({...styles.image1})
  const [image2Style, setImage2Style] = useState({...styles.image2})
  const [image3Style, setImage3Style] = useState({...styles.image3})

  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const propertyTypes = [
    { label: 'Apartment', value: 'Apartment'},
    { label: 'Boarding House', value: 'Boarding House'},
    { label: 'Dormitory', value: 'Dormitory'},
  ]

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

  const pickThumbnail = async () => {
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
        // console.log('THUMBNAIL => ', result.assets[0].uri)
        setThumbnail(result.assets[0].uri);
        // console.log(image);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const pickImage1 = async () => {
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
        setImages({ ...images, image1:result.assets[0].uri });
        // console.log(image);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const pickImage2 = async () => {
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
        setImages({ ...images, image2: result.assets[0].uri });
        // console.log(image);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const pickImage3 = async () => {
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
        setImages({ ...images, image3:result.assets[0].uri });
        // console.log(image);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSubmitMethod = async (values, Method) => {
    handleInputError(values)
    let isAllInputFilled;
    console.log(values)
    // console.log(selected)

    for (let [key, val] of Object.entries(values)) {
      if (!val && key !== 'thumbnail' && key !== 'images') {
        isAllInputFilled = false;
        console.log(`Error at: ${key}`)
        // ToastAndroid.show('All input is required', ToastAndroid.SHORT)
        return
      } else isAllInputFilled = true;
    }

    if (isNaN(values.rentPrice)) {
      isAllInputFilled = false
      // ToastAndroid.show('Please enter a number for the rent price.', ToastAndroid.SHORT)
      setRentStyle({ ...styles.rentInput, borderWidth: 2, borderColor: '#FF2525' })
      return
    }
    if (isNaN(values.registrationPrice)) {
      isAllInputFilled = false
      // ToastAndroid.show('Please enter a number for the registration.', ToastAndroid.SHORT)
      setRegStyle({ ...styles.regInput, borderWidth: 2, borderColor: '#FF2525' })
      return
    }
    if (parseInt(values.rentPrice) < parseInt(values.registrationPrice)) {
      isAllInputFilled = false
      // ToastAndroid.show('Down payment must be less than or equal to rent price:', ToastAndroid.SHORT)
      setRegStyle({ ...styles.regInput, borderWidth: 2, borderColor: '#FF2525' })
      return
    }

    try {
      setLoading(true)
      const thumbnailRes = await fetch(thumbnail)
      const image1 = await fetch(images.image1)
      const image2 = await fetch(images.image2)
      const image3 = await fetch(images.image3)

      const thumbnailBlob = await thumbnailRes.blob()
      const image1Blob = await image1.blob()
      const image2Blob = await image2.blob()
      const image3Blob = await image3.blob()

      const storageRef = ref(storage, 'ownerPosts/thumbnail/'+Date.now()+'.jpg');
      const image1Ref = ref(storage, 'ownerPosts/image1/'+Date.now()+'.jpg');
      const image2Ref = ref(storage, 'ownerPosts/image2/'+Date.now()+'.jpg');
      const image3Ref = ref(storage, 'ownerPosts/image3/'+Date.now()+'.jpg');

      uploadBytes(image3Ref, image3Blob).then((snapshot) => {
        console.log('Uploaded a blob or file! 3333');
      }).then((resp)=> {
        getDownloadURL(image3Ref).then( async (downloadUrl) => {
          values.images.image3 = downloadUrl
          console.log('image3 set successfully');
        })
      })

      uploadBytes(storageRef, thumbnailBlob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      }).then((resp) => {
        getDownloadURL(storageRef)
        .then( async (downloadUrl) => {
          // console.log(downloadUrl);
          values.thumbnail = downloadUrl
          console.log('thumbnail set successfully')
      
          uploadBytes(image1Ref, image1Blob).then((snapshot) => {
            console.log('Uploaded a blob or file! 1111');
          }).then((resp)=> {
            getDownloadURL(image1Ref).then( async (downloadUrl) => {
              values.images.image1 = downloadUrl
              console.log('image1 set successfully');
    
              uploadBytes(image2Ref, image2Blob).then((snapshot) => {
                console.log('Uploaded a blob or file! 2222');
              }).then((resp)=> {
                getDownloadURL(image2Ref).then( async (downloadUrl) => {
                  values.images.image2 = downloadUrl
                  console.log('image2 set successfully');
    
                  uploadBytes(image2Ref, image2Blob).then((snapshot) => {
                    console.log('Uploaded a blob or file! 2222');
                  }).then((resp)=> {
                    getDownloadURL(image2Ref).then( async (downloadUrl) => {
                      values.images.image2 = downloadUrl
                      console.log('image2 set successfully');
    
                      if (isAllInputFilled) {
                        // add the data to the firestore
                        const docRef = await addDoc(collection(FirebaseDB, 'OwnerPosts'), values)
                          
                        if (docRef.id) {
                          setLoading(false);
                          console.log('document added!')
                          Alert.alert('Success!', 'Post Added Successfully.', [{text: 'OK', onPress: () => {
                            navigation.navigate('Home')
                            setThumbnail(null)
                            setImages({image1: null, image2: null, image3: null})
                            setImgStyle({...styles.thumbnail})
                            setImage1Style({...styles.image1})
                            setImage2Style({...styles.image2})
                            setImage3Style({...styles.image3})
                            Method.resetForm({values: formInitialValues})
                          }
                        }], {cancelable: false})
                        }
                      }
                    })
                  })
                })
              })
            })
          })
        })
      })


    } catch (error) {
      console.log(error.message, 'main')
      setLoading(false)
      // ToastAndroid.show('Thumbnail is Required', ToastAndroid.SHORT)
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
    } if (!values.thumbnail) {
      setImgStyle({ ...styles.thumbnail, borderWidth: 2, borderColor: '#FF2525' })
      console.log('thumbnail is required')
    } else {
      setImgStyle({...styles.thumbnail})
    } if (isNaN(values.rentPrice)) {
      setRentStyle({ ...styles.rentInput, borderWidth: 2, borderColor: '#FF2525' })
    }
    if (isNaN(values.registrationPrice)) {
      setRegStyle({ ...styles.regInput, borderWidth: 2, borderColor: '#FF2525' })
    } if (!values.features[0]) {
      setFeatureStyle({ ...styles.featuresContainer, borderWidth: 2, borderColor: '#FF2525' })
    } else {
      setFeatureStyle({ ...styles.featuresContainer})
    } if (!values.images.image1) {
      setImage1Style({ ...styles.image1, borderWidth: 2, borderColor: '#FF2525' })
    } else {
      setImage1Style({...styles.image1})
    } if (!values.images.image2) {
      setImage2Style({ ...styles.image2, borderWidth: 2, borderColor: '#FF2525' })
    } else {
      setImage2Style({...styles.image2})
    } if (!values.images.image3) {
      setImage3Style({ ...styles.image3, borderWidth: 2, borderColor: '#FF2525' })
    } else {
      setImage3Style({...styles.image3})
    }
  } 

  const formInitialValues = {
    title:null, 
    description:null, 
    rentPrice:"", 
    propertyType:null, 
    registrationPrice:"",
    thumbnail:null,
    images: {
      image1: null, 
      image2: null, 
      image3: null
    },
    features:[]
  }

  const data = [
    { label: 'Bed Space', value: 'Bed Space' },
    { label: 'Room', value: 'Room' },
    { label: 'Shared Room', value: 'Shared Room'},
    { label: 'Air Conditioned', value: 'Air Conditioned' },
  ];

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
                <TouchableOpacity onPress={pickThumbnail}
                  style={styles.thumbnailContainer}
                >
                  {thumbnail ? <Image source={{ uri:thumbnail }} style={styles.thumbnail}/> 
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

                <View style={{flexDirection: 'row', flex:1, width: 330, justifyContent: 'space-between', alignSelf: 'center' }}>

                  <TouchableOpacity onPress={pickImage1}
                    style={styles.imageContainer}
                  >
                    {images.image1 ? <Image source={{ uri:images.image1 }} style={styles.image1}/>
                    :
                    <>
                    <Image source={require('../assets/placeholder.png')}
                    style={image1Style}
                    />
                    <View style={styles.imageAddIconContainer}> 
                      <Image resizeMode='cover' style={styles.addIcon} source={require('../assets/add.png')}/>
                    </View>
                    </>}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={pickImage2}
                    style={styles.imageContainer}
                  >
                    {images.image2 ? <Image source={{ uri:images.image2 }} style={styles.image2}/>
                    :
                    <>
                    <Image source={require('../assets/placeholder.png')}
                    style={image2Style}
                    />
                    <View style={styles.imageAddIconContainer}> 
                      <Image resizeMode='cover' style={styles.addIcon} source={require('../assets/add.png')}/>
                    </View>
                    </>}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={pickImage3}
                    style={styles.imageContainer}
                  >
                    {images.image3 ? <Image source={{ uri:images.image3 }} style={styles.image3}/>
                    :
                    <>
                    <Image source={require('../assets/placeholder.png')}
                    style={image3Style}
                    />
                    <View style={styles.imageAddIconContainer}> 
                      <Image resizeMode='cover' style={styles.addIcon} source={require('../assets/add.png')}/>
                    </View>
                    </>}
                  </TouchableOpacity>

                </View>

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
                
                {/* Property Type */}
                <View style={{ marginBottom: 18 }}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Property Type</Text>
                  <Dropdown 
                    style={propertyStyle}
                    containerStyle={{borderRadius: 10}}
                    activeColor='#E8E8E8'
                    data={propertyTypes}
                    search={false}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={values?.propertyType}
                    onChange={item => {
                      setFieldValue('propertyType', item.value)}}
                  />
                </View>

                {/* Key Features */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Key Features</Text>
                  <View >
                    <MultiSelect
                      style={featureStyle}
                      containerStyle={{ borderRadius: 10 }}
                      selectedStyle={{ marginHorizontal: 2, marginTop: 2, borderRadius: 14, backgroundColor: '#00A4FF' }}
                      selectedTextStyle={{color:'white'}} 
                      activeColor='#E8E8E8'
                      search={false}
                      data={data}
                      labelField="label"
                      valueField="value"
                      placeholder="Select"
                      value={values?.features}
                      onChange={item => {
                        setFieldValue('features', item);
                      }}
                    />
                  </View>
                  
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
    // backgroundColor: 'red',
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
    marginBottom: 40,
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
    marginBottom: 40,
    padding: 12,
    textAlignVertical: 'top'
  },
  pickerContainer: { 
    borderWidth: 1, 
    padding: 8, 
    borderRadius: 10,
    marginBottom: 20
  },
  featuresContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 4,
    marginBottom: 4
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
  thumbnailContainer: {
    postion: 'relative',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 330,
    height: 330,
    marginBottom: 20,
  },
  thumbnail: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'contain'
  },
  addIconContainer: {
    postion: 'absolute',
    width: 46,
    height: 46,
    top: -188,
    alignSelf: 'center',
    marginBottom: -46
  },
  addIcon: {
    width: '100%',
    height: '100%'
  },
  imageContainer: {
    postion: 'relative',
    justifyContent: 'center',
    // alignSelf: 'center',
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
  },
  image1: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
  image2: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
  image3: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
  imageAddIconContainer: {
    postion: 'absolute',
    width: 20,
    height: 20,
    top: -60,
    alignSelf: 'center',
    marginBottom: -20
  },
})
