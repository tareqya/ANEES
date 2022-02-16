import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "../../assets/colors";

const Time = ({ time, selectedTime }) => {
  return (
    <View>
      <Text
        style={[
          styles.timeText,
          { color: selectedTime == time ? COLORS.white : COLORS.lightText },
        ]}
      >
        {time}
      </Text>
    </View>
  );
};
const TimePicker = ({
  hours = [],
  selectedTime = "12:30",
  onTimeSelect = (time) => {},
}) => {
  return (
    <View style={styles.continer}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={hours}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.timeListItemWrapper,
              {
                backgroundColor:
                  selectedTime == item ? COLORS.secondary : COLORS.white,
              },
            ]}
            onPress={() => onTimeSelect(item)}
          >
            <Time time={item} selectedTime={selectedTime} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  continer: {
    backgroundColor: COLORS.white,
    padding: 10,
    width: "90%",
    borderRadius: 10,
  },
  timeListItemWrapper: {
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 5,
  },
  timeText: {
    color: COLORS.lightText,
    fontWeight: "bold",
  },
});
export default TimePicker;
