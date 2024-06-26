import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";

import { ApplicantContext } from "../../../Contexts";
import { useContext } from "react";

const ViewProfileScreen = ({ setModalVisible }) => {
  const handleVisible = () => {
    setModalVisible(false);
    setApplicant(null);
  };

  const { applicant, setApplicant } = useContext(ApplicantContext);

  return (
    <TouchableWithoutFeedback onPress={handleVisible}>
      <View style={styles.blur}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.header}>Profile</Text>
          <View style={styles.infoContainer}>
            <View style={styles.image}>
              <Image
                style={styles.image}
                source={{ uri: applicant.photoURL }}
              ></Image>
            </View>
            <View style={styles.textInfoContainer}>
              <View style={[styles.textIconContainer]}>
                <Text
                  style={styles.name}
                >{`${applicant.firstName} ${applicant.lastName}`}</Text>
              </View>
              <View style={[styles.textIconContainer]}>
                <Image
                  style={styles.icon}
                  source={require("../../assets/location-Icon.png")}
                />
                <Text>{applicant.location}</Text>
              </View>
              <View style={[styles.textIconContainer]}>
                <Image
                  style={styles.icon}
                  source={require("../../assets/email.png")}
                />
                <Text>{applicant.email}</Text>
              </View>
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={[styles.name, { marginBottom: 6, marginTop: 0 }]}>
              About
            </Text>
            <Text style={{ marginBottom: 2 }}>
              {!applicant.profileDescription
                ? "User hasn't added a bio yet."
                : applicant.profileDescription}
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ViewProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 40,
    marginTop: 100,
    alignSelf: "center",
    paddingHorizontal: 12,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 100,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  textInfoContainer: {
    flex: 1,
    padding: 12,
  },
  textIconContainer: {
    flexDirection: "row",
    marginBottom: 0,
    maxWidth: 300,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  descriptionContainer: {
    backgroundColor: "#D6E5FA",
    alignSelf: "center",
    width: "100%",
    minHeight: 80,
    maxHeight: 420,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  icon: {
    width: 13,
    height: 13,
    marginRight: 8,
    alignSelf: "center",
  },
  blur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
    color: "black",
  },
});
