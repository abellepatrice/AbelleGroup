import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { signupUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleSignup = async () => {
    try {
      const data = await signupUser(username, email, password);
      if (data?.token) {
        login(data);
      } else {
        Alert.alert("Signup Failed", data?.message || "Try again later");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
        Create an Account
      </Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        className="border border-gray-300 rounded-xl p-4 mb-4"
      />
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
        onPress={handleSignup}
        className="bg-green-600 p-4 rounded-xl mb-4"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text className="text-center text-blue-600 font-medium">
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </View>
  );
}
