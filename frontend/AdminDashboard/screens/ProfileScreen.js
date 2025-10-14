import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { API_URL } from "@env";

const MOCK_PROFILE = {
  username: "Admin User",
  email: "admin@example.com",
  phone: "0712345678",
  role: "Administrator",
  dob: "1990-01-01",
  createdAt: "2025-01-01",
  profileImage: null,
};

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsed = JSON.parse(storedData);

          // get base URL without `/api`
          const baseUrl = API_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");

          // attach base URL to stored profileImage if present
          const profileImage = parsed.user?.profileImage
            ? `${baseUrl}${parsed.user.profileImage}`
            : MOCK_PROFILE.profileImage;

          setProfile({
            username: parsed.user?.username || MOCK_PROFILE.username,
            email: parsed.user?.email || MOCK_PROFILE.email,
            phone: parsed.user?.phone || MOCK_PROFILE.phone,
            role: parsed.user?.role || MOCK_PROFILE.role,
            dob: parsed.user?.dob || MOCK_PROFILE.dob,
            createdAt: parsed.user?.createdAt || MOCK_PROFILE.createdAt,
            profileImage,
          });
        }
      } catch (error) {
        console.log("Error loading user data:", error);
        setProfile(MOCK_PROFILE);
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
          username={profile.username}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            {profile.profileImage ? (
              <Image
                source={{ uri: profile.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.noImage]}>
                <Text style={{ color: "#aaa" }}>No Image</Text>
              </View>
            )}
            <Text style={styles.cardValue}>{profile.username}</Text>
            <Text style={styles.cardLabel}>{profile.role}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{profile.email}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{profile.phone}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.label}>DOB</Text>
              <Text style={styles.value}>{profile.dob}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.label}>Created</Text>
              <Text style={styles.value}>{profile.createdAt}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#f4f6f9" },
  sidebar: { width: 250, backgroundColor: "#00a6ff" },
  main: { flex: 1 },
  content: { padding: 20, alignItems: "center" },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#00a6ff",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  noImage: { backgroundColor: "#eee" },
  cardLabel: { fontSize: 14, color: "#555" },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  infoBox: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  label: { fontSize: 14, fontWeight: "bold", color: "#555" },
  value: { fontSize: 15, color: "#333", marginTop: 2 },
});

// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import SideBar from "../components/SideBar";
// import Navbar from "../components/Navbar";

// const MOCK_PROFILE = {
//   username: "Admin User",
//   email: "admin@example.com",
//   phone: "0712345678",
//   role: "Administrator",
//   dob: "1990-01-01",
//   createdAt: "2025-01-01",
//   profileImage: null, 
// };

// export default function ProfileScreen({ navigation }) {
//   const [profile, setProfile] = useState(MOCK_PROFILE);
//   const [collapsed, setCollapsed] = useState(false);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const storedData = await AsyncStorage.getItem("userData");
//         if (storedData) {
//           const parsed = JSON.parse(storedData);

//           setProfile({
//             username: parsed.user?.username || MOCK_PROFILE.username,
//             email: parsed.user?.email || MOCK_PROFILE.email,
//             phone: parsed.user?.phone || MOCK_PROFILE.phone,
//             role: parsed.user?.role || MOCK_PROFILE.role,
//             dob: parsed.user?.dob || MOCK_PROFILE.dob,
//             createdAt: parsed.user?.createdAt || MOCK_PROFILE.createdAt,
//             profileImage: parsed.user?.profileImage || MOCK_PROFILE.profileImage,
//           });
//         }
//       } catch (error) {
//         console.log("Error loading user data:", error);
//         setProfile(MOCK_PROFILE);
//       }
//     };
//     loadData();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={[styles.sidebar, collapsed && { width: 70 }]}>
//         <SideBar
//           navigation={navigation}
//           collapsed={collapsed}
//           toggleCollapsed={() => setCollapsed(!collapsed)}
//         />
//       </View>

//       <View style={styles.main}>
//         <Navbar
//           username={profile.username}
//           onToggleSidebar={() => setCollapsed(!collapsed)}
//         />

//         <ScrollView contentContainerStyle={styles.content}>
//           <View style={styles.card}>
//             {profile.profileImage ? (
//               <Image
//                 source={{ uri: profile.profileImage }}
//                 style={styles.profileImage}
//               />
//             ) : (
//               <View style={[styles.profileImage, styles.noImage]}>
//                 <Text style={{ color: "#aaa" }}>No Image</Text>
//               </View>
//             )}
//             <Text style={styles.cardValue}>{profile.username}</Text>
//             <Text style={styles.cardLabel}>{profile.role}</Text>

//             <View style={styles.infoBox}>
//               <Text style={styles.label}>Email</Text>
//               <Text style={styles.value}>{profile.email}</Text>
//             </View>

//             <View style={styles.infoBox}>
//               <Text style={styles.label}>Phone</Text>
//               <Text style={styles.value}>{profile.phone}</Text>
//             </View>

//             <View style={styles.infoBox}>
//               <Text style={styles.label}>DOB</Text>
//               <Text style={styles.value}>{profile.dob}</Text>
//             </View>

//             <View style={styles.infoBox}>
//               <Text style={styles.label}>Created</Text>
//               <Text style={styles.value}>{profile.createdAt}</Text>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, flexDirection: "row", backgroundColor: "#f4f6f9" },
//   sidebar: { width: 250, backgroundColor: "#00a6ff" },
//   main: { flex: 1 },
//   content: { padding: 20, alignItems: "center" },
//   card: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 10,
//     width: "90%",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 2,
//     borderColor: "#00a6ff",
//     marginBottom: 15,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noImage: { backgroundColor: "#eee" },
//   cardLabel: { fontSize: 14, color: "#555" },
//   cardValue: { fontSize: 20, fontWeight: "bold", marginBottom: 5, color: "#333" },
//   infoBox: { width: "100%", marginTop: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
//   label: { fontSize: 14, fontWeight: "bold", color: "#555" },
//   value: { fontSize: 15, color: "#333", marginTop: 2 },
// });

// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import SideBar from "../components/SideBar";
// import Navbar from "../components/Navbar";

// export default function ProfileScreen({ navigation }) {
//   const [username, setUsername] = useState("User");
//   const [collapsed, setCollapsed] = useState(false);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const storedData = await AsyncStorage.getItem("userData");
//         if (storedData) {
//           const parsed = JSON.parse(storedData);

//           setUsername(parsed.user?.username || "User");
//         }
//       } catch (error) {
//         console.log("Error loading user data:", error);
//       }
//     };
//     loadData();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={[styles.sidebar, collapsed && { width: 70 }]}>
//         <SideBar
//           navigation={navigation}
//           collapsed={collapsed}
//           toggleCollapsed={() => setCollapsed(!collapsed)}
//         />
//       </View>

//       <View style={styles.main}>
//         <Navbar
//           username={username}
//           onToggleSidebar={() => setCollapsed(!collapsed)}
//         />

//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "#f4f6f9",
//   },
//   sidebar: {
//     width: 250,
//     backgroundColor: "#00a6ff",
//   },
//   main: {
//     flex: 1,
//   },
//   content: {
//     padding: 20,
//   },
//   cardRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: "white",
//     padding: 20,
//     marginHorizontal: 5,
//     borderRadius: 10,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//   },
//   cardLabel: {
//     fontSize: 14,
//     color: "#555",
//   },
//   cardValue: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 5,
//     color: "#333",
//   },
// });


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideBar from "../components/SideBar";
// import Navbar from "../components/Navbar";
// import { API_URL } from "@env";

// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function ProfileScreen({ navigation }) {
//   const [profile, setProfile] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (!token) {
//           setError("No token found. Please log in again.");
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get(`${API_URL}/admin/profile`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProfile(res.data);
//       } catch (err) {
//         console.log("Profile fetch error:", err);
//         setError("Failed to fetch profile");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#73a8c5ff" />
//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.error}>{error}</Text>
//       </View>
//     );
//   }

//   if (!profile) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.error}>Profile not available.</Text>
//       </View>
//     );
//   }

//   // build safe profile image URL
//   const baseUrl = API_URL.replace("/api", "").replace(/\/+$/, "");
//   const profileImageUrl = profile.profileImage
//     ? `${baseUrl}${profile.profileImage}`
//     : null;

//   return (
//     <View style={{ flex: 1, flexDirection: "row" }}>
//       {/* Sidebar */}
//       <SideBar navigation={navigation} />

//       {/* Main Content */}
//       <View style={{ flex: 1 }}>
//         <Navbar username={profile.username} />

//         <ScrollView contentContainerStyle={styles.container}>
//           <View style={styles.card}>
//             {profileImageUrl ? (
//               <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
//             ) : (
//               <Text style={styles.noImage}>No profile image</Text>
//             )}

//             <Text style={styles.username}>{profile.username}</Text>
//             <Text style={styles.role}>{profile.role}</Text>

//             <View style={styles.infoBox}>
//               <Text style={styles.label}>Email</Text>
//               <Text style={styles.value}>{profile.email}</Text>
//             </View>

//             <View style={styles.infoBox}>
//               <Text style={styles.label}>Phone</Text>
//               <Text style={styles.value}>{profile.phone}</Text>
//             </View>

//             <View style={styles.infoBox}>
//               <Text style={styles.label}>Date of Birth</Text>
//               <Text style={styles.value}>
//                 {new Date(profile.dob).toLocaleDateString()}
//               </Text>
//             </View>

//             <View style={styles.infoBox}>
//               <Text style={styles.label}>Created At</Text>
//               <Text style={styles.value}>
//                 {new Date(profile.createdAt).toLocaleString()}
//               </Text>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     paddingVertical: 30,
//   },
//   card: {
//     backgroundColor: "#fff",
//     width: "90%",
//     borderRadius: 15,
//     padding: 20,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 15,
//     borderWidth: 3,
//     borderColor: "#73a8c5ff",
//   },
//   noImage: {
//     color: "#999",
//     marginBottom: 15,
//   },
//   username: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   role: {
//     fontSize: 16,
//     color: "#73a8c5ff",
//     marginBottom: 20,
//   },
//   infoBox: {
//     width: "100%",
//     marginBottom: 12,
//     padding: 10,
//     backgroundColor: "#f9f9f9",
//     borderRadius: 8,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#555",
//   },
//   value: {
//     fontSize: 15,
//     color: "#333",
//     marginTop: 2,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//     color: "#73a8c5ff",
//   },
//   error: {
//     color: "red",
//     fontSize: 16,
//   },
// });

