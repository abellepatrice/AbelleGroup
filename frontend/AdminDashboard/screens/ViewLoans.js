import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { API_URL } from "@env";

export default function ViewLoans({ navigation }) {
  const [username, setUsername] = useState("Admin");
  const [collapsed, setCollapsed] = useState(false);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setUsername(parsed.user?.username || "Admin");
        }
      } catch (error) {
        console.log("Error loading user data:", error);
      }
    };
    loadData();
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No authentication token found");
        return;
      }

      const response = await axios.get(`${API_URL}/admin/loans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoans(response.data || []);
    } catch (err) {
      console.error("Error fetching loans:", err);
      setError(err.message);
      Alert.alert("Error", "Failed to load loans");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderLoan = ({ item }) => (
    <View style={styles.loanCard}>
      <Text style={styles.loanText}>User: {item.userId?.username} ({item.userId?.email})</Text>
      <Text style={styles.loanText}>Amount: Ksh{item.amount}</Text>
      <Text style={styles.loanText}>Interest Rate: {item.interestRate}%</Text>
      <Text style={styles.loanText}>Duration: {item.durationMonths} months</Text>
      <Text style={styles.loanText}>Purpose: {item.purpose}</Text>
      <Text style={styles.loanText}>Status: {item.status}</Text>
      <Text style={styles.loanText}>Created At: {formatDate(item.createdAt)}</Text>
    </View>
  );

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
          <Text style={styles.title}>View Loans</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading loans...</Text>
          ) : error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : (
            <FlatList
              data={loans}
              keyExtractor={(item) => item._id}
              renderItem={renderLoan}
              contentContainerStyle={styles.listContainer}
            />
          )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  loanCard: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  loanText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
});
