import { isRTL } from "expo-localization";
import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { COLORS } from "../../../assets/colors";
import Database from "../../Classes/Database";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import WaitingQueueComp from "../../components/WaitingQueueComp";
import { APPROVE_STATUS, REJECT_STATUS } from "../../utils/constens";
import { changeDateFormat } from "../../utils/utilsFunctions";

class QueuesListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingQueues: [],
      loading: true,
    };
    this.db = new Database();
    this.barber_id = "2";
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

  handleOnRejectQueuePress = (queueKey) => {
    this.db.updateQueueStatus(queueKey, REJECT_STATUS);
  };

  handleOnApproveQueuePress = (queueKey) => {
    this.db.updateQueueStatus(queueKey, APPROVE_STATUS);
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
            <Message
              msg="אין תורים בהמתנה"
              alertType={"warning"}
              textColor={COLORS.white}
            />
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
                    this.handleOnApproveQueuePress(item.queue.key)
                  }
                  onRejectBtnPress={() =>
                    this.handleOnRejectQueuePress(item.queue.key)
                  }
                  onPhonePress={() => {}}
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
});

export default QueuesListScreen;
