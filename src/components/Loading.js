import React from "react";
import LottieView from "lottie-react-native";

export default class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <LottieView
        style={{
          width: "100%",
        }}
        source={require("../../assets/files/loading.json")}
        autoPlay
        loop
      />
    );
  }
}
