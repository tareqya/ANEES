import { isRTL } from "expo-localization";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { TextInput, HelperText, Button } from "react-native-paper";
import { COLORS } from "../../../assets/colors";
import Header from "../../components/Header";
import Message from "../../components/Message";
import Verify from "../../components/Verify";
import Database from "../../Classes/Database";
import User from "../../Classes/User";

class AddNewCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastName: "",
      firstName: "",
      lastNameError: false,
      firstNameError: false,
      phone: "",
      phoneError: false,
      loading: false,
      error: "",
      success: false,
    };

    this.initAnimation = new Animated.Value(0);
    this.db = new Database();
  }

  componentDidMount() {
    Animated.timing(this.initAnimation, {
      toValue: 1,
      easing: Easing.bounce,
      useNativeDriver: true,
      duration: 1000,
    }).start();
  }
  handleGetCustomerComplate = (user) => {
    if (user == null) {
      const { phone, lastName, firstName } = this.state;
      const phoneNumber = `+972${phone.replace("+972", "0").slice(1)}`.replace(
        "-",
        ""
      );
      const customer = new User("", firstName, lastName, phoneNumber);

      this.db.addNewCustomer(customer.toDict(), (status) => {
        this.setState({ loading: false });
        if (!status) {
          this.setState({ error: "הוספה נכשלה" });
        } else {
          this.setState({ success: true });
        }
      });
    } else {
      this.setState({ error: "המספר הזה כבר קיים", loading: false });
    }
  };

  handleAddCustomer = () => {
    this.setState({
      loading: true,
      lastNameError: false,
      firstNameError: false,
      phoneError: false,
      success: false,
    });
    const { lastName, firstName, phone } = this.state;
    if (firstName.trim() == "") {
      this.setState({ firstNameError: true, loading: false });
      return;
    }
    if (lastName.trim() == "") {
      this.setState({ lastNameError: true, loading: false });
      return;
    }
    if (
      phone.trim() == "" ||
      phone.trim().length < 10 ||
      !phone.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ) {
      this.setState({ phoneError: true, loading: false });
      return;
    }
    const phoneNumber = `+972${phone.replace("+972", "0").slice(1)}`.replace(
      "-",
      ""
    );
    this.db.getCustomerByPhone(phoneNumber, this.handleGetCustomerComplate);
  };

  render() {
    const {
      lastName,
      firstName,
      lastNameError,
      firstNameError,
      phoneError,
      phone,
      loading,
      error,
      success,
    } = this.state;
    return (
      <View style={styles.continer}>
        <Header goBack={() => this.props.navigation.goBack()} />

        <Animated.View
          style={[
            styles.inputWrapper,
            { transform: [{ scale: this.initAnimation }] },
          ]}
        >
          <View style={styles.titleWrapper}>
            <Text style={styles.title}> הוספת לקוח חדש </Text>
          </View>
          <KeyboardAvoidingView style={styles.inputTextWrapper}>
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
          </KeyboardAvoidingView>
          <KeyboardAvoidingView style={styles.inputTextWrapper}>
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
          <KeyboardAvoidingView style={styles.inputTextWrapper}>
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

          <Button
            mode="contained"
            onPress={() => this.handleAddCustomer()}
            style={[styles.addCustomerBtn]}
            labelStyle={styles.addCustomerBtnLabel}
            loading={loading}
            disabled={loading}
          >
            הוספה
          </Button>
        </Animated.View>
        {error != "" ? (
          <Message alertType={"danger"} textColor={COLORS.white} msg={error} />
        ) : null}
        {success ? (
          <Verify callBack={() => this.props.navigation.goBack()} />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inputWrapper: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  titleWrapper: {
    alignItems: isRTL ? "flex-start" : "flex-end",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  addCustomerBtn: {
    backgroundColor: COLORS.secondary,
    marginTop: 20,
    height: 50,
    justifyContent: "center",
    marginHorizontal: 50,
  },
  addCustomerBtnLabel: {
    fontSize: 20,
  },
  inputTextWrapper: {
    marginTop: 10,
  },
});
export default AddNewCustomer;
