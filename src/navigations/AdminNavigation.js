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

import HomeScreen from "../screens/adminScreens/HomeScreen";
import AddNewCustomer from "../screens/adminScreens/AddNewCustomer";
import ProfileScreen from "../screens/ProfileScreen";
import UpdateProfile from "../screens/UpadteProfile";
import StoreScreen from "../screens/StoreScreen";
import QueuesListScreen from "../screens/adminScreens/QueuesListScreen";
import AddNewQueueAdmin from "../screens/adminScreens/AddNewQueueAdmin";

import ManagerHome from "../screens/ManagerScreens/ManagerHome";
import ResetPassword from "../screens/ManagerScreens/ResetPassword";
import Workers from "../screens/ManagerScreens/Workers";
import AddNewPost from "../screens/ManagerScreens/AddNewPost";

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
    </Stack.Navigator>
  );
};

const ManagerStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ManagerHome" component={ManagerHome} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="AddNewCustomer" component={AddNewCustomer} />
      <Stack.Screen name="Workers" component={Workers} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddNewPost" component={AddNewPost} />
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
      <Stack.Screen name="ManagerStack" component={ManagerStack} />
    </Stack.Navigator>
  );
};

const AddNewQueueAdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AddNewQueueAdmin" component={AddNewQueueAdmin} />
      <Stack.Screen name="AddNewCustomer" component={AddNewCustomer} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const AdminNavigation = () => {
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
        name="HomeTabStack"
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
        name="QueuesListScreen"
        component={QueuesListScreen}
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
        name="AddNewQueueAdminStack"
        component={AddNewQueueAdminStack}
        options={() => {
          return {
            headerShown: false,
            tabBarStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarButton: (props) => (
              <Animated.View style={[styles.addQueueBottom]}>
                <TouchableWithoutFeedback
                  onPress={() => {
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
export default AdminNavigation;
