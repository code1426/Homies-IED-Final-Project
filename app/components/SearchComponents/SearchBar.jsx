import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useContext } from "react";
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

  const handleSumbit = () => {
    if (searchTerm) {
      props.setIsSubmitted(true);
    } else {
      props.setIsSubmitted(false);
    }
  };

  const handleClear = () => {
    inputRef.current?.focus();
    setQuery("");
  };

  return (
    <View style={styles.searhBarContainer}>
      <Image
        style={styles.searchIcon}
        source={require("../../assets/search.png")}
      />
      <Image style={styles.line} source={require("../../assets/line.png")} />
      <TextInput
        value={searchTerm}
        onFocus={() => props.setIsSubmitted(false)}
        onSubmitEditing={() => handleSumbit()}
        onChangeText={setQuery}
        // clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        ref={inputRef}
        placeholder="Search..."
        style={styles.searchInput}
      />
      {searchTerm && (
        <TouchableOpacity onPress={() => handleClear()}>
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
    borderRadius: 23,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.7,
    borderColor: "midnightblue",
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
    width: 16,
    height: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  line: {
    height: 24,
    width: 12,
    marginRight: 6,
  },
});
