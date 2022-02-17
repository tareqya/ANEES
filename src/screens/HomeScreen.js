import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";

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

import Divider from "../components/Divider";
import Service from "../components/Service";

const { width, height } = Dimensions.get("screen");

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
              <Text style={styles.name}>שלום אחמד,</Text>
              <Text style={styles.welcome}>
                בואו נהפוך את השיער שלך לאטרקטיבי
              </Text>
            </View>
          </View>

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
                <Text style={styles.locationText}>21:00 PM - 9:00 AM</Text>
                <EvilIcons size={30} color={COLORS.lightText} name="clock" />
              </View>
            </View>

            <Divider />
            <View>
              <Text style={styles.servicesTitle}>השירותים שלנו</Text>
              <View style={styles.servicesWrapper}>
                <Service serviceName={SHAVING} imageUrl={RAZOR_IMAGE} />
                <Service serviceName={HAIRCUT} imageUrl={SCISSOR_IMAGE} />
              </View>
            </View>

            <View style={styles.galleryWrapper}>
              <Text style={styles.galleryTitle}>תמונות</Text>
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
    flexDirection: "row",
    justifyContent: isRTL ? "flex-start" : "flex-end",
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
});
export default HomeScreen;
