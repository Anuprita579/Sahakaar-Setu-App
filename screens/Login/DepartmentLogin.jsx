import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import LogoImage from '../../assets/images/Logo.png';
import { Picker } from '@react-native-picker/picker';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/config"; // Import Firebase config
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function DepartmentLogin() {
  const [role, setRole] = useState("Head");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation(); // Hook to access navigation

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Get the department document from Firestore
      const departmentRef = doc(db, "departments", department);  // Reference to department document
      const docSnap = await getDoc(departmentRef);  // Fetch document

      if (docSnap.exists()) {
        const departmentData = docSnap.data();
        const employees = departmentData.employees;  // Access the employees field

        // Check if the email exists in employees field
        if (employees && employees[email]) {
          const employee = employees[email];

          // Compare the password
          if (employee.password === password) {
            // If password matches, login is successful
            Alert.alert("Login Success", `Welcome, ${employee.Name}!`);

            // Save login state and user data in AsyncStorage
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('userName', employee.Name);
            await AsyncStorage.setItem('userRole', employee.role);
            await AsyncStorage.setItem('userDepartment', department);
            
            // Navigate to home or main page here
            navigation.navigate("BottomStack");
          } else {
            setError("Incorrect password. Please try again.");
          }
        } else {
          setError("Email not found in this department.");
        }
      } else {
        setError("Department not found.");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
      console.error(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: "#f9fafb" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, width: "100%" }}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image source={LogoImage} style={{ width: 80, height: 80, borderRadius: 40 }} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>Login to Your Account</Text>

          {error && <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>{error}</Text>}

          <TextInput placeholder="Enter Email Address" value={email} onChangeText={setEmail} style={{ borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10, marginBottom: 10 }} />
          <TextInput placeholder="Enter Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10, marginBottom: 10 }} />

          <View style={{ borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, marginBottom: 10, backgroundColor: "white", justifyContent: "center", height: 50 }}>
            <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)} style={{ color: "#374151", height: 50, paddingHorizontal: 10 }} dropdownIconColor="#374151">
              <Picker.Item label="Platform Admin" value="Admin" />
              <Picker.Item label="Department Employee" value="Expert" />
              <Picker.Item label="Department Head" value="Head" />
            </Picker>
          </View>

          {role !== "Admin" && (
            <View style={{ borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, marginBottom: 10, backgroundColor: "white", justifyContent: "center", height: 50 }}>
              <Picker selectedValue={department} onValueChange={(itemValue) => setDepartment(itemValue)} style={{ color: "#374151", height: 50, paddingHorizontal: 10 }} dropdownIconColor="#374151">
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

          <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "#3b82f6", paddingVertical: 12, borderRadius: 8 }}>
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
