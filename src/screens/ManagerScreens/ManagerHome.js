import { isRTL } from "expo-localization";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import PincodeInput from "react-native-pincode-input";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { COLORS } from "../../../assets/colors";
import Database from "../../Classes/Database";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

const OPTIONS = [
  {
    id: "1",
    title: "שינוי סיסמה",
    name: "ResetPassword",
  },
  {
    id: "2",
    title: "נהסול תורים",
    name: "Workers",
  },
  {
    id: "3",
    title: "הוספת משתמש חדש",
    name: "AddNewCustomer",
  },
  {
    id: "4",
    title: "הוסיף פוסט חדש",
    name: "AddNewPost",
  },
];
class ManagerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      correctCode: null,
      accessSuccess: false,
      errorMsg: null,
    };

    this.db = new Database();
  }

  componentDidMount() {
    this.props.navigation
      .getParent()
      .getParent()
      .setOptions({
        headerShown: false,
        tabBarStyle: { display: "none" },
      });
    this.db.getManagerCode((code) => this.setState({ correctCode: code }));
  }

  componentWillUnmount() {
    this.props.navigation
      .getParent()
      .getParent()
      .setOptions({
        headerShown: true,
        tabBarStyle: { display: "flex" },
      });
  }

  handleOnCodeChange = (code) => {
    if (code.length == 6) {
      if (code == this.state.correctCode) {
        this.setState({ accessSuccess: true, errMsg: null });
      } else {
        this.setState({
          accessSuccess: false,
          errorMsg: "סיסמה לא נכונה!",
        });
      }
    }

    this.setState({ code });
  };
  handleOptionClicked = (option) => {
    switch (option.name) {
      case "ResetPassword":
        this.props.navigation.navigate("ResetPassword");
        break;
      case "AddNewCustomer":
        this.props.navigation.navigate("AddNewCustomer");
        break;
      case "Workers":
        this.props.navigation.navigate("Workers");
        break;
      case "AddNewPost":
        this.props.navigation.navigate("AddNewPost");
        break;
      default:
        break;
    }
  };

  render() {
    const { code, correctCode, accessSuccess, errorMsg } = this.state;
    if (!correctCode) {
      return (
        <View>
          <Loading />
        </View>
      );
    }
    return (
      <View style={styles.continar}>
        <Header goBack={() => this.props.navigation.goBack()} />
        {!accessSuccess && (
          <View style={[styles.wrapper, { alignItems: "center" }]}>
            <Text style={styles.title}>נא להזין את סיסמת המנהל</Text>
            <PincodeInput
              length={6}
              containerStyle={{
                display: "flex",
                width: "100%",
                height: 200,
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
            {errorMsg && <Text style={styles.errMsg}>{errorMsg}</Text>}
          </View>
        )}

        {accessSuccess && (
          <ScrollView style={styles.wrapper}>
            {OPTIONS.map((value, index) => (
              <TouchableOpacity
                key={index.toString()}
                style={{ marginBottom: 20 }}
                onPress={() => this.handleOptionClicked(value)}
              >
                <View style={styles.option}>
                  <View style={{ flexDirection: "row" }}>
                    <MaterialIcons
                      color={COLORS.primary}
                      size={20}
                      name={"settings"}
                      style={styles.settingsIcon}
                    />
                    <Text style={styles.optionTitle}>{value.title}</Text>
                  </View>
                  <MaterialIcons
                    color={COLORS.primary}
                    size={20}
                    name={isRTL ? "arrow-back-ios" : "arrow-forward-ios"}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continar: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.primary,
  },
  errMsg: {
    color: COLORS.danger,
    fontSize: 18,
    alignSelf: "center",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.text,
  },
  settingsIcon: {
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ManagerHome;
