import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";

import { isRTL } from "expo-localization";

import DatePicker from "../components/DatePicker";
import Service from "../components/Service";
import TimePicker from "../components/TimePicker";
import Header from "../components/Header";
import Verify from "../components/Verify";

import { COLORS } from "../../assets/colors";
import {
  BARBER1,
  BARBER2,
  BARBER3,
  SCISSOR_IMAGE,
  RAZOR_IMAGE,
} from "../../assets/images";

import {
  convertDateToString,
  compareDate,
  convertStringToDate,
  getFreeHours,
  convertMinsToHrsMins,
  convertStringHourToMin,
} from "../utils/utilsFunctions";
import {
  SHAVING,
  HAIRCUT,
  REJECT_STATUS,
  APPROVE_STATUS,
  WAITING_STATUS,
} from "../utils/constens";

import Database from "../Classes/Database";
import Queue from "../Classes/Queue";
import Message from "../components/Message";

const OPEN_TIME = "9:00";
const CLOSE_TIME = "21:00";

const MONTHS = [
  "ינואר",
  "פברואר",
  "מרס",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

const BARBERS = [
  { id: "1", name: "Alex Carbali", image: BARBER1 },
  { id: "2", name: "Kimberly Tan", image: BARBER2 },
  { id: "3", name: "James Rodri", image: BARBER3 },
];

const SERVICES = [
  { id: "1", name: HAIRCUT, imageUrl: SCISSOR_IMAGE, time: 30 },
  { id: "2", name: SHAVING, imageUrl: RAZOR_IMAGE, time: 15 },
];

class AddNewQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableHours: [],
      selectedBarber: null,
      selectedDate: null,
      selectedService: {},
      selectedTime: null,
      calcFreeHours: false,
      noHoursAvailable: false,
      queueAddComplate: false,
      disable: false,
      error: "",
    };

    this.db = new Database();
    this.uid = "1";
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerShown: false,
      tabBarStyle: { display: "none" },
    });
  }

  componentWillUnmount() {
    this.props.navigation.setOptions({
      headerShown: true,
      tabBarStyle: { display: "flex" },
    });
  }

  fetchBarberQueuesComplate = (queues) => {
    if (queues == null) {
      this.setState({
        error: "אנא בדוק את חיבור האינטרנט שלך",
        calcFreeHours: false,
      });
      return;
    }
    const { selectedService } = this.state;
    const freeHours = getFreeHours(
      OPEN_TIME,
      CLOSE_TIME,
      selectedService.time,
      queues
    );

    this.setState({
      availableHours: freeHours,
      calcFreeHours: false,
      noHoursAvailable: freeHours.length == 0,
    });
  };

  handleAddQueue = () => {
    const { selectedBarber, selectedDate, selectedService, selectedTime } =
      this.state;

    const currentDate = new Date();
    const currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();
    if (
      compareDate(
        convertDateToString(selectedDate),
        selectedTime,
        convertDateToString(currentDate),
        currentTime
      ) <= 0
    ) {
      this.setState({ error: "לא ניתן לקבוע תור בתאריך ישן" });
      return;
    }

    const end_time = convertMinsToHrsMins(
      convertStringHourToMin(selectedTime) + selectedService.time
    );
    const queue = new Queue(
      this.uid,
      convertDateToString(selectedDate),
      selectedTime,
      end_time,
      selectedBarber.id,
      selectedService.name,
      WAITING_STATUS
    );

    this.db.addNewQueue(queue.toDict());
    this.setState({ queueAddComplate: true, disable: true });
  };

  handleChoosenBarber = (barber) => {
    const { selectedDate, selectedService } = this.state;

    if (selectedDate != null && selectedService.time != undefined) {
      this.setState({
        calcFreeHours: true,
        availableHours: [],
        noHoursAvailable: false,
        error: "",
      });
      this.db.getBarberQueuesByDate(
        convertDateToString(selectedDate),
        barber.id,
        this.fetchBarberQueuesComplate
      );
    }
    this.setState({ selectedBarber: barber });
  };

  handleChooseDate = (date) => {
    const { selectedBarber, selectedService } = this.state;
    if (selectedBarber != null && selectedService.time != undefined) {
      this.setState({
        calcFreeHours: true,
        availableHours: [],
        noHoursAvailable: false,
        error: "",
      });
      this.db.getBarberQueuesByDate(
        convertDateToString(date),
        selectedBarber.id,
        this.fetchBarberQueuesComplate
      );
    }

    this.setState({ selectedDate: date, selectedTime: null });
  };

  handleChooseService = (service) => {
    const { selectedBarber, selectedDate } = this.state;
    if (selectedBarber != null && selectedDate != null) {
      this.setState({
        calcFreeHours: true,
        availableHours: [],
        noHoursAvailable: false,
        error: "",
      });
      this.db.getBarberQueuesByDate(
        convertDateToString(selectedDate),
        selectedBarber.id,
        this.fetchBarberQueuesComplate
      );
    }
    this.setState({ selectedService: service });
  };

  isDisable = () => {
    const { selectedBarber, selectedDate, selectedService, selectedTime } =
      this.state;
    return (
      selectedBarber == null ||
      selectedDate == null ||
      selectedTime == null ||
      selectedService.name == undefined
    );
  };

  render() {
    const {
      selectedBarber,
      selectedDate,
      selectedService,
      selectedTime,
      availableHours,
      calcFreeHours,
      noHoursAvailable,
      queueAddComplate,
      disable,
      error,
    } = this.state;

    return (
      <View style={styles.continer}>
        <Header
          goBack={() => this.props.navigation.navigate("TrackerTabStack")}
        />
        {queueAddComplate ? (
          <Verify
            callBack={() => this.props.navigation.navigate("TrackerTabStack")}
          />
        ) : null}

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* choose barber */}
          <View style={styles.chooseBarberWrapper}>
            <Text style={styles.title}>בחר ספר</Text>
            <FlatList
              horizontal
              data={BARBERS}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={styles.barberListItemWrapper}
                    onPress={() => this.handleChoosenBarber(item)}
                  >
                    <Image
                      source={item.image}
                      resizeMode="stretch"
                      style={[
                        styles.barberImage,
                        {
                          borderWidth:
                            selectedBarber != null &&
                            selectedBarber.id == item.id
                              ? 2
                              : 0,
                          borderColor:
                            selectedBarber != null &&
                            selectedBarber.id == item.id
                              ? COLORS.secondary
                              : COLORS.white,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.barberText,
                        {
                          color:
                            selectedBarber != null &&
                            selectedBarber.id == item.id
                              ? COLORS.secondary
                              : COLORS.text,
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          <View>
            {/* choose date */}
            <Text style={styles.title}>בחר תאריך</Text>
            <View style={styles.datePickerWrapper}>
              <DatePicker
                onDaySelect={(date) => this.handleChooseDate(date)}
                labels={["א", "ב", "ג", "ד", "ה", "ו", "ש"]}
                months={MONTHS}
              />
            </View>
          </View>
          <View>
            {/* choose service */}
            <Text style={styles.title}>בחר שירות</Text>
            <View style={styles.servicesWrapper}>
              {SERVICES.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => this.handleChooseService(item)}
                >
                  <Service
                    imageUrl={item.imageUrl}
                    serviceName={item.name}
                    labelStyle={{
                      color:
                        item.name == selectedService.name
                          ? COLORS.secondary
                          : COLORS.text,
                    }}
                    imageWrapperStyle={{
                      borderWidth: item.name == selectedService.name ? 2 : 0,
                      borderColor:
                        item.name == selectedService.name
                          ? COLORS.secondary
                          : COLORS.white,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {noHoursAvailable ? (
            <Message msg="לא נמצא תור פנוי" alertType={"warning"} />
          ) : null}
          {calcFreeHours ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : null}

          {availableHours.length > 0 ? (
            <View>
              {/* choose time */}
              <Text style={styles.title}>בחר שעה</Text>
              <View style={styles.timePickerWrapper}>
                <TimePicker
                  hours={availableHours}
                  selectedTime={selectedTime}
                  onTimeSelect={(time) =>
                    this.setState({ selectedTime: time, error: "" })
                  }
                />
              </View>
            </View>
          ) : null}

          <View style={styles.addQueueBtnWrapper}>
            {/* Add queue */}
            <Button
              mode="contained"
              onPress={() => this.handleAddQueue()}
              style={[
                styles.addQueueBtn,
                {
                  backgroundColor:
                    this.isDisable() || disable
                      ? "lightgray"
                      : COLORS.secondary,
                },
              ]}
              labelStyle={styles.addQueueBtnLabel}
              disabled={this.isDisable() || disable}
            >
              להזמין תור
            </Button>
            {error != "" ? (
              <Message
                msg={error}
                alertType={"danger"}
                textColor={COLORS.white}
              />
            ) : null}
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
  datePickerWrapper: {
    width: "90%",
    alignSelf: "center",
  },
  barberListItemWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  barberImage: {
    borderRadius: 10,
    height: 120,
    aspectRatio: 1,
  },
  barberText: {
    color: COLORS.text,
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    color: COLORS.primary,
    textAlign: isRTL ? "left" : "right",
    margin: 10,
  },
  servicesWrapper: {
    flexDirection: "row",
    justifyContent: isRTL ? "flex-start" : "flex-end",
  },
  timePickerWrapper: {
    alignItems: "center",
  },
  addQueueBtnWrapper: {
    margin: 20,
  },
  addQueueBtn: {
    backgroundColor: COLORS.secondary,
  },
  addQueueBtnLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default AddNewQueue;
