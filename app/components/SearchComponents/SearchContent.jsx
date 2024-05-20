import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useInfiniteHits } from "react-instantsearch-core";
import { SearchTermContext } from "../../../Contexts";

const SearchContent = ({ hitComponent: Hit, ...props }) => {
  const { hits, isLastPage, showMore } = useInfiniteHits({
    ...props,
    escapeHTML: false,
  });

  const { searchTerm } = React.useContext(SearchTermContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 375);
  }, []);

  return (
    <>
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          color="midnightblue"
          size="large"
        />
      ) : (
        <>
          <View style={styles.searchResultContainer}>
            <Text style={styles.text}>Results for </Text>
            <Text style={[styles.text, { color: "black", fontWeight: "400" }]}>
              {searchTerm ? searchTerm : "..."}
            </Text>
          </View>
          <FlatList
            ListEmptyComponent={
              <View style={{ height: 60, alignItems: "center" }}>
                <Text style={{ alignSelf: "center" }}>No Results Found</Text>
              </View>
            }
            style={styles.container}
            showsVerticalScrollIndicator={false}
            data={searchTerm !== "" ? hits : []}
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
      )}
    </>
  );
};

export default SearchContent;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    marginBottom: 300,
    paddingHorizontal: 10,
    marginHorizontal: -10,
  },
  searchResultContainer: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 8,
    borderColor: "#BFBFBF",
  },
  text: {
    fontSize: 14,
    color: "gray",
  },
});
