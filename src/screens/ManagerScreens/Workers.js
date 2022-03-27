import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Database from "../../Classes/Database";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

import { PROFILE_IMAGE } from "../../../assets/images";
import { isRTL } from "expo-localization";
import { COLORS } from "../../../assets/colors";

class Workers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barbers: [],
    };
    this.db = new Database();
  }

  componentDidMount() {
    this.db.getBarbers((barbers) => this.setState({ barbers }));
  }

  render() {
    const { barbers } = this.state;
    if (barbers == null) {
      alert("אנא בדוק את חיבור האינטרנט שלך");
      this.props.navigation.goBack();
    }
    if (barbers.length == 0) {
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Loading />
      </View>;
    }
    return (
      <View style={styles.container}>
        <Header goBack={() => this.props.navigation.goBack()} />

        <FlatList
          contentContainerStyle={{
            marginHorizontal: 20,
            justifyContent: "center",
            marginTop: 20,
          }}
          data={barbers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("HomeScreen", { uid: item.uid })
              }
            >
              <View style={styles.workerWrapper}>
                <Image source={PROFILE_IMAGE} style={styles.workerImage} />
                <View style={styles.infoWrapper}>
                  <Text style={styles.workerName}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text style={styles.workerPhone}>
                    {item.phone.replace("+972", "0")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  workerWrapper: {
    flexDirection: isRTL ? "row" : "row-reverse",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  infoWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  workerImage: {
    width: 100,
    height: 100,
  },
  workerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  workerPhone: {
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.lightText,
    marginTop: 10,
  },
});
export default Workers;
