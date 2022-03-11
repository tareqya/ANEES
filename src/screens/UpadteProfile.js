import { isRTL } from "expo-localization";
import React, { Component } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { COLORS } from "../../assets/colors";

import Database from "../Classes/Database";
import Header from "../components/Header";

class UpadteProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      lastNameError: false,
      firstNameError: false,
    };
    this.db = new Database();
    this.uid = this.db.getCurrentUser().uid;
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

  checkInputs = () => {
    const { first_name, last_name } = this.state;
    if (first_name.trim() == "") {
      this.setState({ firstNameError: true });
      return false;
    }
    if (last_name.trim() == "") {
      this.setState({ lastNameError: true });
      return false;
    }
    return true;
  };

  handleUpdateUserInfo = async () => {
    const { first_name, last_name } = this.state;

    this.setState({ firstNameError: false, lastNameError: false });

    if (!this.checkInputs()) {
      return;
    }

    const userInfo = { first_name, last_name, uid: this.uid };
    const rc = await this.db.updateUserInfo(userInfo);
    if (!rc) {
      alert("עדכון המידע נכשל אנא בדוק את חיבורי האינטרנט שלך");
    } else this.props.navigation.goBack();
  };

  render() {
    const { first_name, last_name, lastNameError, firstNameError } = this.state;

    return (
      <View style={styles.continar}>
        <Header navigation={this.props.navigation} />
        <Text style={styles.title}> עדכון פרטים </Text>
        <KeyboardAvoidingView style={styles.inputsWrapper}>
          <TextInput
            label="שם פרטי"
            style={styles.input}
            mode="outlined"
            error={firstNameError}
            activeOutlineColor={COLORS.primary}
            value={first_name}
            autoCorrect={false}
            autoComplete={false}
            onChangeText={(text) => this.setState({ first_name: text })}
          />
          <TextInput
            label="שם משפחה"
            style={styles.input}
            mode="outlined"
            error={lastNameError}
            activeOutlineColor={COLORS.primary}
            value={last_name}
            autoCorrect={false}
            autoComplete={false}
            onChangeText={(text) => this.setState({ last_name: text })}
          />
        </KeyboardAvoidingView>

        <Button
          labelStyle={{
            textAlign: "center",
            fontSize: 20,
            color: COLORS.white,
            fontWeight: "bold",
          }}
          style={{ backgroundColor: COLORS.secondary, margin: 20 }}
          onPress={this.handleUpdateUserInfo}
        >
          עדכון
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continar: {
    flex: 1,
  },
  title: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
    alignSelf: isRTL ? "flex-start" : "flex-end",
  },
  inputsWrapper: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  input: {
    marginTop: 10,
  },
});
export default UpadteProfile;
