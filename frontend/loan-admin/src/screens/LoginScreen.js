import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { loginUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      if (data?.token) {
        login(data); // save in context + AsyncStorage
      } else {
        Alert.alert("Login Failed", data?.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
        Loan Admin Login
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        className="border border-gray-300 rounded-xl p-4 mb-4"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="border border-gray-300 rounded-xl p-4 mb-6"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-600 p-4 rounded-xl mb-4"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text className="text-center text-blue-600 font-medium">
          Don’t have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
