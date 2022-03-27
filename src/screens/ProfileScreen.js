import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Database from "../Classes/Database";
import { COLORS } from "../../assets/colors";
import { PROFILE_IMAGE } from "../../assets/images";
import Loading from "../components/Loading";
import { isRTL } from "expo-localization";

const OPTIONS = [
  {
    name: "profile",
    title: "פּרוֹפִיל",
    isAdminOption: false,
    icon: <Ionicons name="person-outline" color={COLORS.primary} size={20} />,
    leftIcon: (
      <MaterialIcons
        color={COLORS.primary}
        size={20}
        name={isRTL ? "arrow-back-ios" : "arrow-forward-ios"}
      />
    ),
  },
  // {
  //   name: "settings",
  //   title: "הגדרות",
  //   isAdminOption: false,
  //   icon: <Feather name="settings" color={COLORS.primary} size={20} />,
  //   leftIcon: (
  //     <MaterialIcons
  //       color={COLORS.primary}
  //       size={20}
  //       name={isRTL ? "arrow-back-ios" : "arrow-forward-ios"}
  //     />
  //   ),
  // },
  // {
  //   name: "sound",
  //   title: "מוזיקה",
  //   isAdminOption: false,
  //   icon: <Feather name="music" color={COLORS.primary} size={20} />,
  //   leftIcon: null,
  // },
  {
    name: "manager",
    title: "מנהל",
    isAdminOption: true,
    icon: <EvilIcons name="calendar" color={COLORS.primary} size={20} />,
    leftIcon: (
      <MaterialIcons
        color={COLORS.primary}
        size={20}
        name={isRTL ? "arrow-back-ios" : "arrow-forward-ios"}
      />
    ),
  },
  {
    name: "logout",
    title: "להתנתק",
    isAdminOption: false,
    icon: <AntDesign name="logout" color={COLORS.danger} size={20} />,
    leftIcon: null,
  },
];

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      musicStatus: true,
    };
    this.db = new Database();
  }

  componentDidMount() {
    const uid = this.db.getCurrentUser().uid;
    this.db.onUserInfoChange(uid, this.onUserInfoFetchComplate);
  }

  onUserInfoFetchComplate = (user) => {
    this.setState({ user });
  };

  onOptionPress = (option) => {
    switch (option.name) {
      case "profile":
        this.props.navigation.navigate("UpdateProfile");
        break;
      case "manager":
        this.props.navigation.navigate("ManagerStack");
        break;
      case "settings":
        console.log("settings");

        break;
      case "logout":
        this.db.logout();
        break;
    }
  };

  handleMusicSwitch = async (value) => {
    this.setState({ musicStatus: value });
    AsyncStorage.setItem("music", value);
  };

  render() {
    const { user, musicStatus } = this.state;

    if (user == null) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading />
        </View>
      );
    }
    return (
      <View style={styles.continer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.profileDataWrapper}>
              <Image source={PROFILE_IMAGE} style={styles.profileImage} />
              <View style={styles.detailsWrapper}>
                <Text style={styles.name}>
                  {user.first_name} {user.last_name}
                </Text>
                <Text style={styles.phone}>
                  {user.phone.replace("+972", "0")}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.body}>
            {OPTIONS.map((value, index) => (
              <View key={index.toString()}>
                {value.isAdminOption == true && user.isAdmin == false ? null : (
                  <TouchableOpacity
                    onPress={() => this.onOptionPress(value)}
                    style={styles.optionWrapper}
                  >
                    <View style={styles.optionLeftSide}>
                      {value.icon}
                      <Text style={styles.optionTitle}>{value.title}</Text>
                    </View>
                    {value.leftIcon}
                    {OPTIONS[index].name == "sound" ? (
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={musicStatus ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.handleMusicSwitch}
                        value={musicStatus}
                      />
                    ) : null}
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 150,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
  },
  body: {
    marginTop: 100,
  },
  profileDataWrapper: {
    alignItems: "center",
    marginTop: 150,
  },
  profileImage: {
    height: 100,
    aspectRatio: 1,
  },
  detailsWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  phone: {
    marginTop: 5,
    color: COLORS.lightText,
  },
  optionWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 50,
  },
  optionLeftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionTitle: {
    fontWeight: "bold",
    marginStart: 10,
  },
});
export default ProfileScreen;
