import { isRTL } from "expo-localization";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Linking,
  Platform,
  Alert,
} from "react-native";

import { COLORS } from "../../../assets/colors";
import Database from "../../Classes/Database";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import WaitingQueueComp from "../../components/WaitingQueueComp";
import { APPROVE_STATUS, REJECT_STATUS } from "../../utils/constens";
import { BOOKING_IMAGE } from "../../../assets/images";
import { changeDateFormat } from "../../utils/utilsFunctions";
import { sendNotification } from "../../utils/notifactions";

const { width, height } = Dimensions.get("screen");

class QueuesListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingQueues: [],
      loading: true,
    };
    this.db = new Database();
    this.barber_id = this.db.getCurrentUser().uid;
  }

  componentDidMount() {
    this.db.getBarberWaitingQueues(this.barber_id, this.handleGetWaitingQueues);
  }

  handleGetWaitingQueues = (queues) => {
    if (queues == null) {
      console.log("error!");
      return;
    }
    this.setState({ waitingQueues: queues, loading: false });
  };

  handleOnRejectQueuePress = (queue) => {
    Alert.alert("להסיר תור", "האם אתה בטוח שברצונך להסיר את התור", [
      {
        text: "לְבַטֵל",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "כן",
        onPress: () => {
          this.db.getUserInfo(queue.customer_id, (userInfo) => {
            if (userInfo.token != undefined && userInfo.token != "") {
              sendNotification(userInfo.token, "ANEES", "התור שלך נדחה");
            }
            this.db.updateQueueStatus(queue.key, REJECT_STATUS);
          });
        },
      },
    ]);
  };

  handleOnApproveQueuePress = (queue) => {
    this.db.getUserInfo(queue.customer_id, (userInfo) => {
      if (userInfo.token != undefined && userInfo.token != "") {
        sendNotification(userInfo.token, "ANEES", "התור שלך אושר");
      }
      this.db.updateQueueStatus(queue.key, APPROVE_STATUS);
    });
  };

  handleCallButtonPress = (customer_id) => {
    this.db.getUserInfo(customer_id, (userInfo) => {
      const url = Platform.select({
        android: `tel://${userInfo.phone}`,
        ios: `telprompt:${userInfo.phone}`,
      });
      Linking.openURL(url);
    });
  };

  render() {
    const { waitingQueues, loading } = this.state;

    if (loading) {
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
        <FlatList
          data={waitingQueues}
          ListHeaderComponent={
            <Text style={styles.header}> תורים בהמתנה </Text>
          }
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View style={styles.emptyListWrapper}>
              <Image
                source={BOOKING_IMAGE}
                style={styles.emptyListImage}
                resizeMode={"center"}
              />
              <Message
                msg="אין תורים בהמתנה"
                alertType={"warning"}
                textColor={COLORS.white}
              />
            </View>
          }
          renderItem={({ item, index }) => {
            return (
              <View style={styles.waitingQueueWrapper}>
                <WaitingQueueComp
                  service={item.queue.service}
                  name={
                    item.customer.first_name + " " + item.customer.last_name
                  }
                  onApproveBtnPress={() =>
                    this.handleOnApproveQueuePress(item.queue)
                  }
                  onRejectBtnPress={() =>
                    this.handleOnRejectQueuePress(item.queue)
                  }
                  onPhonePress={() =>
                    this.handleCallButtonPress(item.queue.customer_id)
                  }
                  date={changeDateFormat(item.queue.date)}
                  time={item.queue.start_time}
                />
              </View>
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
  },
  header: {
    fontSize: 24,
    color: COLORS.primary,
    textAlign: isRTL ? "left" : "right",
  },
  waitingQueueWrapper: {
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  emptyListWrapper: {
    //height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListImage: {
    height: height * 0.3,
  },
});

export default QueuesListScreen;
