// import axios from "axios";
// import SideBar from "./SideBar";
// import Navbar from "./Navbar"; 
// import "./src/Profile.css"; 
// import { API_URL } from "@env";


// export default function Profile() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${API_URL}/admin/profile`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProfile(res.data);
//       } catch (err) {
//         setError("Failed to fetch profile");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (loading) return <div>Loading profile...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div style={{ display: "flex" }}>
//       <SideBar />
//       <Navbar />

//       <div style={{ flex: 1 }}>
//         <div className="profile-container">
//           <h2>My Profile</h2>
//           <div className="profile-card">
//             <img
//               src={profile.profileImage}
//               alt="Profile"
//               className="profile-img"
//             />
//             <div className="profile-info">
//               <p><strong>Username:</strong> {profile.username}</p>
//               <p><strong>Email:</strong> {profile.email}</p>
//               <p><strong>Phone:</strong> {profile.phone}</p>
//               <p>
//                 <strong>Date of Birth:</strong>{" "}
//                 {new Date(profile.dob).toLocaleDateString()}
//               </p>
//               <p><strong>Role:</strong> {profile.role}</p>
//               <p>
//                 <strong>Created At:</strong>{" "}
//                 {new Date(profile.createdAt).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
