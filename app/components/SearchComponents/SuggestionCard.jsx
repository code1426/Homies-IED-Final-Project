import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, {useContext} from "react";

import { SearchTermContext } from "../../../Contexts";

const SuggestionCard = ({ hit }) => {
  const {setSearchTerm} = useContext(SearchTermContext)
  return (
    <TouchableOpacity
      onPress={() => setSearchTerm(hit.title)}
      style={styles.container}
    >
      <Image
        style={styles.searchIcon}
        source={require("../../assets/search-icon.png")}
      />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.text}>
          {hit.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SuggestionCard;

const styles = StyleSheet.create({
  container: {
    margin: 6,
    // marginTop: -8,
    flexDirection: "row",
    width: "90%",
    height: 35,
    // backgroundColor: "red",
    // justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: 0,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    // borderBottomWidth: 1,
    borderColor: "#D9D9D9",
  },
  text: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 17,
  },
});
