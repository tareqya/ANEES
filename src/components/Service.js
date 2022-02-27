import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { COLORS } from "../../assets/colors";

const Service = ({
  imageUrl,
  serviceName,
  imageWrapperStyle = {},
  labelStyle = {},
  imageHeight = 30,
}) => {
  return (
    <View style={styles.continer}>
      <View style={[styles.serviceImageWrapper, imageWrapperStyle]}>
        <Image
          source={imageUrl}
          style={[styles.serviceImage, { height: imageHeight }]}
        />
      </View>
      <View style={styles.nameWrapper}>
        <Text style={[styles.serviceName, labelStyle]}>{serviceName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  continer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  serviceName: {
    fontSize: 18,
    color: COLORS.text,
  },
  serviceImageWrapper: {
    backgroundColor: COLORS.white,
    height: 50,
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceImage: {
    height: 30,
    aspectRatio: 1,
  },
  nameWrapper: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Service;
