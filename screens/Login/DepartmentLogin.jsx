// import React, { useState } from "react";
// import { auth, db, collection } from "../Firebase/config.js";
// import Logo from "../assets/Logo.png";
// import { doc, getDoc } from "firebase/firestore";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigation } from '@react-navigation/native';
// import { Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

// export default function DepartmentLogin() {
//   const [role, setRole] = useState("Head");
//   const [department, setDepartment] = useState("");
//   const [classType, setClassType] = useState("Class A");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigation = useNavigation();

//   const handleRoleChange = (selectedRole) => {
//     setRole(selectedRole);

//     // Automatically set classType to "Class A" if role is "Head"
//     if (selectedRole === "Head") {
//       setClassType("Class A");
//     } else {
//       setClassType(""); // Clear classType if role is not "Head"
//     }
//   };

//   const handleDepartmentChange = (selectedDepartment) => {
//     setDepartment(selectedDepartment);
//   };

//   const handleClassTypeChange = (selectedClassType) => {
//     setClassType(selectedClassType);
//   };

//   const handleLogin = async () => {
//     setError("");

//     try {
//       if (role === "Admin") {
//         // Set session storage for Admin (Note: AsyncStorage can be used for persistent storage in React Native)
//         // AsyncStorage.setItem("name", "Platform Admin");
//         // AsyncStorage.setItem("email", email);
//         // AsyncStorage.setItem("classType", "Platform Admin");
//         // AsyncStorage.setItem("isLoggedIn", "true");

//         console.log("Admin login successful");
//         navigation.navigate('Home'); // Adjust the navigation target as needed
//       } else {
//         const documentRef = doc(db, "departments", department);
//         const docSnap = await getDoc(documentRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           const dbPass = data.employees[email]?.password;
//           const name = data.employees[email]?.Name;

//           if (dbPass === password) {
//             // Save user details to AsyncStorage if necessary
//             // AsyncStorage.setItem("name", name);
//             // AsyncStorage.setItem("email", email);
//             // AsyncStorage.setItem("department", department);
//             // AsyncStorage.setItem("classType", classType);
//             // AsyncStorage.setItem("isLoggedIn", "true");

//             console.log("Login successful");
//             navigation.navigate('Home');
//           } else {
//             setError("Incorrect email or password. Please try again.");
//           }
//         } else {
//           setError("No such department found!");
//           console.log("No such document!");
//         }
//       }
//     } catch (err) {
//       setError("An error occurred while logging in. Please try again.");
//       console.error("Login error:", err);
//     }
//   };

//   const getRegisterLink = () => {
//     switch (role) {
//       case "Admin":
//         return "/register-department";
//       case "Head":
//         return "/register-department";
//       default:
//         return "";
//     }
//   };

//   return (
//     <View className="flex-1 justify-center items-center bg-white">
//       <View className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[350px]">
//         <View className="flex justify-center mb-6">
//           <Image source={Logo} className="w-24 h-24 bg-gray-300 rounded-full" />
//         </View>

//         <Text className="text-2xl font-bold text-center mb-4">Login to Your Account</Text>

//         {error && (
//           <Text className="text-red-500 text-center mb-4">{error}</Text>
//         )}

//         <TextInput
//           value={email}
//           onChangeText={setEmail}
//           placeholder="Enter Email Address"
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//         />

//         <TextInput
//           value={password}
//           onChangeText={setPassword}
//           placeholder="Enter Password"
//           secureTextEntry
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//         />

//         {/* Role Dropdown */}
//         <View className="mb-6">
//           <Text className="text-gray-700 mb-2">Role</Text>
//           <View className="border rounded-lg">
//             <TouchableOpacity
//               className="p-3"
//               onPress={() => handleRoleChange("Admin")}
//             >
//               <Text>Platform Admin</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="p-3"
//               onPress={() => handleRoleChange("Head")}
//             >
//               <Text>Department Head</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="p-3"
//               onPress={() => handleRoleChange("Expert")}
//             >
//               <Text>Department Employee</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Department Dropdown */}
//         {role !== "Admin" && (
//           <View className="mb-6">
//             <Text className="text-gray-700 mb-2">Department</Text>
//             <View className="border rounded-lg">
//               <TouchableOpacity
//                 className="p-3"
//                 onPress={() => handleDepartmentChange("Public Health and Sanitation")}
//               >
//                 <Text>Public Health and Sanitation</Text>
//               </TouchableOpacity>
//               {/* Add more departments similarly */}
//             </View>
//           </View>
//         )}

//         {/* Class Type Dropdown */}
//         {role !== "Head" && role !== "Admin" && (
//           <View className="mb-6">
//             <Text className="text-gray-700 mb-2">Class Type</Text>
//             <View className="border rounded-lg">
//               <TouchableOpacity
//                 className="p-3"
//                 onPress={() => handleClassTypeChange("Class A")}
//               >
//                 <Text>Class A</Text>
//               </TouchableOpacity>
//               {/* Add more class types similarly */}
//             </View>
//           </View>
//         )}

//         <TouchableOpacity onPress={() => Alert.alert('Password reset link here')}>
//           <Text className="text-blue-500 text-right mb-6">Forgot Password?</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={handleLogin}
//           className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
//         >
//           <Text className="text-center text-white">Login</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import LogoImage from '../../assets/images/Logo.png'
import { Picker } from '@react-native-picker/picker';


export default function DepartmentLogin() {
  const [role, setRole] = useState("Head");
  const [department, setDepartment] = useState("");
  const [classType, setClassType] = useState("Class A");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    Alert.alert("Login Submitted", `Role: ${role}, Email: ${email}`);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: "#f9fafb" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            width: "100%",
            // maxWidth: 400,
            margin: 0
          }}
        >
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={LogoImage}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          </View>

          {/* Title */}
          <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
            Login to Your Account
          </Text>

          {/* Error Message */}
          {error ? (
            <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>{error}</Text>
          ) : null}

          {/* Email Input */}
          <TextInput
            placeholder="Enter Email Address"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
            }}
          />

          {/* Password Input */}
          <TextInput
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
            }}
          />

          {/* Role Picker */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              marginBottom: 10,
              backgroundColor: "white",
              justifyContent: "center", // Ensures the text is vertically aligned
              height: 50, // Set a height that fits the text properly
              
            }}
          >
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={{
                color: "#374151", // Visible text color
                height: 50, // Ensures the picker is the same height as the box
                paddingHorizontal: 10, // Adds horizontal padding for better spacing
              }}
              dropdownIconColor="#374151" // Dropdown arrow color
            >
              <Picker.Item label="Platform Admin" value="Admin" />
              <Picker.Item label="Department Employee" value="Expert" />
              <Picker.Item label="Department Head" value="Head" />
            </Picker>
          </View>

          {/* Department Picker */}
          {role !== "Admin" && (
            <View
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 8,
                marginBottom: 10,
                backgroundColor: "white",
                justifyContent: "center",
                height: 50, // Same height as the other input boxes
              }}
            >
              <Picker
                selectedValue={department}
                onValueChange={(itemValue) => setDepartment(itemValue)}
                style={{
                  color: "#374151", // Visible text color
                  height: 50, // Ensures the picker is the same height as the box
                  paddingHorizontal: 10, // Adds horizontal padding
                }}
                dropdownIconColor="#374151" // Dropdown arrow color
              >
                <Picker.Item label="Select Department" value="" />
                <Picker.Item label="Public Health and Sanitation" value="Public Health and Sanitation" />
                <Picker.Item label="Public Works" value="Public Works" />
                <Picker.Item label="Environment and Parks" value="Environment and Parks" />
                <Picker.Item label="Education" value="Education" />
                <Picker.Item label="Water Supply and Sewage" value="Water Supply and Sewage" />
                <Picker.Item label="Housing and Urban Poverty Alleviation" value="Housing and Urban Poverty Alleviation" />
                <Picker.Item label="Legal and General Administration" value="Legal and General Administration" />
                <Picker.Item label="Fire Services" value="Fire Services" />
                <Picker.Item label="Finance and Accounts" value="Finance and Accounts" />
                <Picker.Item label="Urban Planning and Development" value="Urban Planning and Development" />
              </Picker>
            </View>
          )}

          {/* Class Type Picker */}
          {role !== "Head" && role !== "Admin" && (
            <View
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 8,
                marginBottom: 10,
                backgroundColor: "white",
                justifyContent: "center",
                height: 55, // Same height as the other input boxes
              }}
            >
              <Picker
                selectedValue={classType}
                onValueChange={(itemValue) => setClassType(itemValue)}
                style={{
                  color: "#374151", // Visible text color
                  height: 50, // Ensures the picker is the same height as the box
                  paddingHorizontal: 10, // Adds horizontal padding
                }}
                dropdownIconColor="#374151" // Dropdown arrow color
              >
                <Picker.Item label="Select Class Type" value="" />
                <Picker.Item label="Class A" value="Class A" />
                <Picker.Item label="Class B" value="Class B" />
                <Picker.Item label="Class C" value="Class C" />
                <Picker.Item label="Class D" value="Class D" />
              </Picker>
            </View>
          )}


          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => Alert.alert("Password Reset", "Password reset link will be sent.")}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ color: "#3b82f6", textAlign: "right" }}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: "#3b82f6",
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
