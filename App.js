import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigation from "./src/navigations/MainNavigation";
import AuthNavigation from "./src/navigations/AuthNavigation";
import AdminNavigation from "./src/navigations/AdminNavigation";
import Database from "./src/Classes/Database";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import Loading from "./src/components/Loading";

const db = new Database();

export default function App() {
  const [currentUser, setCurrentUser] = useState(getAuth().currentUser);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        setLoading(true);
        db.onUserInfoChange(user.uid, (item) => {
          if (item != null) {
            setIsAdmin(item.isAdmin);
            setCurrentUser(user);
            setLoading(false);
          }
        });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
  }, []);

  if (loading && currentUser == null) {
    return (
      <View style={styles.continer}>
        <Loading />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {currentUser == null ? (
        <AuthNavigation />
      ) : isAdmin == true ? (
        <AdminNavigation />
      ) : (
        <MainNavigation />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    justifyContent: "center",
  },
});
