import React, { Component, createRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import * as Notifications from "expo-notifications";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { FAB } from "react-native-paper";
import { isRTL } from "expo-localization";

import { COLORS } from "../../assets/colors";
import {
  PROFILE_IMAGE,
  SALON_BK_IMAGE,
  SCISSOR_IMAGE,
  RAZOR_IMAGE,
  GALLERY_PRIMARY_IMAGE,
  GALLERY_SECONDARY1_IMAGE,
  GALLERY_SECONDARY2_IMAGE,
} from "../../assets/images";
import { SHAVING, HAIRCUT, location } from "../utils/constens";
import Database from "../Classes/Database";
import Divider from "../components/Divider";
import Service from "../components/Service";
import Loading from "../components/Loading";
import { getNotificationToken } from "../utils/notifactions";

const { width, height } = Dimensions.get("screen");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
    this.notificationListener = createRef();
    this.responseListener = createRef();
    this.db = new Database();
  }

  componentDidMount() {
    const uid = this.db.getCurrentUser().uid;
    this.db.getUserInfo(uid, async (user) => {
      const token = await getNotificationToken();
      user.token = token;
      this.db.updateUserInfo(user.toDict());
      this.setState({ user });
    });

    this.notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {});

    this.responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});
  }

  componentWillUnmount() {
    this.notificationListener.current &&
      Notifications.removeNotificationSubscription(
        this.notificationListener.current
      );
    this.responseListener.current &&
      Notifications.removeNotificationSubscription(
        this.responseListener.current
      );
  }

  render() {
    const { user } = this.state;
    if (user == null) {
      return (
        <View style={styles.loadingWrapper}>
          <Loading />
        </View>
      );
    }
    return (
      <View style={styles.continer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={PROFILE_IMAGE}
                style={styles.profileImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.name}>???????? {user.first_name},</Text>
              <Text style={styles.welcome}>
                ???????? ?????????? ???? ?????????? ?????? ??????????????????
              </Text>
            </View>
          </View>
          {/* <View style={styles.newsWrapper}>
            <FAB
              style={styles.news}
              small
              icon={() => <Entypo name="news" color={COLORS.white} size={20} />}
              label="??????????????"
              color={COLORS.white}
              onPress={() => this.props.navigation.navigate("PostsScreen")}
            />
          </View> */}
          <View style={styles.body}>
            <View style={styles.salonImageWrapper}>
              <Image
                style={styles.salonImage}
                source={SALON_BK_IMAGE}
                resizeMode="stretch"
              />
            </View>

            <View style={styles.detailsWrapper}>
              <View style={styles.locationWrapper}>
                <Text style={styles.locationText}>{location}</Text>
                <EvilIcons size={30} color={COLORS.lightText} name="location" />
              </View>
              <View style={styles.locationWrapper}>
                <Text style={styles.locationText}>09:00 PM - 9:00 AM</Text>
                <EvilIcons size={30} color={COLORS.lightText} name="clock" />
              </View>
            </View>

            <Divider />
            <View>
              <Text style={styles.servicesTitle}>???????????????? ????????</Text>
              <View style={styles.servicesWrapper}>
                <Service serviceName={SHAVING} imageUrl={RAZOR_IMAGE} />
                <Service serviceName={HAIRCUT} imageUrl={SCISSOR_IMAGE} />
              </View>
            </View>

            <View style={styles.galleryWrapper}>
              <Text style={styles.galleryTitle}>????????????</Text>
              <View style={styles.galleryPhotosWrapper}>
                <View style={styles.galleryBigPhotoWrapper}>
                  <Image
                    source={GALLERY_PRIMARY_IMAGE}
                    style={styles.galleryPrimaryImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.gallerySmallPhotosWrapper}>
                  <View style={styles.gallerySecondaryImageWrapper}>
                    <Image
                      source={GALLERY_SECONDARY1_IMAGE}
                      style={styles.gallerySecondaryImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.gallerySecondaryImageWrapper}>
                    <Image
                      source={GALLERY_SECONDARY2_IMAGE}
                      style={styles.gallerySecondaryImage}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  header: {
    flexDirection: isRTL ? "row" : "row-reverse",
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  profileImage: {
    height: 50,
    aspectRatio: 1,
  },
  profileImageWrapper: {
    marginHorizontal: 5,
  },
  name: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: isRTL ? "left" : "right",
  },
  welcome: {
    color: COLORS.lightText,
    fontSize: 16,
    textAlign: isRTL ? "left" : "right",
  },
  salonImageWrapper: {
    alignSelf: "center",
    marginTop: 20,
    width: width * 0.9,
    height: 200,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  salonImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  detailsWrapper: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },

  locationWrapper: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 5,
  },
  locationText: {
    color: COLORS.lightText,
    fontSize: 16,
  },
  servicesWrapper: {
    padding: 10,
    flexDirection: "row",
    justifyContent: isRTL ? "flex-start" : "flex-end",
  },
  servicesTitle: {
    fontSize: 24,
    textAlign: isRTL ? "left" : "right",
    margin: 10,
    color: COLORS.text,
  },
  galleryWrapper: {
    margin: 10,
  },
  galleryTitle: {
    fontSize: 24,
    textAlign: isRTL ? "left" : "right",
    color: COLORS.text,
  },
  galleryPhotosWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  galleryBigPhotoWrapper: {
    height: width * 0.9,
    width: width / 2,
  },
  galleryPrimaryImage: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  gallerySecondaryImageWrapper: {
    height: width * 0.4,
    width: width / 2.5,
    borderRadius: 10,
    overflow: "hidden",
  },
  gallerySmallPhotosWrapper: {
    justifyContent: "space-between",
  },
  gallerySecondaryImage: {
    height: "100%",
    width: "100%",
  },
  newsWrapper: {
    width: 100,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  news: {
    backgroundColor: COLORS.secondary,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
  },
});
export default HomeScreen;
