import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { useInfiniteHits } from "react-instantsearch-core";
import { SearchTermContext } from "../../../Contexts";

const Suggestions = ({ hitComponent: Hit, ...props }) => {
  const { hits, isLastPage, showMore } = useInfiniteHits({
    ...props,
    escapeHTML: false,
  });

  const { searchTerm } = React.useContext(SearchTermContext);

  return (
    <>
      <FlatList
        ListHeaderComponent={
          <View style={styles.searchForContainer}>
            <Text style={styles.text}>Search for </Text>
            <Text style={[styles.text, { color: "black", fontWeight: "400" }]}>
              {searchTerm ? searchTerm : "..."}
            </Text>
          </View>
        }
        keyboardShouldPersistTaps="always"
        style={styles.suggestionsContainer}
        showsVerticalScrollIndicator={false}
        data={hits}
        keyExtractor={(item) => item.objectID}
        onEndReached={() => {
          if (!isLastPage) {
            showMore();
          }
        }}
        renderItem={({ item }) => (
          <View>
            <Hit hit={item} />
          </View>
        )}
      />
    </>
  );
};

export default Suggestions;

const styles = StyleSheet.create({
  suggestionsContainer: {
    borderRadius: 10,
    marginVertical: 12,
    backgroundColor: "white",
    width: "100%",
    maxHeight: 350,
    marginHorizontal: -10,
    alignSelf: "center",
    borderWidth: 0.5,
    borderColor: "#BFBFBF",
  },
  searchForContainer: {
    flexDirection: "row",
    marginLeft: 12,
    height: 30,
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "gray",
  },
});
