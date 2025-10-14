import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import HomeScreen from "@/screens/HomeScreen";
import AuthLoading from "@/screens/AuthLoading";
import ProfileScreen from "@/screens/ProfileScreen";
import SignupScreen from "@/screens/SignupScreen";
import ViewUsersScreen from "@/screens/ViewUsersScreen";
import ViewLoans from "../screens/ViewLoans";
import ViewFeedbackScreen from "../screens/ViewFeedbackScreen";
import ApproveLoansScreen from "../screens/ApproveLoansScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AdminDrawer() {
  return (
    <Drawer.Navigator screenOptions={{headerShown: false,}}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="ViewUsers" component={ViewUsersScreen} />
      <Drawer.Screen name="ViewLoans" component={ViewLoans} />
      <Drawer.Screen name="ApproveLoans" component={ApproveLoansScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="ViewFeedback" component={ViewFeedbackScreen} />
    </Drawer.Navigator>
  );
}


export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name= "Profile" component={ProfileScreen}/>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen}/>
      <Stack.Screen name="ViewUsers" component={ViewUsersScreen} />
      <Stack.Screen name="ViewFeedback" component={ViewFeedbackScreen} />
      <Stack.Screen name="ViewLoans" component={ViewLoans} />
      <Stack.Screen name="ApproveLoans" component={ApproveLoansScreen} />
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Signup" component={SignupScreen}/>
      <Stack.Screen name="AuthLoading" component={AuthLoading}/>
      <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
    </Stack.Navigator>
  );
}
