import { isRTL } from "expo-localization";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import PincodeInput from "react-native-pincode-input";
import Database from "../../Classes/Database";
import { COLORS } from "../../../assets/colors";
import Header from "../../components/Header";
import Verify from "../../components/Verify";
import { RESET_PASSWORD } from "../../../assets/images";

const { width, height } = Dimensions.get("window");

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      success: false,
    };
    this.db = new Database();
  }
  handleOnCodeChange = async (code) => {
    this.setState({ code });
    if (code.length == 6) {
      const res = await this.db.updateManagerPassword(code);
      if (!res) {
        alert("עדכון סיסמה נכשל!");
        this.setState({ success: false });
      } else {
        this.setState({ success: true });
      }
    }
  };

  render() {
    const { code, success } = this.state;
    return (
      <View style={styles.contianer}>
        <Header goBack={() => this.props.navigation.goBack()} />

        <ScrollView>
          <Image source={RESET_PASSWORD} style={styles.image} />
          <Text style={styles.title}> שינוי סיסמה </Text>

          <PincodeInput
            length={6}
            containerStyle={{
              display: "flex",
              width: "100%",
              height: 100,
              justifyContent: "center",
            }}
            circleContainerStyle={{
              paddingHorizontal: 32,
            }}
            circleEmptyStyle={{
              borderWidth: 1,
              borderColor: "#424242",
            }}
            circleFilledStyle={{
              backgroundColor: "#424242",
            }}
            pin={code}
            onTextChange={this.handleOnCodeChange}
          />
        </ScrollView>
        {success && <Verify callBack={() => this.props.navigation.goBack()} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
  },
  title: {
    textAlign: isRTL ? "left" : "right",
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  image: {
    height: 0.6 * width,
    aspectRatio: 1,
    alignSelf: "center",
  },
  verifyWrapper: {},
});
export default ResetPassword;
