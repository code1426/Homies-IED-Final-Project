import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useState, useContext } from "react";
import { FirebaseDB, FirebaseAuth } from "../../firebase.config";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { Formik } from "formik";
import { SafeAreaView } from "react-native";
import React from "react";

import * as ImagePicker from "expo-image-picker";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

import HeaderComponent from "../components/HeaderComponent";
import { firebaseStorage } from "../../firebase.config";

import { AddPropertyContext } from "../../Contexts";

function AddPropertyScreen({ navigation }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const { setAddState } = useContext(AddPropertyContext);

  const [titleStyle, setTitleStyle] = useState({ ...styles.titleInput });
  const [descStyle, setDescStyle] = useState({ ...styles.descriptionInput });
  const [propertyStyle, setPropertyStyle] = useState({
    ...styles.pickerContainer,
  });
  const [rentStyle, setRentStyle] = useState({ ...styles.rentInput });
  const [regStyle, setRegStyle] = useState({ ...styles.regInput });
  const [imgStyle, setImgStyle] = useState({ ...styles.thumbnail });
  const [featureStyle, setFeatureStyle] = useState({
    ...styles.featuresContainer,
  });
  const [addressStyle, setAddressStyle] = useState({ ...styles.addressInput });
  const [image1Style, setImage1Style] = useState({ ...styles.image1 });
  const [image2Style, setImage2Style] = useState({ ...styles.image2 });
  const [image3Style, setImage3Style] = useState({ ...styles.image3 });

  const [loading, setLoading] = useState(false);

  const propertyTypes = [
    { label: "Apartment", value: "Apartment" },
    { label: "Boarding House", value: "Boarding House" },
    { label: "Dormitory", value: "Dorm" },
  ];

  const pickThumbnail = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [5, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setThumbnail(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const pickImage1 = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [5, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImages({ ...images, image1: result.assets[0].uri });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const pickImage2 = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [5, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImages({ ...images, image2: result.assets[0].uri });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const pickImage3 = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [5, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImages({ ...images, image3: result.assets[0].uri });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSubmitMethod = async (values, Method) => {
    handleInputError(values);
    let isAllInputFilled;
    console.log(values);

    for (let [key, val] of Object.entries(values)) {
      if (!val && key !== "thumbnail" && key !== "images") {
        isAllInputFilled = false;
        console.log(`Error at: ${key}`);
        return;
      } else isAllInputFilled = true;
    }

    if (values.features == []) {
      isAllInputFilled = false;
      return;
    }

    if (isNaN(values.rentPrice)) {
      isAllInputFilled = false;

      setRentStyle({
        ...styles.rentInput,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
      return;
    }
    if (isNaN(values.registrationPrice)) {
      isAllInputFilled = false;
      setRegStyle({
        ...styles.regInput,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
      return;
    }
    if (parseInt(values.rentPrice) < parseInt(values.registrationPrice)) {
      isAllInputFilled = false;
      setRegStyle({
        ...styles.regInput,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
      return;
    }

    try {
      setLoading(true);
      const thumbnailRes = await fetch(thumbnail);
      const image1 = await fetch(images.image1);
      const image2 = await fetch(images.image2);
      const image3 = await fetch(images.image3);

      const thumbnailBlob = await thumbnailRes.blob();
      const image1Blob = await image1.blob();
      const image2Blob = await image2.blob();
      const image3Blob = await image3.blob();

      const storageRef = ref(
        firebaseStorage,
        "ownerPosts/thumbnail/" + Date.now() + ".jpg"
      );
      const image1Ref = ref(
        firebaseStorage,
        "ownerPosts/image1/" + Date.now() + ".jpg"
      );
      const image2Ref = ref(
        firebaseStorage,
        "ownerPosts/image2/" + Date.now() + ".jpg"
      );
      const image3Ref = ref(
        firebaseStorage,
        "ownerPosts/image3/" + Date.now() + ".jpg"
      );

      await uploadBytesResumable(storageRef, thumbnailBlob);
      const thumbnailUrl = await getDownloadURL(storageRef);
      values.thumbnail = thumbnailUrl;
      console.log("getting THUMBNAIL URL done: ", thumbnailUrl);

      await uploadBytesResumable(image1Ref, image1Blob);
      const image1Url = await getDownloadURL(image1Ref);
      values.images.image1 = image1Url;
      console.log("getting IMAGE-1 URL finished: ", image1Url);

      await uploadBytesResumable(image2Ref, image2Blob);
      const image2Url = await getDownloadURL(image2Ref);
      values.images.image2 = image2Url;
      console.log("Uploaded IMAGE-2 to storage:", image2Url);

      await uploadBytesResumable(image3Ref, image3Blob);
      const image3Url = await getDownloadURL(image3Ref);
      values.images.image3 = image3Url;
      console.log("getting IMAGE-3 URL finished: ", image3Url);

      if (isAllInputFilled) {
        // add the data to the firestore
        const docRef = doc(FirebaseDB, "OwnerPosts", values.postID);
        console.log("setting all data to document...");
        await setDoc(docRef, values);
        console.log("SUCCESS");

        if (true) {
          setLoading(false);
          setAddState((prevState) => prevState + 1);
          console.log("document added succesfully!");
          Alert.alert(
            "Success!",
            "Post Added Successfully.",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("HomeStackNav");
                  setThumbnail(null);
                  setImages({
                    image1: null,
                    image2: null,
                    image3: null,
                  });
                  setImgStyle({
                    ...styles.thumbnail,
                  });
                  setImage1Style({
                    ...styles.image1,
                  });
                  setImage2Style({
                    ...styles.image2,
                  });
                  setImage3Style({
                    ...styles.image3,
                  });
                  Method.resetForm({
                    values: formInitialValues,
                  });
                },
              },
            ],
            { cancelable: false }
          );
        }
      }
    } catch (error) {
      console.log(error.message, "main");
      setLoading(false);
    }
  };

  const handleInputError = (values) => {
    if (!values.title) {
      setTitleStyle({
        ...styles.titleInput,
        borderBottomWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setTitleStyle({ ...styles.titleInput });
    }
    if (!values.description) {
      setDescStyle({
        ...styles.descriptionInput,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setDescStyle({ ...styles.descriptionInput });
    }
    if (!values.propertyType) {
      setPropertyStyle({
        ...styles.pickerContainer,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setPropertyStyle({ ...styles.pickerContainer });
    }
    if (!values.rentPrice) {
      setRentStyle({
        ...styles.rentInput,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setRentStyle({ ...styles.rentInput });
    }
    if (!values.registrationPrice) {
      setRegStyle({
        ...styles.regInput,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setRegStyle({ ...styles.regInput });
    }
    if (
      !values.registrationPrice ||
      parseInt(values.rentPrice) < parseInt(values.registrationPrice)
    ) {
      setRegStyle({
        ...styles.regInput,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setRegStyle({ ...styles.regInput });
    }
    if (!values.thumbnail) {
      setImgStyle({
        ...styles.thumbnail,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setImgStyle({ ...styles.thumbnail });
    }
    if (isNaN(values.rentPrice)) {
      setRentStyle({
        ...styles.rentInput,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    }
    if (isNaN(values.registrationPrice)) {
      setRegStyle({
        ...styles.regInput,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    }
    if (!values.features[0]) {
      setFeatureStyle({
        ...styles.featuresContainer,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setFeatureStyle({ ...styles.featuresContainer });
    }
    if (!values.images.image1) {
      setImage1Style({
        ...styles.image1,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setImage1Style({ ...styles.image1 });
    }
    if (!values.images.image2) {
      setImage2Style({
        ...styles.image2,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setImage2Style({ ...styles.image2 });
    }
    if (!values.images.image3) {
      setImage3Style({
        ...styles.image3,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setImage3Style({ ...styles.image3 });
    }
    if (!values.address) {
      setAddressStyle({
        ...styles.addressInput,
        borderWidth: 2,
        borderColor: "#FF2525",
      });
    } else {
      setAddressStyle({ ...styles.addressInput });
    }
  };

  const formInitialValues = {
    title: null,
    description: null,
    rentPrice: "",
    propertyType: null,
    registrationPrice: "",
    thumbnail: null,
    images: {
      image1: null,
      image2: null,
      image3: null,
    },
    features: [],
    address: null,
    created_at: serverTimestamp(),
    uid: FirebaseAuth.currentUser.uid,
    email: FirebaseAuth.currentUser.email,
    userName: FirebaseAuth.currentUser.displayName,
    postID: Math.random().toString(16).slice(2),
  };

  const data = [
    { label: "Bed Space", value: "Bed Space" },
    { label: "Room", value: "Room" },
    { label: "Shared Room", value: "Shared Room" },
    { label: "Air Conditioned", value: "Air Conditioned" },
    { label: "CCTV Monitored", value: "CCTV Monitored" },
    { label: "Common Laundry Area", value: "Common Laundry Area" },
    { label: "Common Kitchen Area", value: "Common Kitchen Area" },
    { label: "Piso Wi-Fi", value: "Piso Wi-Fi" },
    { label: "Own Sub-meter", value: "Own Sub-meter" },
    { label: "2 BedRooms", value: "2 BedRooms" },
    { label: "3 BedRooms", value: "3 BedRooms" },
    { label: "4 BedRooms", value: "4 BedRooms" },
    { label: "Fire Alarm System", value: "Fire Alarm System" },
    { label: "Free Water", value: "Free Water" },
    { label: "Metered Electricity", value: "Metered Electricity" },
  ];

  return (
    <SafeAreaView>
      <HeaderComponent title="Add Property" />

      <ScrollView>
        <View>
          <Formik
            initialValues={formInitialValues}
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
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              setFieldValue,
              errors,
            }) => (
              <View style={styles.container}>
                {/* set image */}
                <TouchableOpacity
                  onPress={pickThumbnail}
                  style={styles.thumbnailContainer}
                >
                  {thumbnail ? (
                    <Image
                      source={{ uri: thumbnail }}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <>
                      <Image
                        source={require("../assets/placeholder.png")}
                        style={imgStyle}
                      />
                      <View style={styles.addIconContainer}>
                        <Image
                          resizeMode="cover"
                          style={styles.addIcon}
                          source={require("../assets/add.png")}
                        />
                      </View>
                    </>
                  )}
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    width: 330,
                    justifyContent: "space-between",
                    alignSelf: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={pickImage1}
                    style={styles.imageContainer}
                  >
                    {images.image1 ? (
                      <Image
                        source={{ uri: images.image1 }}
                        style={styles.image1}
                      />
                    ) : (
                      <>
                        <Image
                          source={require("../assets/placeholder.png")}
                          style={image1Style}
                        />
                        <View style={styles.imageAddIconContainer}>
                          <Image
                            resizeMode="cover"
                            style={styles.addIcon}
                            source={require("../assets/add.png")}
                          />
                        </View>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={pickImage2}
                    style={styles.imageContainer}
                  >
                    {images.image2 ? (
                      <Image
                        source={{ uri: images.image2 }}
                        style={styles.image2}
                      />
                    ) : (
                      <>
                        <Image
                          source={require("../assets/placeholder.png")}
                          style={image2Style}
                        />
                        <View style={styles.imageAddIconContainer}>
                          <Image
                            resizeMode="cover"
                            style={styles.addIcon}
                            source={require("../assets/add.png")}
                          />
                        </View>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={pickImage3}
                    style={styles.imageContainer}
                  >
                    {images.image3 ? (
                      <Image
                        source={{ uri: images.image3 }}
                        style={styles.image3}
                      />
                    ) : (
                      <>
                        <Image
                          source={require("../assets/placeholder.png")}
                          style={image3Style}
                        />
                        <View style={styles.imageAddIconContainer}>
                          <Image
                            resizeMode="cover"
                            style={styles.addIcon}
                            source={require("../assets/add.png")}
                          />
                        </View>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* title container */}
                <View>
                  <Text style={styles.title}>Title</Text>
                  <TextInput
                    style={titleStyle}
                    placeholder="Enter Title"
                    value={values?.title}
                    onChangeText={handleChange("title")}
                    autoCapitalize="sentences"
                  />
                </View>

                {/* description container */}
                <View>
                  <Text style={styles.description}>Description</Text>
                  <TextInput
                    style={descStyle}
                    placeholder="List key features and amenities (bedrooms, bathrooms, air-conditioned, etc.)"
                    value={values?.description}
                    onChangeText={handleChange("description")}
                    multiline={true}
                    numberOfLines={5}
                    maxLength={600}
                    autoCapitalize="sentences"
                  />
                </View>

                {/* Property Type */}
                <View style={{ marginBottom: 18 }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      marginBottom: 12,
                    }}
                  >
                    Property Type
                  </Text>
                  <Dropdown
                    style={propertyStyle}
                    containerStyle={{ borderRadius: 10 }}
                    activeColor="#E8E8E8"
                    data={propertyTypes}
                    search={false}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={values?.propertyType}
                    onChange={(item) => {
                      setFieldValue("propertyType", item.value);
                    }}
                  />
                </View>

                {/* Key Features */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      marginBottom: 12,
                    }}
                  >
                    Features / Amenities
                  </Text>
                  <View>
                    <MultiSelect
                      style={featureStyle}
                      containerStyle={{ borderRadius: 10 }}
                      selectedStyle={{
                        marginHorizontal: 2,
                        marginTop: 2,
                        borderRadius: 14,
                        backgroundColor: "#00A4FF",
                      }}
                      selectedTextStyle={{ color: "white" }}
                      activeColor="#E8E8E8"
                      search={false}
                      data={data}
                      labelField="label"
                      valueField="value"
                      placeholder="Select"
                      value={values?.features}
                      // value={["Room"]}
                      onChange={(item) => {
                        setFieldValue("features", item);
                      }}
                    />
                  </View>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      marginBottom: 8,
                    }}
                  >
                    Address
                  </Text>
                  <TextInput
                    style={addressStyle}
                    placeholder="Enter Address"
                    value={values?.address}
                    onChangeText={handleChange("address")}
                    multiline={true}
                    numberOfLines={2}
                    maxLength={100}
                    autoCapitalize="sentences"
                  />
                </View>

                {/* rent price container */}
                <View style={styles.rentContainer}>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>Rent</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={rentStyle}
                      placeholder="Enter Amount"
                      value={values?.rentPrice}
                      onChangeText={handleChange("rentPrice")}
                      numberOfLines={1}
                      maxLength={5}
                      keyboardType="numeric"
                    />
                    <Text style={{ marginLeft: 8 }}>Monthly</Text>
                  </View>
                </View>

                {/* registration price container */}
                <View style={styles.rentContainer}>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                    Registration (Down Payment)
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={regStyle}
                      placeholder="Enter Amount"
                      value={values?.registrationPrice}
                      onChangeText={handleChange("registrationPrice")}
                      numberOfLines={1}
                      maxLength={5}
                      keyboardType="numeric"
                    />
                    <Text style={{ marginLeft: 8, fontSize: 12 }}>
                      1.0% will be added as fee.
                    </Text>
                  </View>
                </View>

                {/* submit button */}
                <TouchableOpacity
                  style={{
                    ...styles.addPropertybutton,
                    backgroundColor: loading ? "#C3DAFF" : "#4285F4",
                  }}
                  onPress={handleSubmit}
                >
                  {loading ? (
                    <ActivityIndicator color="#4285F4" />
                  ) : (
                    <Text style={{ fontSize: 16, color: "white" }}>
                      ADD PROPERTY
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddPropertyScreen;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingBottom: 130,
    height: "100%",
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
    alignSelf: "center",
    marginBottom: 40,
  },
  description: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionInput: {
    fontSize: 18,
    minHeight: 150,
    maxHeight: 600,
    width: "100%",
    backgroundColor: "#DBDBDB",
    borderWidth: 0,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 40,
    padding: 12,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  featuresContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 4,
    marginBottom: 4,
  },
  addPropertybutton: {
    flex: 1,
    backgroundColor: "#4285F4",
    height: 40,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 20,
    margin: 10,
  },
  rentContainer: {
    flexDirection: "column",
    marginTop: 10,
    rowGap: 4,
    marginBottom: 12,
  },
  rentInput: {
    fontSize: 16,
    borderWidth: 1,
    height: 36,
    width: 150,
    justifyContent: "center",
    borderRadius: 8,
    padding: 8,
  },
  regInput: {
    fontSize: 16,
    borderWidth: 1,
    height: 36,
    width: 150,
    justifyContent: "center",
    borderRadius: 8,
    padding: 8,
  },
  thumbnailContainer: {
    postion: "relative",
    justifyContent: "center",
    alignSelf: "center",
    width: 330,
    height: 330,
    marginBottom: 20,
  },
  thumbnail: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  addIconContainer: {
    postion: "absolute",
    width: 46,
    height: 46,
    top: -188,
    alignSelf: "center",
    marginBottom: -46,
  },
  addIcon: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    postion: "relative",
    justifyContent: "center",
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
  },
  image1: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  image2: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  image3: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imageAddIconContainer: {
    postion: "absolute",
    width: 20,
    height: 20,
    top: -60,
    alignSelf: "center",
    marginBottom: -20,
  },
  addressInput: {
    fontSize: 16,
    borderWidth: 1,
    height: 50,
    width: "100%",
    justifyContent: "center",
    borderRadius: 8,
    padding: 8,
    marginBottom: 20,
  },
});
