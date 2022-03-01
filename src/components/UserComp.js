import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS } from "../../assets/colors";
import { PROFILE_IMAGE } from "../../assets/images";

const UserComp = ({ user, continerStyle = {} }) => {
  return (
    <View style={[styles.continer, continerStyle]}>
      <View style={styles.imageWrapper}>
        <Image source={PROFILE_IMAGE} style={styles.image} />
      </View>
      <View style={styles.infoWrapper}>
        <Text style={styles.name}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.phone}> {user.phone.replace("+972", "0")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
  },
  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.text,
  },
  phone: {
    fontSize: 16,
    color: COLORS.lightText,
  },
});
export default UserComp;
