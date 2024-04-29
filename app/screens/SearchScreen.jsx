import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../components/SearchComponents/SearchBar";
import SearchPostCard from "../components/SearchComponents/SearchPostCard";
import SearchContent from "../components/SearchComponents/SearchContent";
import SuggestionCard from "../components/SearchComponents/SuggestionCard";
import Suggestions from "../components/SearchComponents/Suggestions";

import { SearchTermContext } from "../../Contexts";

import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-core";

const searchClient = algoliasearch(
  "220IDVMXC5",
  "8d571910a890df36c412e7113e4d97b2"
);

const SearchScreen = ({ navigation }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [searchTerm, setSearchTerm] = useState();
  const inputRef = useRef();

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
        bottom: 0,
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  return (
    <SearchTermContext.Provider value={{ searchTerm, setSearchTerm, inputRef }}>
      <SafeAreaView>
        <InstantSearch
          future={{ preserveSharedStateOnUnmount: true }}
          searchClient={searchClient}
          indexName="posts"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require("../assets/backIcon.png")}
                  style={styles.backButton}
                />
              </TouchableOpacity>
              <SearchBar setIsSubmitted={setIsSubmitted} />
            </View>
            {isSubmitted ? (
              <SearchContent hitComponent={SearchPostCard} />
            ) : (
              <Suggestions hitComponent={SuggestionCard} />
            )}
            {/* <SearchContent hitComponent={SearchPostCard} /> */}
          </View>
        </InstantSearch>
      </SafeAreaView>
    </SearchTermContext.Provider>
  );
};

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
    // backgroundColor: 'red'
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
  suggestionsContainer: {
    borderRadius: 10,
    marginVertical: 12,
    backgroundColor: "white",
    width: "100%",
    // maxHeight: 350,
    marginHorizontal: -10,
    alignSelf: "center",
    alignItems: "center",
    // rowGap: 4,
    // paddingVertical: 10,
  },
  searchContentContainer: {
    marginVertical: 20,
  },
  noResultContainer: {
    height: 100,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default SearchScreen;
