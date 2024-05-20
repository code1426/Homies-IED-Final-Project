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
    flexDirection: "row",
    width: "100%",
    height: 35,
    paddingHorizontal: 12,
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
    borderColor: "#D9D9D9",
  },
  text: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 17,
  },
});
