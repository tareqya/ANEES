import React from "react";
import { Animated, Easing, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("screen");
export default class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => this.props.callBack());
  }

  render() {
    return (
      <LottieView
        style={{
          zIndex: 99,
          width: 200,
          position: "absolute",
          alignSelf: "center",
          bottom: width / 5,
        }}
        source={require("../../assets/files/check.json")}
        progress={this.state.progress}
      />
    );
  }
}
