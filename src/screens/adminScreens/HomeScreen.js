import React, { Component, createRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Linking,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import DatePicker from "../../components/DatePicker";
import Database from "../../Classes/Database";
import {
  MONTHS,
  OPEN_TIME,
  CLOSE_TIME,
  SHAVING,
  HAIRCUT,
} from "../../utils/constens";
import {
  convertStringHourToMin,
  convertMinsToHrsMins,
  convertDateToString,
} from "../../utils/utilsFunctions";
import { COLORS } from "../../../assets/colors";
import { isRTL } from "expo-localization";
import { getNotificationToken } from "../../utils/notifactions";

const EMPTY_QUEUE_SIZE = 70;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null,
      dayQueues: [],
      loading: false,
      refreshing: false,
    };
    this.notificationListener = createRef();
    this.responseListener = createRef();
    this.db = new Database();
    this.barberId =
      this.props.route.params?.uid || this.db.getCurrentUser().uid;
  }

  componentWillUnmount() {
    this.props.navigation.getParent().getParent()?.setOptions({
      headerShown: false,
    });
    this.notificationListener.current &&
      Notifications.removeNotificationSubscription(
        this.notificationListener.current
      );
    this.responseListener.current &&
      Notifications.removeNotificationSubscription(
        this.responseListener.current
      );
  }

  componentDidMount() {
    this.props.navigation.getParent().getParent()?.setOptions({
      headerShown: true,
    });
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

    this.setState({ dayQueues: this.initDayQueue() });
  }

  initDayQueue = () => {
    const dayQueues = [];
    const startTime = convertStringHourToMin(OPEN_TIME);
    const closeTime = convertStringHourToMin(CLOSE_TIME);
    for (let i = startTime; i <= closeTime; i += 15) {
      const queueItme = {
        startTime: convertMinsToHrsMins(i),
        taken: false,
        queue: null,
        customer: null,
      };

      dayQueues.push(queueItme);
    }

    return dayQueues;
  };

  handleApprovedQueues = (queues) => {
    const dayQueues = this.initDayQueue();

    if (queues != null) {
      for (let i = 0; i < queues.length; i++) {
        const { queue, customer } = queues[i];

        var j = 0;
        while (j < dayQueues.length - 1) {
          if (queue.start_time == dayQueues[j].startTime) {
            if (queue.service == SHAVING) {
              dayQueues[j].taken = true;
              dayQueues[j].queue = queue;
              dayQueues[j].customer = customer;
            } else {
              dayQueues[j].taken = true;
              dayQueues[j].queue = queue;
              dayQueues[j].customer = customer;
              j++;
              dayQueues[j].taken = true;
            }
          }
          j++;
        }
      }
    }

    this.setState({ loading: false, dayQueues, refreshing: false });
  };

  handleChooseDate = (date) => {
    this.setState({
      selectedDate: date,
      loading: true,
    });

    this.db.getBarberApprovedQueuesByDate(
      convertDateToString(date),
      this.barberId,
      this.handleApprovedQueues
    );
  };

  handleRefreshScrollView = () => {
    const { selectedDate } = this.state;
    this.setState({ refreshing: true });
    this.handleChooseDate(selectedDate);
  };

  handleCallButtonPress = (phoneNumber) => {
    const url = Platform.select({
      android: `tel://${phoneNumber}`,
      ios: `telprompt:${phoneNumber}`,
    });
    Linking.openURL(url);
  };

  handleRemoveQueeuPress = (queueKey) => {
    Alert.alert("להסיר תור", "האם אתה בטוח שברצונך להסיר את התור", [
      {
        text: "לְבַטֵל",
        onPress: () => {},
        style: "cancel",
      },
      { text: "כן", onPress: () => this.db.removeQueue(queueKey) },
    ]);
  };

  render() {
    const { dayQueues, loading, selectedDate, refreshing } = this.state;
    return (
      <View style={styles.continer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleRefreshScrollView}
            />
          }
        >
          <View style={styles.datePickerWrapper}>
            <DatePicker
              onDaySelect={(date) => this.handleChooseDate(date)}
              labels={["א", "ב", "ג", "ד", "ה", "ו", "ש"]}
              months={MONTHS}
              selectCurrentDate={true}
            />
          </View>

          <View>
            {loading ? (
              <View>
                <ActivityIndicator color={COLORS.primary} size="large" />
              </View>
            ) : null}

            <View style={styles.calenderWrapper}>
              {dayQueues.map((value, index) => (
                <View key={index.toString()}>
                  <View
                    style={[
                      styles.calenderItemWrapper,
                      {
                        marginBottom:
                          value.queue != null && value.queue.service == HAIRCUT
                            ? 0
                            : 2,
                      },
                    ]}
                  >
                    <Text style={styles.calenderTime}>{value.startTime}</Text>
                    {value.taken ? (
                      <View
                        style={[
                          styles.calenderQueueWrapper,
                          {
                            backgroundColor: COLORS.primary,

                            borderBottomEndRadius:
                              value.queue == null ||
                              (value.queue != null &&
                                value.queue.service == SHAVING)
                                ? 10
                                : 0,
                            borderBottomStartRadius:
                              value.queue == null ||
                              (value.queue != null &&
                                value.queue.service == SHAVING)
                                ? 10
                                : 0,
                            borderTopStartRadius:
                              (value.queue != null &&
                                value.queue.service == HAIRCUT) ||
                              (value.queue != null &&
                                value.queue.service == SHAVING)
                                ? 10
                                : 0,
                            borderTopEndRadius:
                              (value.queue != null &&
                                value.queue.service == HAIRCUT) ||
                              (value.queue != null &&
                                value.queue.service == SHAVING)
                                ? 10
                                : 0,
                          },
                        ]}
                      >
                        {value.customer != null ? (
                          <View>
                            <View style={styles.detailsQueueWrapper}>
                              <Text style={styles.name}>
                                {value.customer.first_name}{" "}
                                {value.customer.last_name}
                              </Text>
                              <Text style={styles.time}>
                                {value.queue.start_time} -{" "}
                                {value.queue.end_time}
                              </Text>
                              <Text style={styles.service}>
                                {value.queue.service}
                              </Text>
                            </View>
                            <View style={styles.actionsWrapper}>
                              <TouchableOpacity
                                style={styles.phoneWrapper}
                                onPress={() =>
                                  this.handleCallButtonPress(
                                    value.customer.phone
                                  )
                                }
                              >
                                <Ionicons
                                  size={20}
                                  color={COLORS.white}
                                  name="call-outline"
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.removeWrapper}
                                onPress={() =>
                                  this.handleRemoveQueeuPress(value.queue.key)
                                }
                              >
                                <AntDesign
                                  size={20}
                                  color={COLORS.white}
                                  name="delete"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    ) : (
                      <View style={styles.emptyQueue}>
                        <Text style={styles.emptyQueueText}>תור פנוי</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
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
  },
  datePickerWrapper: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  calenderWrapper: {
    backgroundColor: COLORS.white,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 10,
  },
  calenderItemWrapper: {
    flexDirection: "row",

    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  calenderTime: {
    color: COLORS.text,
    fontSize: 18,
    width: 50,
    marginHorizontal: 5,
  },
  calenderQueueWrapper: {
    flex: 1,
  },
  detailsQueueWrapper: {
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  name: {
    fontWeight: "700",
    color: COLORS.white,
    fontSize: 20,
    marginBottom: 5,
  },
  time: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 5,
  },
  emptyQueue: {
    borderRadius: 10,
    height: EMPTY_QUEUE_SIZE,
    flex: 1,
    backgroundColor: COLORS.lightText,
    opacity: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  service: {
    color: COLORS.white,
    fontSize: 16,
  },
  emptyQueueText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  phoneWrapper: {
    backgroundColor: COLORS.success,
    padding: 5,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginHorizontal: 5,
  },
  removeWrapper: {
    backgroundColor: COLORS.danger,
    padding: 5,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginHorizontal: 5,
  },
  actionsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
});
export default HomeScreen;
