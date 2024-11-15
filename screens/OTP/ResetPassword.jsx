import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { EyeIcon, EyeOffIcon } from "react-native-heroicons/outline";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/config"; // Ensure your Firebase config is set up
import Logo from "../assets/Logo.png"; // Replace with your logo path

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    } else if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const email = sessionStorage.getItem("email");
      const departmentName = sessionStorage.getItem("department");

      if (!email || !departmentName) {
        Alert.alert("Error", "Email or department not found.");
        return;
      }

      const departmentRef = doc(db, "departments", departmentName.trim());
      const docSnap = await getDoc(departmentRef);

      if (!docSnap.exists()) {
        Alert.alert("Error", "Department does not exist.");
        return;
      }

      const departmentData = docSnap.data();
      const employees = departmentData.employees || {};

      if (!employees[email]) {
        Alert.alert("Error", "Employee does not exist in the department.");
        return;
      }

      const updatedEmployeeDetails = {
        ...employees[email],
        password: newPassword,
      };

      const updatedEmployees = {
        ...employees,
        [email]: updatedEmployeeDetails,
      };

      await updateDoc(departmentRef, { employees: updatedEmployees });

      Alert.alert("Success", "Password updated successfully.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "Failed to update the password.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-md">
        {/* Logo */}
        <View className="flex justify-center items-center mb-6">
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image
              source={Logo}
              className="w-24 h-24 rounded-full"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-center mb-4">Reset Password</Text>

        {error ? (
          <Text className="mb-4 text-red-500 text-center">{error}</Text>
        ) : null}

        {/* New Password Input */}
        <View className="mb-4 relative">
          <TextInput
            secureTextEntry={!showPassword}
            placeholder="Enter New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? (
              <EyeOffIcon size={24} color="gray" />
            ) : (
              <EyeIcon size={24} color="gray" />
            )}
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View className="mb-6 relative">
          <TextInput
            secureTextEntry={!showConfirmPassword}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3"
          >
            {showConfirmPassword ? (
              <EyeOffIcon size={24} color="gray" />
            ) : (
              <EyeIcon size={24} color="gray" />
            )}
          </TouchableOpacity>
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity
          onPress={handleResetPassword}
          className="w-full bg-blue-500 py-2 rounded-lg"
        >
          <Text className="text-white text-center">Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPassword;
