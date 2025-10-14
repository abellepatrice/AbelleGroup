import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from '@env';


export default function SideBar({ navigation, collapsed, toggleCollapsed }) {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const image = await AsyncStorage.getItem("profileImage");
        const uname = await AsyncStorage.getItem("username");
        if (image) {
          const baseUrl = API_URL.replace('/api', '').replace(/\/+$/, '');
          setProfileImage(`${baseUrl}${image}`);
        }
        if (uname) setUsername(uname);
      } catch (err) {
        console.log("Error loading user data", err);
      }
    };
    loadUserData();
  }, []);

  const links = [
    { name: "Dashboard", icon: "home-outline", route: "Home" },
    { name: "My Profile", icon: "person-outline", route: "Profile" },
    { name: "View Users", icon: "people-outline", route: "ViewUsers" },
    { name: "View Loans", icon: "cash-outline", route: "ViewLoans" },
    { name: "Approve Loans", icon: "checkmark-done-outline", route: "ApproveLoans" },
    { name: "Add Notifications", icon: "notifications-outline", route: "AddNotifications" },
    { name: "View Feedback", icon: "chatbubble-ellipses-outline", route: "ViewFeedback" },
  ];

  return (
    <View style={[styles.sidebar, collapsed && styles.collapsed]}>
      {/* Profile Section */}
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={toggleCollapsed}
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Icon name="person-circle-outline" size={50} color="#73a8c5ff" />
        )}
        {!collapsed && (
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.username}>{username || "Admin"}</Text>
            <Text style={styles.brand}>ABELLE GROUP</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Sidebar Links */}
      <View style={styles.links}>
        {links.map((link, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.link}
            onPress={() => navigation.navigate(link.route)}
          >
            <Icon name={link.icon} size={22} color="#73a8c5ff" />
            {!collapsed && <Text style={styles.linkText}>{link.name}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.link, styles.logout]}
        onPress={async () => {
          await AsyncStorage.clear();
          navigation.replace("Login");
        }}
      >
        <Icon name="log-out-outline" size={22} color="red" />
        {!collapsed && <Text style={[styles.linkText, { color: "red" }]}>Logout</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  collapsed: {
    width: 70,
    alignItems: "center",
    paddingHorizontal: 0,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#73a8c5ff",
  },
  username: {
    fontSize: 16,
    color: "#73a8c5ff",
    fontWeight: "bold",
  },
  brand: {
    fontSize: 12,
    color: "#73a8c5ff",
    opacity: 0.8,
  },
  links: {
    flex: 1,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  linkText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#73a8c5ff",
  },
  logout: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(37, 5, 5, 0.3)",
    paddingTop: 15,
  },
});

