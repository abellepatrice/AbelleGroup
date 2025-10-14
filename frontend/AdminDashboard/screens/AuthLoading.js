import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLoading({ navigation }) {
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");

        setTimeout(() => {
          if (userData) {
            navigation.replace("Home"); 
          } else {
            navigation.replace("Login");
          }
        }, 800);
      } catch (error) {
        console.error("Error checking login:", error);
        navigation.replace("Login");
      }
    };

    checkLogin();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#607AFB" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
