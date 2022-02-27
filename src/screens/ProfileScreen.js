import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Database from "../Classes/Database";

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.db = new Database();
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.db.logout()}>
          <Text> Logout </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ProfileScreen;
