import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useSearchBox } from "react-instantsearch-core";

import { SearchTermContext } from "../../../Contexts";

const SearchBar = (props) => {
  const { query, refine } = useSearchBox(props);

  const { searchTerm, setSearchTerm, inputRef } = useContext(SearchTermContext);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
      setSearchTerm(query);
    }, 0);
  }, []);

  useEffect(() => {
    refine(searchTerm);
  }, [searchTerm]);

  const setQuery = (newquery) => {
    setSearchTerm(newquery);
    refine(newquery);

    if (query !== searchTerm && !inputRef.current?.isFocused()) {
      props.setIsSubmitted(true);
      setSearchTerm(query);
    }
  };

  return (
    <View style={styles.searhBarContainer}>
      <TextInput
        value={searchTerm}
        onFocus={() => props.setIsSubmitted(false)}
        onSubmitEditing={() => props.setIsSubmitted(true)}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        ref={inputRef}
        placeholder="Search..."
        style={styles.searchInput}
      />
      {searchTerm && (
        <TouchableOpacity onPress={() => setQuery("")}>
          <Image
            source={require("../../assets/clear-button.png")}
            style={styles.clearButton}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
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
