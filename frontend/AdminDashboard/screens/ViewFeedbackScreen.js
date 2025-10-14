import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { API_URL } from "@env";

export default function ViewFeedbackScreen({ navigation }) {
  const [username, setUsername] = useState("Admin");
  const [collapsed, setCollapsed] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
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
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No authentication token found");
        return;
      }

      const response = await axios.get(`${API_URL}/admin/feedbacks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFeedbacks(response.data.feedbacks || []);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError(err.message);
      Alert.alert("Error", "Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={i <= rating ? styles.starFilled : styles.starEmpty}>
          ★
        </Text>
      );
    }
    return stars;
  };

  const handleDeleteFeedback = async (feedbackId) => {
    Alert.alert(
      "Delete Feedback",
      "Are you sure you want to delete this feedback?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("accessToken");
              await axios.delete(`${API_URL}/admin/feedbacks/${feedbackId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setFeedbacks(feedbacks.filter((fb) => fb._id !== feedbackId));
              Alert.alert("Success", "Feedback deleted successfully");
            } catch (err) {
              console.error("Error deleting feedback:", err);
              Alert.alert("Error", "Failed to delete feedback");
            }
          },
        },
      ]
    );
  };

  const renderFeedback = ({ item }) => (
    <View style={styles.feedbackCard}>
      <View style={styles.feedbackHeader}>
        <Text style={styles.userText}>
          User: {item.userId?.username} ({item.userId?.email})
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteFeedback(item._id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Rating: </Text>
        <View style={styles.stars}>{renderStars(item.rating)}</View>
      </View>
      <Text style={styles.feedbackText}>
        Feedback: {item.feedback || "No feedback provided"}
      </Text>
      <Text style={styles.dateText}>Created At: {formatDate(item.createdAt)}</Text>
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
          <Text style={styles.title}>View Feedbacks</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading feedbacks...</Text>
          ) : error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : (
            <FlatList
              data={feedbacks}
              keyExtractor={(item) => item._id}
              renderItem={renderFeedback}
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
  feedbackCard: {
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
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 14,
    color: "#333",
    marginRight: 5,
  },
  stars: {
    flexDirection: "row",
  },
  starFilled: {
    color: "#FFD700",
    fontSize: 16,
  },
  starEmpty: {
    color: "#DDD",
    fontSize: 16,
  },
  feedbackText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
});
