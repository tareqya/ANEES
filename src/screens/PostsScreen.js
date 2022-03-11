import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../assets/colors";

import Database from "../Classes/Database";
import Header from "../components/Header";

class PostsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.navigation.getParent().setOptions({
      headerShown: false,
      tabBarStyle: { display: "none" },
    });
  }

  componentWillUnmount() {
    this.props.navigation.getParent().setOptions({
      headerShown: true,
      tabBarStyle: { display: "flex" },
    });
  }
  render() {
    return (
      <View>
        <Header navigation={this.props.navigation} />
        <Text> PostsScreen </Text>
      </View>
    );
  }
}

export default PostsScreen;
