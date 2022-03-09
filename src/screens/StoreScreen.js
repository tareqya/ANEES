import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COMMING_SOON } from "../../assets/images";
import { COLORS } from "../../assets/colors";

class StoreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.continer}>
        <Image source={COMMING_SOON} style={styles.image} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    alignSelf: "center",
    height: "50%",
    aspectRatio: 1,
  },
});

export default StoreScreen;
