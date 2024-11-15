import React, { useState } from "react";
import { auth, db, collection } from "../Firebase/config.js";
import Logo from "../assets/Logo.png";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Link } from "react-router-native";

export default function AdminLogin() {
  const [role, setRole] = useState("Admin");
  const [department, setDepartment] = useState("");
  const [classType, setClassType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole === "Head") {
      setClassType("Class A");
    } else {
      setClassType("");
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleLogin = async () => {
    setError("");

    try {
      console.log(role);

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

            console.log("Login successful");
            navigation.navigate("Home");
          } else {
            setError("Incorrect email or password. Please try again.");
          }
        } else {
          setError("No such department found!");
          console.log("No such document!");
        }
      } else if (role === "Admin") {
        sessionStorage.setItem("name", "Platform Admin");
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("classType", "Platform Admin");
        sessionStorage.setItem("isLoggedIn", true);

        console.log("Admin login successful");
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

            console.log("Login successful");
            navigation.navigate("Home");
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

  return (
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <View className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <View className="flex justify-center mb-6">
          <Link to="/">
            <Image source={Logo} style={{ width: 96, height: 96, borderRadius: 48 }} />
          </Link>
        </View>

        <Text className="text-2xl font-bold text-center mb-4">Login to Your Account</Text>

        {error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        <TextInput
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Enter Email Address"
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
        <TextInput
          value={password}
          onChangeText={handlePasswordChange}
          placeholder="Enter Password"
          secureTextEntry
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />

        <View className="mb-6">
          <TextInput
            value={role}
            editable={false}
            className="w-full px-4 py-2 border rounded-lg bg-gray-200 mb-4"
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text className="text-blue-500 text-right mb-6">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          className="w-full bg-blue-500 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Text className="text-white text-center">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
