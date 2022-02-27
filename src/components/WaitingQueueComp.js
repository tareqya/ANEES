import { isRTL } from "expo-localization";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../assets/colors";
import {
  REJECT_STATUS,
  APPROVE_STATUS,
  WAITING_STATUS,
} from "../utils/constens";

const WaitingQueueComp = ({
  name,
  service,
  onApproveBtnPress = () => {},
  onPhonePress = () => {},
  onRejectBtnPress = () => {},
  date,
  time,
}) => {
  var color = COLORS.warning;

  return (
    <View style={styles.continer}>
      <View style={styles.leftSide}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.locationWrapper}>
          <Text style={styles.locationText}>{service}</Text>
        </View>
        <View style={styles.actionsWrapper}>
          <View
            style={[
              styles.statusWrapper,
              { backgroundColor: color, borderColor: color },
            ]}
          >
            <Text style={styles.statusText}>{WAITING_STATUS}</Text>
          </View>
          <TouchableOpacity style={styles.phoneWrapper} onPress={onPhonePress}>
            <Ionicons size={20} color={COLORS.white} name="call-outline" />
          </TouchableOpacity>
        </View>
        <View style={styles.approveRejectWrapper}>
          <TouchableOpacity
            style={styles.phoneWrapper}
            onPress={onApproveBtnPress}
          >
            <AntDesign size={20} color={COLORS.white} name="check" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.phoneWrapper, { backgroundColor: COLORS.danger }]}
            onPress={onRejectBtnPress}
          >
            <AntDesign size={20} color={COLORS.white} name="close" />
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
  removeBtnWrapper: {
    width: 100,
    alignSelf: isRTL ? "flex-start" : "flex-end",
    marginTop: 20,
  },
  approveRejectWrapper: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

export default WaitingQueueComp;
