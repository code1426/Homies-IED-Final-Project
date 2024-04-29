import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";

const SearchedContentScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/backIcon.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <View style={styles.searhBarContainer}>
          <TextInput
            onSubmitEditing={() => console.log(searchTerm)}
            // ref={inputRef}
            onFocus={() => navigation.goBack()}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search..."
            style={styles.searchInput}
            keyboardType="web-search"
          />
          {searchTerm && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Image
                source={require("../assets/clear-button.png")}
                style={styles.clearButton}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default SearchedContentScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
  },
  header: {
    marginHorizontal: -20,
    marginTop: Platform.OS === "android" ? 41 : 15,
    alignItems: "center",
    justifyContent: "center",
    height: 62,
    paddingVertical: 8,
    flexDirection: "row",
    columnGap: 4,
  },
  searhBarContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 6,
    marginRight: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flex: 1,
  },
  backButton: {
    width: 25,
    height: 25,
  },
  clearButton: {
    width: 15,
    height: 15,
    marginLeft: 6,
    marginRight: -6,
  },
});
