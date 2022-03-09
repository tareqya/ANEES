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
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { Button, Searchbar } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import { isRTL } from "expo-localization";

import DatePicker from "../../components/DatePicker";
import Service from "../../components/Service";
import TimePicker from "../../components/TimePicker";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Verify from "../../components/Verify";
import UserComp from "../../components/UserComp";
import { COLORS } from "../../../assets/colors";
import { PROFILE_IMAGE } from "../../../assets/images";

import {
  convertDateToString,
  compareDate,
  getFreeHours,
  convertMinsToHrsMins,
  convertStringHourToMin,
} from "../../utils/utilsFunctions";
import {
  WAITING_STATUS,
  MONTHS,
  BARBERS,
  OPEN_TIME,
  CLOSE_TIME,
  SERVICES,
} from "../../utils/constens";

import Database from "../../Classes/Database";
import Queue from "../../Classes/Queue";
import Message from "../../components/Message";

const { width, height } = Dimensions.get("screen");

class AddNewQueueAdmin extends Component {
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
      selectCustomer: false,
      customerSearch: "",
      selectedCustomer: undefined,
      customers: [],
      allCustomers: [],
      refreshCustomers: false,
      barbers: [],
    };

    this.db = new Database();

    this.selectCustomerAnimation = new Animated.Value(0);
    this.selectedService = {};
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerShown: false,
      tabBarStyle: { display: "none" },
    });
    this.db.getBarbers(this.onBarbersFetchComplate);
  }

  onBarbersFetchComplate = async (barbers) => {
    const barbers_arr = [];

    for (let i = 0; i < barbers.length; i++) {
      var url = null;
      if (barbers[i].image != undefined) {
        url = await this.db.donwloadImage(`barbersImages/${barbers[i].image}`);
      }
      const full_name = barbers[i].first_name + " " + barbers[i].last_name;
      barbers_arr.push({
        id: barbers[i].uid,
        token: barbers[i].token,
        name: full_name,
        image: PROFILE_IMAGE,
        uri: url,
      });
    }

    this.setState({ barbers: barbers_arr });
  };
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
    const freeHours = getFreeHours(
      OPEN_TIME,
      CLOSE_TIME,
      this.selectedService.time,
      queues
    );
    this.setState({
      availableHours: freeHours,
      calcFreeHours: false,
      noHoursAvailable: freeHours.length == 0,
    });
  };

  handleAddQueue = () => {
    const { selectedBarber, selectedDate, selectedTime, selectedCustomer } =
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
      convertStringHourToMin(selectedTime) + this.selectedService.time
    );

    const queue = new Queue(
      selectedCustomer.uid,
      convertDateToString(selectedDate),
      selectedTime,
      end_time,
      selectedBarber.id,
      this.selectedService.name,
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
    const { selectedBarber } = this.state;
    if (selectedBarber != null && this.selectedService.time != undefined) {
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

      this.selectedService = service;
      this.setState({ selectedService: service });
      this.db.getBarberQueuesByDate(
        convertDateToString(selectedDate),
        selectedBarber.id,
        this.fetchBarberQueuesComplate
      );
    }
  };

  isDisable = () => {
    const { selectedBarber, selectedDate, selectedTime, selectedCustomer } =
      this.state;

    return (
      selectedBarber == null ||
      selectedDate == null ||
      selectedTime == null ||
      this.selectedService.name == undefined ||
      selectedCustomer == undefined
    );
  };

  onChangeSearch = (value) => {
    const { allCustomers } = this.state;
    const filter = [];

    if (value != "") {
      for (let i = 0; i < allCustomers.length; i++) {
        if (
          allCustomers[i].first_name.includes(value) ||
          allCustomers[i].last_name.includes(value) ||
          allCustomers[i].phone.replace("+972", "0").includes(value)
        ) {
          filter.push(allCustomers[i]);
        }
      }
      this.setState({ customerSearch: value, customers: filter });
    } else {
      this.setState({ customerSearch: value, customers: allCustomers });
    }
  };

  handleGetAllCustomer = () => {
    this.db.getCustomers((customers) => {
      this.setState({
        customers,
        allCustomers: customers,
        refreshCustomers: false,
      });
    });
  };

  handleSelectCustomerPress = () => {
    this.setState({ selectCustomer: true });
    this.handleGetAllCustomer();

    this.selectCustomerAnimation = new Animated.Value(0);
    Animated.timing(this.selectCustomerAnimation, {
      duration: 1000,
      useNativeDriver: true,
      toValue: 1,
      easing: Easing.bounce,
    }).start();
  };

  handleChooseCustomer = (customer) => {
    this.setState({ selectedCustomer: customer });
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
      selectCustomer,
      customerSearch,
      customers,
      selectedCustomer,
      refreshCustomers,
      barbers,
    } = this.state;
    if (barbers.length == 0) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Loading />
        </View>
      );
    }
    return (
      <View style={styles.continer}>
        <Header goBack={() => this.props.navigation.navigate("HomeTabStack")} />
        {queueAddComplate ? (
          <Verify
            callBack={() => this.props.navigation.navigate("HomeTabStack")}
          />
        ) : null}

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* choose barber */}
          <View style={styles.chooseBarberWrapper}>
            <Text style={styles.title}>בחר ספר</Text>
            <FlatList
              horizontal
              data={barbers}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={styles.barberListItemWrapper}
                    onPress={() => this.handleChoosenBarber(item)}
                  >
                    {item.uri == null ? (
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
                    ) : (
                      <Image
                        source={{ uri: item.uri }}
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
                    )}
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

          <View>
            {/* select customer */}
            <Button
              mode="contained"
              onPress={() => this.handleSelectCustomerPress()}
              style={[styles.addCustomerBtn]}
              labelStyle={styles.addQueueBtnLabel}
            >
              בחר לקוח
            </Button>
          </View>
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

        {selectCustomer ? (
          <View style={styles.selectCustomerContiner}>
            <Animated.View
              style={[
                styles.selectCustomerBody,
                { transform: [{ scale: this.selectCustomerAnimation }] },
              ]}
            >
              <TouchableOpacity
                style={{ width: 40, height: 40 }}
                onPress={() => {
                  this.setState({ selectCustomer: false });
                }}
              >
                <AntDesign
                  name="close"
                  color={COLORS.lightText}
                  size={25}
                  style={{ marginBottom: 10 }}
                />
              </TouchableOpacity>

              <Searchbar
                placeholder="חפש לקוח"
                onChangeText={this.onChangeSearch}
                value={customerSearch}
              />

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("AddNewCustomer");
                }}
                style={styles.insertNewCustomerButton}
              >
                <Text style={styles.insertNewCustomerText}>
                  הוספת לקוח חדש ?
                </Text>
              </TouchableOpacity>

              <View style={styles.customersWrapper}>
                <FlatList
                  refreshing={refreshCustomers}
                  onRefresh={() => this.handleGetAllCustomer()}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <Message
                      msg="לא נמצא לקוחות במערכת"
                      alertType={"warning"}
                      textColor={COLORS.white}
                    />
                  }
                  data={customers}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={styles.customerWrapper}
                      onPress={() => this.handleChooseCustomer(item)}
                    >
                      <UserComp
                        user={item}
                        continerStyle={{
                          borderColor:
                            item.uid == selectedCustomer?.uid
                              ? COLORS.secondary
                              : COLORS.background,
                          borderWidth:
                            item.uid == selectedCustomer?.uid ? 2 : 0,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                />
                <Button
                  mode="contained"
                  onPress={() => this.setState({ selectCustomer: false })}
                  style={{
                    alignSelf: "center",
                    width: 150,
                    backgroundColor: COLORS.primary,
                    marginTop: 20,
                  }}
                  labelStyle={{ color: COLORS.white }}
                >
                  בחר
                </Button>
              </View>
            </Animated.View>
          </View>
        ) : null}
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
  addCustomerBtn: {
    width: 150,
    backgroundColor: COLORS.primary,
    alignSelf: isRTL ? "flex-start" : "flex-end",
    margin: 10,
  },
  selectCustomerContiner: {
    flex: 1,
    position: "absolute",
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  selectCustomerBody: {
    width: "90%",
    height: "50%",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
  },
  insertNewCustomerButton: {
    marginTop: 10,
    alignSelf: isRTL ? "flex-start" : "flex-end",
  },
  insertNewCustomerText: {
    color: "blue",
  },
  customerWrapper: {
    marginVertical: 5,
  },
  customersWrapper: {
    flex: 1,
    marginTop: 10,
  },
});
export default AddNewQueueAdmin;
