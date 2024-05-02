import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ImageSlider } from "react-native-image-slider-aws-s3";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { FirebaseAuth, FirebaseDB } from "../../firebase.config";
import {
  UserContext,
  PinContext,
  AppliedContext,
  AddPropertyContext,
  MessageContext,
  MessageStateContext,
} from "../../Contexts";

const PostDetailScreen = ({ navigation }) => {
  const currentUser = useContext(UserContext);
  const { dispatch } = useContext(MessageContext);
  const nav = useNavigation();

  const { messageState } = useContext(MessageStateContext);

  const [ownerData, setOwnerData] = useState(null);
  const { params } = useRoute();
  const data = params.data;

  const features = [data.propertyType, ...data.features];
  const [isPropertyPinned, setIsPropertyPinned] = useState(false);
  const [isPropertyApplied, setIsPropertyApplied] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const { setPinState } = useContext(PinContext);
  const { setAppliedState } = useContext(AppliedContext);
  const { setAddState } = useContext(AddPropertyContext);

  useEffect(() => {
    getOwnerData();
    isPinned();
    isApplicantAprroved();
    isApplied();
    countApplicants();
  }, []);

  const getOwnerData = async () => {
    const ownerRef = doc(FirebaseDB, "Users", data.uid);
    const snapshot = await getDoc(ownerRef);
    if (snapshot.exists()) {
      setOwnerData(snapshot.data());
    }
  };

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

  const isPinned = async () => {
    try {
      const currentUserRef = doc(
        FirebaseDB,
        `Users/${currentUser.uid}/Pinned`,
        data.postID
      );
      const docSnap = await getDoc(currentUserRef);
      if (docSnap.exists()) {
        setIsPropertyPinned(true);
      } else {
        setIsPropertyPinned(false);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const setPinnedProperties = async () => {
    try {
      setPinState((prevstate) => !prevstate);
      const currentUserRef = doc(
        FirebaseDB,
        `Users/${currentUser.uid}/Pinned`,
        data.postID
      );

      if (!isPropertyPinned) {
        setIsPropertyPinned(true);
        await setDoc(currentUserRef, data);
      } else {
        setIsPropertyPinned(false);
        await deleteDoc(currentUserRef);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const isApplied = async () => {
    try {
      const currentUserRef = doc(
        FirebaseDB,
        `Users/${currentUser.uid}/Applied`,
        data.postID
      );
      const docSnap = await getDoc(currentUserRef);
      if (docSnap.exists()) {
        setIsPropertyApplied(true);
      } else {
        setIsPropertyApplied(false);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const setAppliedProperties = async () => {
    try {
      setAppliedState((prevstate) => !prevstate);
      const currentUserRef = doc(
        FirebaseDB,
        `Users/${currentUser.uid}/Applied`,
        data.postID
      );
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${data.postID}/Applicants`,
        currentUser.uid
      );

      if (!isPropertyApplied) {
        setIsPropertyApplied(true);
        await setDoc(currentUserRef, data);
        await setDoc(postRef, {
          ...currentUser,
          isApproved: false,
          isDeletedByOwner: "no",
        });
      } else {
        setIsPropertyApplied(false);
        await deleteDoc(currentUserRef);
        await deleteDoc(postRef);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const isApplicantAprroved = async () => {
    try {
      const postRef = doc(
        FirebaseDB,
        `OwnerPosts/${data.postID}/Applicants`,
        currentUser.uid
      );
      const post = await getDoc(postRef);
      if (post.exists()) {
        if (post.data().isApproved) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const [count, setCount] = useState(0);

  const countApplicants = async () => {
    try {
      let count = 0;
      setCount(0);
      const postRef = collection(
        FirebaseDB,
        `OwnerPosts/${data.postID}/Applicants`
      );
      const snapshot = await getDocs(postRef);
      snapshot.forEach((doc) => {
        if (doc.data().isDeletedByOwner === "no") {
          count++;
        }
      });
      setCount(count);
    } catch (err) {
      console.log(err.message);
    }
  };

  const [isdeleteLoading, setIsDeleteLoading] = useState(false);

  const confirmDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to remove this post?", [
      { text: "Cancel", onPress: () => console.log("Cancel") },
      { text: "Yes", onPress: () => handleDeleteProperty() },
    ]);
  };

  const handleDeleteProperty = async () => {
    try {
      setIsDeleteLoading(true);
      const postApplicantRef = collection(
        FirebaseDB,
        `OwnerPosts/${data.postID}/Applicants`
      );
      const snapshot = await getDocs(postApplicantRef);
      snapshot.forEach(async (document) => {
        try {
          const user = document.data();
          console.log(`User ${user.uid}`);
          const userAppliedRef = doc(
            FirebaseDB,
            `Users/${user.uid}/Applied`,
            data.postID
          );
          const userPinnedRef = doc(
            FirebaseDB,
            `Users/${user.uid}/Pinned`,
            data.postID
          );
          await deleteDoc(userAppliedRef);
          await deleteDoc(userPinnedRef);
        } catch (e) {
          setIsDeleteLoading(false);
          console.log("doc.map Error", e.message);
        }
      });
      const postRef = doc(FirebaseDB, "OwnerPosts", data.postID);
      await deleteDoc(postRef);
      console.log("post deleted successfully");
      setIsDeleteLoading(false);
      setAddState((prevState) => prevState + 1);
      navigation.goBack();
    } catch (err) {
      console.log(err.message);
      setIsDeleteLoading(false);
    }
  };

  // MESSAGE BUTTON

  const [messageLoading, setMessageLoading] = useState(false);

  const handleMessage = async () => {
    console.log(currentUser);
    // combine the ids
    const combinedID =
      currentUser.uid > ownerData.uid
        ? currentUser.uid + ownerData.uid
        : ownerData.uid + currentUser.uid;
    // using that id to make a document
    try {
      // checking if the document already exists
      setMessageLoading(true);
      const res = await getDoc(doc(FirebaseDB, "Messages", combinedID));
      console.log("Messages Checked");
      // if the document doesn't exist then make a new one
      if (!res.exists()) {
        await setDoc(doc(FirebaseDB, "Messages", combinedID), { messages: [] });
        console.log("Messages Between Two Users has been Created.");

        // Updating the MESSAGES DATA for the CURRENT USER
        await updateDoc(doc(FirebaseDB, "UserMessages", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: ownerData.uid,
            firstName: ownerData.firstName,
            lastName: ownerData.lastName,
            photoURL: ownerData.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
        console.log("currentUser message set");
        // Updating the MESSAGES DATA for the ownerData
        await updateDoc(doc(FirebaseDB, "UserMessages", ownerData.uid), {
          [combinedID + ".userInfo"]: {
            uid: currentUser.uid,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
        console.log("applicant message set");
      }
      await handleSelect(ownerData);
      console.log(ownerData);
    } catch (error) {
      console.log(error);
      setMessageLoading(false);
    }
  };

  const handleSelect = async (user) => {
    // console.log(ownerData);
    await dispatch({ type: "MESSAGE_PRESSED", payload: user });
    setMessageLoading(false);
    messageState !== 0
      ? navigation.navigate("MessagingRoom")
      : Alert.alert(
          "Open Messages",
          "To view your messages, please open the message screen."
        );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={styles.imageSliderContainer}>
              <ImageSlider
                data={[
                  { uri: data.thumbnail },
                  { uri: data.images.image1 },
                  { uri: data.images.image2 },
                  { uri: data.images.image3 },
                ]}
                autoPlay={false}
                closeIconColor="#fff"
              />
            </View>

            <View style={{ marginHorizontal: 25 }}>
              <View style={styles.textsContainer}>
                <View style={{ alignItems: "center", flex: 3 }}>
                  <Text style={styles.postTitle}>{data?.title}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "flex-start",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 6,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          height: 16,
                          width: 16,
                          marginRight: 4,
                          resizeMode: "contain",
                        }}
                        source={require("../../app/assets/location-Icon.png")}
                      />
                      <Text style={styles.postLocation} numberOfLines={2}>
                        {data?.address}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ alignItems: "center", flex: 2 }}>
                  <Text style={styles.price}>{`Php ${data?.rentPrice}`}</Text>
                  <Text style={styles.monthly}>monthly</Text>
                </View>
              </View>

              <View style={styles.desContainer}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    marginBottom: 4,
                  }}
                >
                  Description
                </Text>
                <Text style={styles.description}>{data?.description}</Text>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={styles.applicantContainer}>
            <Text style={styles.applicant}>{`APPLICANTS: ${count}`}</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        data={features}
        numColumns={2}
        renderItem={({ item, index }) => (
          <FeaturesComponent key={index} title={item} />
        )}
      />

      {currentUser?.role === "Owner" || currentUser.uid === data.uid || (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() => setPinnedProperties()}
            style={styles.pinnedButton}
          >
            <Image
              style={{ width: 23, height: 23 }}
              source={
                isPropertyPinned
                  ? require("./../../app/assets/navigationBarIcons/activePin.png")
                  : require("./../../app/assets/navigationBarIcons/nonactivePin.png")
              }
            />
            <Text>{isPropertyPinned ? "Pinned" : "Pin"}</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.reserveButton}>
            <Image
              style={{ width: 25, height: 25 }}
              source={require("./../../app/assets/reserveIcon.png")}
            />
            <Text>Reservation</Text>
            <Text style={{ fontSize: 10 }}>{`(Php ${parseInt(
              parseFloat(data.registrationPrice) * 1.01
            )}.00)`}</Text>
          </TouchableOpacity> */}
          {isApproved ? (
            <TouchableOpacity
              onPress={handleMessage}
              style={{ ...styles.applyButton, backgroundColor: "#lightblue" }}
            >
              {messageLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={require("../assets/navigationBarIcons/nonactiveMessages.png")}
                  />
                  <Text
                    style={{ color: "white", fontWeight: "700", fontSize: 16 }}
                  >
                    Message
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                setAppliedProperties();
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
              >
                {isPropertyApplied ? "APPLIED" : "APPLY NOW!"}
              </Text>
              {isPropertyApplied || (
                <Text style={{ color: "white", fontSize: 10 }}>
                  Watch an AD
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
      {currentUser.role === "Owner" && data.uid === currentUser.uid && (
        <View style={styles.ownerFooterContainer}>
          <TouchableOpacity
            style={[styles.editButtonContainer, { backgroundColor: "#F43535" }]}
            onPress={() => {
              confirmDelete();
            }}
          >
            {isdeleteLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
                DELETE
              </Text>
            )}
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.editButtonContainer, { flex: 2 }]}
            onPress={() => {}}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
              EDIT
            </Text>
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

function FeaturesComponent({ title }) {
  return (
    <View
      style={{
        backgroundColor: "#C6E1F1",
        borderColor: "#B1D5E9",
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
        height: 30,
        marginTop: 12,
        left: 15,
      }}
    >
      <Text style={{ paddingVertical: 4, paddingHorizontal: 20, fontSize: 12 }}>
        {title}
      </Text>
    </View>
  );
}

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  imageSliderContainer: {
    borderRadius: 10,
    marginVertical: 8,
  },
  detailsContainer: {
    marginHorizontal: 20,
  },
  textsContainer: {
    justifyContent: "space-between",
    marginVertical: 8,
    flexDirection: "row",
    // backgroundColor: "blue",
  },
  postTitle: {
    fontSize: 22,
    color: "black",
    alignSelf: "flex-start",
    width: "100%",
    fontWeight: "600",
  },
  postLocation: {
    fontSize: 14,
    fontWeight: "bold",
    color: "grey",
    alignSelf: "flex-start",
    width: "88%",
  },
  price: {
    alignSelf: "flex-end",
    fontWeight: "bold",
    fontSize: 18,
    color: "teal",
  },
  monthly: {
    alignSelf: "flex-end",
    fontSize: 12,
    fontWeight: "bold",
    // color: "grey",
  },
  desContainer: {
    marginVertical: 8,
    minHeight: 80,
    // backgroundColor: 'red'
  },
  description: {
    color: "gray",
    fontSize: 16,
    marginBottom: 10,
  },
  applicantContainer: {
    backgroundColor: "#ABCEE2",
    borderRadius: 20,
    maxWidth: 160,
    marginVertical: 18,
    alignItems: "center",
    marginLeft: 10,
    padding: 5,
    top: 10,
    left: 12,
    marginBottom: 100,
    // paddingHorizontal: 10
  },
  applicant: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
    marginHorizontal: 10,
  },
  footerContainer: {
    flexDirection: "row",
    height: 88,
    bottom: 0,
  },
  pinnedButton: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  reserveButton: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#00E4BB",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  applyButton: {
    flex: 2,
    flexDirection: "column",
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
    columnGap: 10,
  },
  editButtonContainer: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  ownerFooterContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    height: 78,
    left: 0,
    right: 0,
  },
});
