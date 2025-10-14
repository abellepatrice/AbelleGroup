import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { API_URL } from "@env";

export default function ApproveLoansScreen({ navigation }) {
  const [username, setUsername] = useState("Admin");
  const [collapsed, setCollapsed] = useState(false);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleLoanPress = (loan) => {
    setSelectedLoan(loan);
    setModalVisible(true);
  };

  const handleApproveReject = async (status) => {
    if (!selectedLoan) return;

    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await axios.patch(
        `${API_URL}/admin/loans/${selectedLoan._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the loan status in the local state
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan._id === selectedLoan._id ? { ...loan, status } : loan
        )
      );

      Alert.alert("Success", `Loan ${status} successfully`);
      setModalVisible(false);
      setSelectedLoan(null);
    } catch (err) {
      console.error("Error updating loan status:", err);
      Alert.alert("Error", `Failed to ${status} loan`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return "#FF9800";
    }
  };

  const renderLoan = ({ item }) => (
    <TouchableOpacity
      style={[styles.loanCard, { borderLeftColor: getStatusColor(item.status) }]}
      onPress={() => handleLoanPress(item)}
    >
      <Text style={styles.loanText}>User: {item.userId?.username} ({item.userId?.email})</Text>
      <Text style={styles.loanText}>Amount: ${item.amount}</Text>
      <Text style={styles.loanText}>Interest Rate: {item.interestRate}%</Text>
      <Text style={styles.loanText}>Duration: {item.durationMonths} months</Text>
      <Text style={styles.loanText}>Purpose: {item.purpose}</Text>
      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
        Status: {item.status}
      </Text>
      <Text style={styles.dateText}>Created At: {formatDate(item.createdAt)}</Text>
    </TouchableOpacity>
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
          <Text style={styles.title}>Approve Loans</Text>
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

      {/* Modal for approving/rejecting loans */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedLoan && (
              <>
                <Text style={styles.modalTitle}>Loan Details</Text>
                <Text style={styles.modalText}>
                  User: {selectedLoan.userId?.username} ({selectedLoan.userId?.email})
                </Text>
                <Text style={styles.modalText}>Amount: ${selectedLoan.amount}</Text>
                <Text style={styles.modalText}>Interest Rate: {selectedLoan.interestRate}%</Text>
                <Text style={styles.modalText}>Duration: {selectedLoan.durationMonths} months</Text>
                <Text style={styles.modalText}>Purpose: {selectedLoan.purpose}</Text>
                <Text style={styles.modalText}>Status: {selectedLoan.status}</Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.approveButton]}
                    onPress={() => handleApproveReject("approved")}
                  >
                    <Text style={styles.buttonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => handleApproveReject("rejected")}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    borderLeftWidth: 5,
  },
  loanText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  cancelButton: {
    backgroundColor: "#9E9E9E",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
