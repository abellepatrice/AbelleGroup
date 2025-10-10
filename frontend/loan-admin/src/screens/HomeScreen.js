import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View className="flex-1 bg-gray-100 justify-center items-center p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        Welcome {user?.username || "Admin"} 
      </Text>
      <TouchableOpacity
        onPress={logout}
        className="bg-red-500 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
