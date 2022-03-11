import React, { useRef, useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Animated,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StoreScreen from "../screens/StoreScreen";
import TrackerScreen from "../screens/TrackerScreen";
import AddNewQueue from "../screens/AddNewQueue";
import PostsScreen from "../screens/PostsScreen";
import UpdateProfile from "../screens/UpadteProfile";

import { COLORS } from "../../assets/colors";

const Stack = createNativeStackNavigator();
const HomeTabStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PostsScreen" component={PostsScreen} />
    </Stack.Navigator>
  );
};

const TrackerTabStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TrackerScreen" component={TrackerScreen} />
    </Stack.Navigator>
  );
};

const ProfileTabStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  // const [badge, setBadge] = useState(0);
  const animation = useRef(new Animated.Value(1)).current;

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarIconStyle: { top: 10 },
        headerShown: true,
        title: "ANEES",
        tabBarLabel: "",
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
          color: COLORS.white,
          fontSize: 28,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeTabStack}
        options={() => {
          return {
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <View>
                  <View style={styles.iconTabBackground} />
                  <View style={styles.tabIconWrapper}>
                    <Entypo name="home" color={color} size={size} />
                  </View>
                </View>
              ) : (
                <Entypo name="home" color={color} size={size} />
              ),
          };
        }}
      />

      <Tab.Screen
        name="TrackerTabStack"
        component={TrackerTabStack}
        options={() => {
          return {
            // tabBarBadge: badge > 0 ? badge : null,
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <View>
                  <View style={styles.iconTabBackground} />
                  <View style={styles.tabIconWrapper}>
                    <Fontisto name="bell" color={color} size={size} />
                  </View>
                </View>
              ) : (
                <Fontisto name="bell" color={color} size={size} />
              ),
          };
        }}
      />

      <Tab.Screen
        name="AddNewQueue"
        component={AddNewQueue}
        options={() => {
          return {
            unmountOnBlur: true,
            tabBarButton: (props) => (
              <Animated.View
                style={[
                  styles.addQueueBottom,
                  { transform: [{ scale: animation }] },
                ]}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    startAnimation();
                    props.onPress();
                  }}
                >
                  <MaterialIcons name={"add"} color={COLORS.white} size={30} />
                </TouchableWithoutFeedback>
              </Animated.View>
            ),
          };
        }}
      />

      <Tab.Screen
        name="StoreScreen"
        component={StoreScreen}
        options={() => {
          return {
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <View>
                  <View style={styles.iconTabBackground} />
                  <View style={styles.tabIconWrapper}>
                    <Feather name="shopping-bag" color={color} size={size} />
                  </View>
                </View>
              ) : (
                <Feather name="shopping-bag" color={color} size={size} />
              ),
          };
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileTabStack}
        options={() => {
          return {
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <View>
                  <View style={styles.iconTabBackground} />
                  <View style={styles.tabIconWrapper}>
                    <MaterialIcons name="person" color={color} size={size} />
                  </View>
                </View>
              ) : (
                <MaterialIcons name="person" color={color} size={size} />
              ),
          };
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconTabBackground: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.primary,
    position: "absolute",
    opacity: 0.1,
    borderRadius: 4,
  },
  addQueueBottom: {
    width: 50,
    height: 50,
    top: -20,
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  tabIconWrapper: {
    height: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default MainNavigation;
