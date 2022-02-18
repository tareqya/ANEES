import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
} from "react-native";
import { TextInput, FAB } from "react-native-paper";
import Entypo from "react-native-vector-icons/Entypo";
import { COLORS } from "../../assets/colors";

const { height } = Dimensions.get("screen");
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstNameError: false,
      lastNameError: false,
      phoneError: false,
      firstName: "",
      lastName: "",
      phone: "",
    };

    this.translateYAnimation = new Animated.Value(1000);
    this.nameTranslateXAnimation = new Animated.Value(1000);
    this.phoneTranslateXAnimation = new Animated.Value(1000);
    this.translateYLogoAnimation = new Animated.Value(height / 3);
    this.logoScaleAnimation = new Animated.Value(2);
    this.clickAnimationRef = new Animated.Value(1);
  }

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    const logoAnimation = Animated.timing(this.translateYLogoAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    });
    const scaleLogoAnimation = Animated.timing(this.logoScaleAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    const firstAnimation = Animated.timing(this.translateYAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    });

    const secondAnimation = Animated.timing(this.nameTranslateXAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    });

    const theridAnimation = Animated.timing(this.phoneTranslateXAnimation, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    });

    Animated.sequence([
      Animated.parallel([firstAnimation, logoAnimation, scaleLogoAnimation]),
      Animated.parallel([secondAnimation, theridAnimation]),
    ]).start();
  };

  clickAnimation = () => {
    Animated.sequence([
      Animated.timing(this.clickAnimationRef, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.clickAnimationRef, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  isDataCorrect = () => {
    const { phone, lastName, firstName } = this.state;
    var firstNameErrorStatus = false;
    var lastNameErrorStatus = false;
    var phoneErrorStatus = false;
    if (firstName.trim() == "") {
      firstNameErrorStatus = true;
    }
    if (lastName.trim() == "") {
      lastNameErrorStatus = true;
    }
    if (
      phone.trim() == "" ||
      phone.trim().length < 10 ||
      !phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ) {
      phoneErrorStatus = true;
    }

    this.setState({
      firstNameError: firstNameErrorStatus,
      lastNameError: lastNameErrorStatus,
      phoneError: phoneErrorStatus,
    });
  };

  handleNextPress = () => {
    this.clickAnimation();
    if (!this.isDataCorrect()) {
      return;
    }
  };

  render() {
    const {
      firstNameError,
      lastNameError,
      phoneError,
      firstName,
      lastName,
      phone,
    } = this.state;

    return (
      <View style={styles.continer}>
        <Animated.View
          style={[
            styles.header,
            { transform: [{ translateY: this.translateYLogoAnimation }] },
          ]}
        >
          <Animated.Image
            source={require("../../assets/logo.png")}
            style={[
              styles.logo,
              { transform: [{ scale: this.logoScaleAnimation }] },
            ]}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.body,
            { transform: [{ translateY: this.translateYAnimation }] },
          ]}
        >
          <Animated.View
            style={{
              transform: [{ translateX: this.nameTranslateXAnimation }],
            }}
          >
            <KeyboardAvoidingView style={styles.nameWrapper}>
              <TextInput
                label="שם פרטי"
                style={styles.name}
                mode="outlined"
                error={firstNameError}
                activeOutlineColor={COLORS.primary}
                value={firstName}
                autoCorrect={false}
                autoComplete={false}
                onChangeText={(text) => this.setState({ firstName: text })}
              />
              <TextInput
                label="שם משפחה"
                style={styles.name}
                mode="outlined"
                error={lastNameError}
                activeOutlineColor={COLORS.primary}
                value={lastName}
                autoCorrect={false}
                autoComplete={false}
                onChangeText={(text) => this.setState({ lastName: text })}
              />
            </KeyboardAvoidingView>
          </Animated.View>
          <Animated.View
            style={{
              transform: [{ translateX: this.phoneTranslateXAnimation }],
            }}
          >
            <KeyboardAvoidingView>
              <TextInput
                label="מספר טלפון"
                mode="outlined"
                error={phoneError}
                placeholder="05XXXXXXXX"
                style={styles.phone}
                autoCorrect={false}
                autoComplete={false}
                keyboardType="phone-pad"
                activeOutlineColor={COLORS.primary}
                value={phone}
                onChangeText={(text) => this.setState({ phone: text })}
              />
            </KeyboardAvoidingView>
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={[
            styles.nextBtn,
            {
              transform: [
                { scale: this.clickAnimationRef },
                { translateX: this.phoneTranslateXAnimation },
              ],
            },
          ]}
        >
          <Entypo
            name="arrow-bold-right"
            color={COLORS.white}
            style={{ alignSelf: "center" }}
            size={30}
            onPress={this.handleNextPress}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 3,
    backgroundColor: COLORS.white,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  nameWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
    alignItems: "center",
  },
  name: {
    width: "45%",
    borderColor: "red",
  },
  phone: {
    marginHorizontal: 20,
  },
  logo: {
    height: 100,
    aspectRatio: 1,
  },
  nextBtn: {
    height: 50,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    position: "absolute",
    bottom: height / 6,
    alignSelf: "center",
    backgroundColor: COLORS.secondary,
  },
});
export default Login;
