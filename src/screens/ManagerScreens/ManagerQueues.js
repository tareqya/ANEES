import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

class ManagerQueues extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> ManagerQueues </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ManagerQueues;
