import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MessageContext, UserContext } from "../../../Contexts";

function Message({ message }) {
  const currentUser = useContext(UserContext);
  const { data } = useContext(MessageContext);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handlePayment = () => {
    setPaymentLoading(false);
    Alert.alert("Payment Successful", "", [
      {
        text: "OK",
        onPress: () => {
          console.log("Ok Pressed");
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        message.senderId === currentUser.uid && { alignSelf: "flex-end" },
      ]}
    >
      {message.senderId === currentUser.uid ? (
        <>
          <View
            style={[
              styles.text,
              message.senderId === currentUser.uid
                ? { backgroundColor: "#B3E5FC" }
                : { backgroundColor: "#F0F0F0" },
            ]}
          >
            {message.reserveMode === true ? (
              <View style={styles.reservation}>
                <Text style={[styles.reservationTitle, { fontSize: 15 }]}>
                  Reservation Offer Sent
                </Text>
                <Text style={styles.reserveFee}>
                  Php {parseInt(message.reserveFee).toLocaleString()}
                </Text>
              </View>
            ) : (
              <Text>{message.text}</Text>
            )}
          </View>
          <Image
            style={styles.profilePic}
            source={{
              uri:
                message.senderId === currentUser.uid
                  ? currentUser.photoURL
                  : data.user.photoURL,
            }}
          />
        </>
      ) : (
        <>
          <Image
            style={styles.profilePic}
            source={{
              uri:
                message.senderId === currentUser.uid
                  ? currentUser.photoURL
                  : data.user.photoURL,
            }}
          />
          <View
            style={[
              message.senderId === currentUser.uid
                ? { backgroundColor: "#B3E5FC" }
                : { backgroundColor: "#E0E0E0" },
              styles.text,
            ]}
          >
            {message.reserveMode === true ? (
              <View style={styles.reservation}>
                <Text style={[styles.reservationTitle, { fontSize: 20 }]}>
                  Reservation Offer
                </Text>
                <Text style={styles.reservationDescription}>
                  Would you like to reserve the place for:
                </Text>
                <Text style={styles.reserveFee}>
                  Php{" "}
                  {parseInt(
                    parseFloat(message.reserveFee) +
                      parseFloat(message.reserveFee) * 0.01
                  ).toLocaleString()}
                </Text>
                <View style={styles.reserveButton}>
                  <TouchableOpacity
                    onPress={() => {
                      setPaymentLoading(true);
                      setTimeout(handlePayment, 3000);
                    }}
                  >
                    {paymentLoading ? (
                      <ActivityIndicator
                        style={{ flex: 1, alignSelf: "center" }}
                        color="white"
                        size="small"
                      />
                    ) : (
                      <Text>Accept Offer</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text>{message.text}</Text>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
  },
  profilePic: {
    alignSelf: "center",
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: "cover",
    marginHorizontal: 8,
  },
  you: {
    alignSelf: "flex-end",
  },
  others: {},
  text: {
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    width: "auto",
    maxWidth: 200,
  },
  reservation: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  reservationTitle: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
  reservationDescription: {
    fontSize: 12,
  },
  reserveFee: {
    paddingVertical: 5,
    fontSize: 15,
  },
  reserveButton: {
    width: 110,
    height: 30,
    padding: 5,
    borderWidth: 0.5,
    flexDirection: "row",
    borderRadius: 6,
    backgroundColor: "#5edf95",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
export default Message;
