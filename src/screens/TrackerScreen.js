import { isRTL } from "expo-localization";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import QueueComp from "../components/QueueComp";
import Message from "../components/Message";
import Loading from "../components/Loading";
import { COLORS } from "../../assets/colors";
import { BOOKING_IMAGE, ERROR_IMAGE } from "../../assets/images";
import { location } from "../utils/constens";
import { changeDateFormat } from "../utils/utilsFunctions";

import Database from "../Classes/Database";

const ITEM_SIZE = 100;

const { width, height } = Dimensions.get("screen");

class TrackerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queues: [],
      refresh: false,
      isDataFetched: false,
    };
    this.uid = "1";
    this.db = new Database();
    this.fadeinAnimations = [];
  }

  componentDidMount() {
    this.db.getCustomerQueueByUid(this.uid, this.onFetchCustomerQueuesComplate);
  }

  startFadeInAnimation = (size) => {
    const animations = [];
    for (let i = 0; i < size; i++) {
      this.fadeinAnimations.push(new Animated.Value(1000));
    }
    for (let i = 0; i < size; i++) {
      animations[i] = Animated.timing(this.fadeinAnimations[i], {
        duration: 300 * (i + 1),
        toValue: 0,
        useNativeDriver: true,
      });
    }

    Animated.parallel(animations).start();
  };

  onFetchCustomerQueuesComplate = (queues) => {
    if (queues != null) {
      this.startFadeInAnimation(queues.length);
    }
    this.setState({ queues, refresh: false, isDataFetched: true });
  };

  handleRefreshQueuesList = () => {
    this.setState({ refresh: true, queues: [] });
    this.db.getCustomerQueueByUid(this.uid, this.onFetchCustomerQueuesComplate);
  };

  render() {
    const { queues, refresh, isDataFetched } = this.state;

    if (queues == null) {
      return (
        <View style={styles.wifiErrorWrapper}>
          <Image
            source={ERROR_IMAGE}
            style={styles.wifitErrorImage}
            resizeMode={"contain"}
          />
          <Message
            alertType={"danger"}
            textColor={COLORS.white}
            msg="אנא בדוק את חיבור האינטרנט שלך"
          />
        </View>
      );
    }
    if (!isDataFetched) {
      return (
        <View style={styles.loadingWrapper}>
          <Loading />
        </View>
      );
    }
    return (
      <View style={styles.continer}>
        <Animated.FlatList
          refreshing={refresh}
          onRefresh={() => this.handleRefreshQueuesList()}
          ListHeaderComponent={<Text style={styles.title}> התורים שלי </Text>}
          data={queues}
          keyExtractor={(item, index) => index.toString()}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyListWrapper}>
              <Image
                source={BOOKING_IMAGE}
                style={styles.emptyListImage}
                resizeMode={"center"}
              />
              <Message
                alertType={"warning"}
                msg={"לא נמצאו תורים עבורך"}
                textColor={COLORS.white}
              />
            </View>
          )}
          renderItem={({ item, index }) => {
            return (
              <Animated.View
                style={[
                  styles.QueueWrapper,
                  {
                    transform: [
                      {
                        translateX: this.fadeinAnimations[index],
                      },
                    ],
                  },
                ]}
              >
                <QueueComp
                  location={location}
                  service={item.service}
                  status={item.status}
                  date={changeDateFormat(item.date)}
                  time={item.start_time}
                />
              </Animated.View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
  },
  title: {
    fontSize: 24,
    color: COLORS.primary,
    margin: 10,
    alignSelf: isRTL ? "flex-start" : "flex-end",
  },
  QueueWrapper: {
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
    height: ITEM_SIZE,
  },
  emptyListWrapper: {
    //height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListImage: {
    height: height * 0.3,
  },
  wifitErrorImage: {
    height: height * 0.3,
  },
  wifiErrorWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default TrackerScreen;
