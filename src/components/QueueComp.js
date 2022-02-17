import { isRTL } from "expo-localization";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../assets/colors";
import {
  REJECT_STATUS,
  APPROVE_STATUS,
  WAITING_STATUS,
} from "../utils/constens";

const QueueComp = ({
  location,
  service,
  status,
  onLocationPress = () => {},
  onPhonePress = () => {},
  date,
  time,
}) => {
  var color = COLORS.white;
  if (status == APPROVE_STATUS) {
    color = COLORS.success;
  } else if (status == WAITING_STATUS) {
    color = COLORS.warning;
  } else if (status == REJECT_STATUS) {
    color = COLORS.danger;
  }

  return (
    <View style={styles.continer}>
      <View style={styles.leftSide}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.title}>{service}</Text>
        <View style={styles.locationWrapper}>
          <EvilIcons size={20} color={COLORS.lightText} name="location" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <View style={styles.actionsWrapper}>
          <View
            style={[
              styles.statusWrapper,
              { backgroundColor: color, borderColor: color },
            ]}
          >
            <Text style={styles.statusText}>{status}</Text>
          </View>
          <TouchableOpacity
            style={styles.locationIconWrapper}
            onPress={onLocationPress}
          >
            <Ionicons
              size={20}
              color={COLORS.lightText}
              name="location-sharp"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.phoneWrapper} onPress={onPhonePress}>
            <Ionicons size={20} color={COLORS.white} name="call-outline" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  continer: {
    backgroundColor: COLORS.white,
    flexDirection: isRTL ? "row-reverse" : "row",
  },
  leftSide: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  rightSide: {
    flex: 2,
    backgroundColor: COLORS.white,
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: "600",
    alignSelf: "center",
  },
  date: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "bold",
  },
  time: {
    fontSize: 16,
    color: COLORS.white,
  },
  locationWrapper: {
    flexDirection: isRTL ? "row" : "row-reverse",
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    fontSize: 18,
    color: COLORS.lightText,
  },
  actionsWrapper: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 5,
  },
  statusWrapper: {
    borderRadius: 5,
    borderWidth: 1,
    padding: 5,
    borderColor: COLORS.lightText,
  },
  statusText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  locationIconWrapper: {
    borderColor: COLORS.lightText,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  phoneWrapper: {
    backgroundColor: COLORS.success,
    padding: 5,
    borderRadius: 20,
  },
});

export default QueueComp;
