import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function Navbar({ username, onToggleSidebar }) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={onToggleSidebar} style={styles.menuBtn}>
        <Icon name="menu-outline" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.welcome}>Welcome {username || "User"}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="notifications-outline" size={22} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Icon name="person-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#73a8c5ff",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuBtn: {
    marginRight: 10,
  },
  welcome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    marginLeft: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: 15,
  },
});


