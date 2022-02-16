import React from "react";
import { View, StyleSheet } from "react-native";

const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    width: "90%",
    alignSelf: "center",
    borderColor: "lightgray",
    borderRadius: 5,
    borderWidth: 1,
  },
});

export default Divider;
