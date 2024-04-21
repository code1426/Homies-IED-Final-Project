import React, { useState, useEffect } from "react";
import { Text, SafeAreaView } from "react-native";
import { getDocs, collection,  } from "firebase/firestore";

import HeaderComponent from "../components/HeaderComponent";
import PostCard from "../components/PostCard";

function AppliedScreen(props) {
  const [appliedPropertyList, setAppliedPropertyList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAppliedPropertyList = async () => {
    try {
      setLoading(true);
      setAppliedPropertyList([]);
      const querySnapshot = await getDocs(
        collection(FirebaseDB, `Users/${currentUser.uid}/Pinned`)
      );
      setLoading(false);
      querySnapshot.forEach((doc) => {
        setAppliedPropertyList((property) => [...property, doc.data()]);
      });
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  };
  return (
    <SafeAreaView>
      <HeaderComponent title="Applied" />
    </SafeAreaView>
  );
}

export default AppliedScreen;
