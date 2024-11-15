import React, { useState } from "react";
import { auth, db, collection } from "../Firebase/config.js";
import Logo from "../assets/Logo.png";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

export default function DepartmentLogin() {
  const [role, setRole] = useState("Head");
  const [department, setDepartment] = useState("");
  const [classType, setClassType] = useState("Class A");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    // Automatically set classType to "Class A" if role is "Head"
    if (selectedRole === "Head") {
      setClassType("Class A");
    } else {
      setClassType(""); // Clear classType if role is not "Head"
    }
  };

  const handleDepartmentChange = (selectedDepartment) => {
    setDepartment(selectedDepartment);
  };

  const handleClassTypeChange = (selectedClassType) => {
    setClassType(selectedClassType);
  };

  const handleLogin = async () => {
    setError("");

    try {
      if (role === "Admin") {
        // Set session storage for Admin (Note: AsyncStorage can be used for persistent storage in React Native)
        // AsyncStorage.setItem("name", "Platform Admin");
        // AsyncStorage.setItem("email", email);
        // AsyncStorage.setItem("classType", "Platform Admin");
        // AsyncStorage.setItem("isLoggedIn", "true");

        console.log("Admin login successful");
        navigation.navigate('Home'); // Adjust the navigation target as needed
      } else {
        const documentRef = doc(db, "departments", department);
        const docSnap = await getDoc(documentRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const dbPass = data.employees[email]?.password;
          const name = data.employees[email]?.Name;

          if (dbPass === password) {
            // Save user details to AsyncStorage if necessary
            // AsyncStorage.setItem("name", name);
            // AsyncStorage.setItem("email", email);
            // AsyncStorage.setItem("department", department);
            // AsyncStorage.setItem("classType", classType);
            // AsyncStorage.setItem("isLoggedIn", "true");

            console.log("Login successful");
            navigation.navigate('Home');
          } else {
            setError("Incorrect email or password. Please try again.");
          }
        } else {
          setError("No such department found!");
          console.log("No such document!");
        }
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
      console.error("Login error:", err);
    }
  };

  const getRegisterLink = () => {
    switch (role) {
      case "Admin":
        return "/register-department";
      case "Head":
        return "/register-department";
      default:
        return "";
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[350px]">
        <View className="flex justify-center mb-6">
          <Image source={Logo} className="w-24 h-24 bg-gray-300 rounded-full" />
        </View>

        <Text className="text-2xl font-bold text-center mb-4">Login to Your Account</Text>

        {error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Email Address"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter Password"
          secureTextEntry
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {/* Role Dropdown */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2">Role</Text>
          <View className="border rounded-lg">
            <TouchableOpacity
              className="p-3"
              onPress={() => handleRoleChange("Admin")}
            >
              <Text>Platform Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-3"
              onPress={() => handleRoleChange("Head")}
            >
              <Text>Department Head</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-3"
              onPress={() => handleRoleChange("Expert")}
            >
              <Text>Department Employee</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Department Dropdown */}
        {role !== "Admin" && (
          <View className="mb-6">
            <Text className="text-gray-700 mb-2">Department</Text>
            <View className="border rounded-lg">
              <TouchableOpacity
                className="p-3"
                onPress={() => handleDepartmentChange("Public Health and Sanitation")}
              >
                <Text>Public Health and Sanitation</Text>
              </TouchableOpacity>
              {/* Add more departments similarly */}
            </View>
          </View>
        )}

        {/* Class Type Dropdown */}
        {role !== "Head" && role !== "Admin" && (
          <View className="mb-6">
            <Text className="text-gray-700 mb-2">Class Type</Text>
            <View className="border rounded-lg">
              <TouchableOpacity
                className="p-3"
                onPress={() => handleClassTypeChange("Class A")}
              >
                <Text>Class A</Text>
              </TouchableOpacity>
              {/* Add more class types similarly */}
            </View>
          </View>
        )}

        <TouchableOpacity onPress={() => Alert.alert('Password reset link here')}>
          <Text className="text-blue-500 text-right mb-6">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Text className="text-center text-white">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
