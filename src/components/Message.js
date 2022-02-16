import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "../../assets/colors";

export const DangerAlertType = "danger";
export const WarningAlertType = "warning";
export const SuccessAlertType = "success";

const Message = ({ msg, alertType }) => {
  var backgroundColor = COLORS.white;
  if (alertType == DangerAlertType) {
    backgroundColor = COLORS.danger;
  } else if (alertType == WarningAlertType) {
    backgroundColor = COLORS.warning;
  } else if (alertType == SuccessAlertType) {
    backgroundColor = COLORS.success;
  }
  return (
    <View style={[styles.continer, { backgroundColor }]}>
      <Text style={styles.msg}>{msg}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  continer: {
    marginTop: 5,
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  msg: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.text,
  },
});
export default Message;
