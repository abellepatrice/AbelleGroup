import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState("User");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsed = JSON.parse(storedData);

          setUsername(parsed.user?.username || "User");
        }
      } catch (error) {
        console.log("Error loading user data:", error);
      }
    };
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.sidebar, collapsed && { width: 70 }]}>
        <SideBar
          navigation={navigation}
          collapsed={collapsed}
          toggleCollapsed={() => setCollapsed(!collapsed)}
        />
      </View>

      <View style={styles.main}>
        <Navbar
          username={username}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Name</Text>
              <Text style={styles.cardValue}>Patrice Oyende</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Username</Text>
              <Text style={styles.cardValue}>{username}</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Account Status</Text>
              <Text style={[styles.cardValue, { color: "red" }]}>
                Inactive
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Current Balance</Text>
              <Text style={styles.cardValue}>KSH 0</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total Withdrawals</Text>
              <Text style={styles.cardValue}>KSH 0</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total Money In</Text>
              <Text style={styles.cardValue}>KSH 0</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f4f6f9",
  },
  sidebar: {
    width: 250,
    backgroundColor: "#00a6ff",
  },
  main: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  cardLabel: {
    fontSize: 14,
    color: "#555",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    color: "#333",
  },
});

