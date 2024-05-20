import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";

function PostCard({ data, shadow = true }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.push("postDetails", {
          data: data,
        })
      }
    >
      <View
        style={
          shadow
            ? {
                ...styles.container,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
              }
            : styles.container
        }
      >
        <Image
          style={{ height: 160, width: "100%", borderRadius: 20 }}
          source={{ uri: data?.thumbnail }}
        />

        <View style={styles.textsContainer}>
          <View style={{ alignItems: "center", marginBottom: 20, flex: 3 }}>
            <Text style={styles.postTitle} numberOfLines={1}>
              {data?.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-start",
                alignItems: "center",
              }}
            >
              <Image
                style={styles.locationIcon}
                source={require("../../assets/location-Icon.png")}
              />
              <Text style={styles.postLocation}>{data.address}</Text>
            </View>
          </View>

          <View style={{ alignItems: "center", marginBottom: 20, flex: 2 }}>
            <Text style={styles.price}>{`Php ${parseFloat(
              data?.rentPrice
            ).toLocaleString()}`}</Text>
            <Text style={styles.monthly}>monthly</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 24,
    borderColor: "#BFBFBF",
  },
  textsContainer: {
    justifyContent: "space-between",
    padding: 12,
    flexDirection: "row",
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "black",
    alignSelf: "flex-start",
    width: "100%",
  },
  postLocation: {
    fontSize: 12,
    fontWeight: "bold",
    color: "grey",
    alignSelf: "flex-start",
    width: "88%",
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
  locationIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginRight: 4,
  },
});
export default PostCard;
