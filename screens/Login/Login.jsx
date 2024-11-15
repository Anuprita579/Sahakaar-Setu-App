import React, { useState } from "react";
import { auth, db, collection } from "../Firebase/config.js";
import Logo from "../assets/Logo.png";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { Text, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Link } from "@react-navigation/native";

export default function Login() {
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
      setClassType("");
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
    <View className="flex-1 justify-center items-center bg-white px-4 py-6">
      <View className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <View className="flex justify-center mb-6">
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image source={Logo} style={{ width: 96, height: 96, borderRadius: 50 }} />
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-center mb-4">Login to Your Account</Text>

        {error && (
          <Text className="mb-4 text-red-500 text-center">{error}</Text>
        )}

        <View>
          <TextInput
            placeholder="Enter Email Address"
            value={email}
            onChangeText={setEmail}
            className="w-full p-4 mb-4 border rounded-lg"
          />
          <TextInput
            placeholder="Enter Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="w-full p-4 mb-4 border rounded-lg"
          />

          <View className="mb-6">
            <TextInput
              value={role}
              onChangeText={handleRoleChange}
              className="w-full p-4 mb-4 border rounded-lg"
              placeholder="Select Role"
            />
          </View>

          {(role !== "Admin" && role !== "Citizen") && (
            <View className="mb-6">
              <TextInput
                value={department}
                onChangeText={setDepartment}
                className="w-full p-4 mb-4 border rounded-lg"
                placeholder="Select Department"
              />
            </View>
          )}

          {(role !== "Head" && role !== "Admin" && role !== "Citizen") && (
            <View className="mb-6">
              <TextInput
                value={classType}
                onChangeText={setClassType}
                className="w-full p-4 mb-4 border rounded-lg"
                placeholder="Select Class Type"
              />
            </View>
          )}

          <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")} className="text-right mb-6">
            <Text className="text-blue-500">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            className="w-full bg-blue-500 text-white py-2 rounded-lg mb-6"
          >
            <Text className="text-center text-white">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
