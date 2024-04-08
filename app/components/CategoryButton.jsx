import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const CategoryButton = ({ value, selectedValue, setSelectedValue, getList, getAllList }) => {

  return (
    <TouchableOpacity
      style={[styles.button, selectedValue === value && styles.selected]}
      onPress={() => {
        setSelectedValue(value)
        if (value === 'All') {
          getAllList();
        } else getList(value);
      }}
      >
      <Text
        style={[
          styles.buttonLabel,
          selectedValue === value && styles.selectedLabel,
        ]}>
        {value}
      </Text>
    </TouchableOpacity>
  )
}

export default CategoryButton

const styles = StyleSheet.create({
  categoryContainer: {
    alignItems: "center",
    paddingVertical: 7,
  },
  row: {
    flexDirection: 'row',
  },
  selected: {
    backgroundColor: 'midnightblue',
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 15,
    backgroundColor: 'lightcyan',
    margin: 2,
    borderWidth: 1.3,
    borderColor:'midnightblue',
  },
  selectedLabel: {
    color: 'white',
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'midnightblue',
    textAlign: 'center',
  },
})