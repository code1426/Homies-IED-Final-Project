import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";

import { useRoute } from "@react-navigation/native";

import { ImageSlider } from "react-native-image-slider-aws-s3";

const PostDetailScreen = ({ navigation }) => {
  const { params } = useRoute();
  const data = params.data;
  let address = "Jaro, Iloilo City"; // for testing purposes

  useEffect(() => {
    // console.log(params.data);
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  const features = [data.propertyType, ...data.features];

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={styles.imageSliderContainer}>
              <ImageSlider
                data={[
                  { uri: data.thumbnail },
                  { uri: data.images.image1 },
                  { uri: data.images.image2 },
                  { uri: data.images.image3 },
                ]}
                autoPlay={false}
                // onItemChanged={(item) => console.log("item", item)}
                closeIconColor="#fff"
              />
            </View>

            <View style={{ marginHorizontal: 15 }}>
              <View style={styles.textsContainer}>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.postTitle}>{data?.title}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "flex-start",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 6,
                    }}
                  >
                    <Image
                      style={{ height: 15, width: 15 }}
                      source={require("../../app/assets/location-Icon.png")}
                    />
                    <Text style={styles.postLocation}>{address}</Text>
                  </View>
                </View>

                <View style={{ alignItems: "center" }}>
                  <Text style={styles.price}>{`Php ${data?.rentPrice}`}</Text>
                  <Text style={styles.monthly}>monthly</Text>
                </View>
              </View>

              <View style={styles.desContainer}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, marginBottom: 4 }}
                >
                  Description
                </Text>
                <Text style={styles.description}>{data?.description}</Text>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={{ marginHorizontal: 0 }}>
            <View style={styles.applicantContainer}>
              <Text style={styles.applicant}>APPLICANTS: 0</Text>
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
        data={features}
        numColumns={3}
        renderItem={({ item, index }) => (
          <FeaturesComponent key={index} title={item} />
        )}
      />

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.pinnedButton}>
          <Image
            style={{ width: 23, height: 23 }}
            source={require("./../../app/assets/navigationBarIcons/nonactivePin.png")}
          />
          <Text>Pin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reserveButton}>
          <Image
            style={{ width: 25, height: 25 }}
            source={require("./../../app/assets/reserveIcon.png")}
          />
          <Text>Reservation</Text>
          <Text style={{ fontSize: 10 }}>{`(Php ${parseInt(
            parseFloat(data.registrationPrice) * 1.01
          )}.00)`}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyButton}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            APPLY NOW!
          </Text>
          <Text style={{ color: "white", fontSize: 10 }}>Watch an AD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function FeaturesComponent({ title }) {
  return (
    <View
      style={{
        backgroundColor: "#C6E1F1",
        borderColor: "#B1D5E9",
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
        height: 30,
        marginVertical: 4,
      }}
    >
      <Text style={{ paddingVertical: 4, paddingHorizontal: 12, fontSize: 12 }}>
        {title}
      </Text>
    </View>
  );
}

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    // paddingHorizontal: 10
  },
  imageSliderContainer: {
    // display: "absolute",
    borderRadius: 10,
    // marginHorizontal: -20,
    marginVertical: 8,
    // backgroundColor: 'red'
  },
  detailsContainer: {
    marginHorizontal: 20,
  },
  textsContainer: {
    justifyContent: "space-between",
    marginVertical: 8,
    flexDirection: "row",
    // backgroundColor: "blue",
  },
  postTitle: {
    fontSize: 22,
    color: "black",
    alignSelf: "flex-start",
  },
  postLocation: {
    fontSize: 14,
    fontWeight: "bold",
    color: "grey",
    alignSelf: "flex-start",
  },
  price: {
    alignSelf: "flex-end",
    fontWeight: "bold",
    fontSize: 18,
    color: "teal",
  },
  monthly: {
    alignSelf: "flex-end",
    fontSize: 12,
    fontWeight: "bold",
    color: "grey",
  },
  desContainer: {
    marginVertical: 8,
    minHeight: 80,
  },
  description: {
    color: "gray",
    fontSize: 16,
  },
  applicantContainer: {
    backgroundColor: "#ABCEE2",
    borderRadius: 20,
    maxWidth: 160,
    marginVertical: 18,
    alignItems: "center",
    marginLeft: 10,
  },
  applicant: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
    marginHorizontal: 8,
  },
  footerContainer: {
    flexDirection: "row",
    // marginBottom: 50,
    height: 78,
    // marginHorizontal: -10
  },
  pinnedButton: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  reserveButton: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#00E4BB",
    alignItems: "center",
    justifyContent: "center",
  },
  applyButton: {
    flex: 2,
    flexDirection: "column",
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
});
