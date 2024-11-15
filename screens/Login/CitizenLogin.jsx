import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db, collection } from "../Firebase/config.js";
import Logo from "../assets/Logo.png";
import { doc, getDoc } from "firebase/firestore";

export default function CitizenLogin() {
  const [role, setRole] = useState("Citizen");
  const [department, setDepartment] = useState("");
  const [classType, setClassType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === "Head") {
      setClassType("Class A");
    } else {
      setClassType(""); // Clear classType if role is not "Head"
    }
  };

  const handleLogin = async () => {
    setError("");

    try {
      if (role === "Citizen") {
        const documentRef = doc(db, "departments", "citizens");
        const docSnap = await getDoc(documentRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const dbPass = data.citizens[email]?.password;
          const name = data.citizens[email]?.Name;

          if (dbPass === password) {
            sessionStorage.setItem("name", name);
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("isLoggedIn", true);

            navigation.navigate("Home");
          } else {
            setError("Incorrect email or password. Please try again.");
          }
        } else {
          setError("No such department found!");
        }
      } else if (role === "Admin") {
        sessionStorage.setItem("name", "Platform Admin");
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("classType", "Platform Admin");
        sessionStorage.setItem("isLoggedIn", true);

        navigation.navigate("Home");
      } else {
        const documentRef = doc(db, "departments", department);
        const docSnap = await getDoc(documentRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const dbPass = data.employees[email]?.password;
          const name = data.employees[email]?.Name;

          if (dbPass === password) {
            sessionStorage.setItem("name", name);
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("department", department);
            sessionStorage.setItem("classType", classType);
            sessionStorage.setItem("isLoggedIn", true);

            navigation.navigate("Home");
          } else {
            setError("Incorrect email or password. Please try again.");
          }
        } else {
          setError("No such department found!");
        }
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <View className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <View className="justify-center items-center mb-6">
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image source={Logo} className="w-24 h-24 rounded-full" />
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-center mb-4">Login to Your Account</Text>

        {error && (
          <Text className="mb-4 text-red-500 text-center">{error}</Text>
        )}

        <TextInput
          placeholder="Enter Email Address"
          value={email}
          onChangeText={setEmail}
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <TextInput
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
        />

        {/* Role Dropdown */}
        <View className="mb-6">
          <TextInput
            editable={false}
            value={role}
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text className="text-right mb-6 text-blue-500">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Text className="text-white text-center">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
