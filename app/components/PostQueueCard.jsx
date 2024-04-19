import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import QueuedComponent from "./QueuedComponent";
import PostCard from "./PostCard";

const PostQueueCard = ({ data }) => {
  return (
    <View style={styles.container}>
      <PostCard data={data} />
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Queue</Text>
        </View>

        <View style={styles.queueContainer}>
          <QueuedComponent />
          <QueuedComponent />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 20,
  },
  titleContainer: {
    marginTop: -40,
    width: "100%",
    justifyContent: "center",
    padding: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default PostQueueCard;
