import React, { useState } from "react";
import { View, Text, TextInput, Button, Picker, Image, Alert, ScrollView } from "react-native";
import { db, doc, setDoc } from "../Firebase/config.js";
import Logo from "../assets/Logo.png";
import Loader from '../Components/Loader.jsx';

function DepartmentRegistration() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const generateRandomPassword = (length = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const validate = () => {
    const errors = {};

    if (!fullName.trim()) {
      errors.fullName = "Full Name is required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!departmentName.trim()) {
      errors.departmentName = "Department Name is required";
    }

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const randomPassword = generateRandomPassword();
    console.log("Generated Random Password:", randomPassword);
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Department Name:", departmentName);

    const userDetails = {
      Name: fullName.trim(),
      password: randomPassword,
      role: "Group A",
    };

    try {
      const departmentRef = doc(db, "departments", departmentName.trim());

      // Check if the department already exists and add the employee under their email key
      await setDoc(
        departmentRef,
        {
          employees: {
            [email.trim()]: userDetails,
          },
        },
        { merge: true }
      );

      // Send data to the API
      const response = await fetch(
        "https://sahkaar-setu-api-10pj.onrender.com/api/email_user/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: randomPassword,
            name: fullName.trim(),
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Email sent successfully");
      } else {
        setErrors("API call failed:", response.statusText);
      }

      // Clear form fields and errors
      setFullName("");
      setEmail("");
      setDepartmentName("");
      setErrors({});
    } catch (e) {
      console.error("Error adding document or API call: ", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}>
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        <Image source={Logo} style={{ width: 96, height: 96, borderRadius: 48 }} />
      </View>

      <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 16 }}>Department Registration</Text>

      <View style={{ marginBottom: 12 }}>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 4 }}
        />
        {errors.fullName && <Text style={{ color: "red", marginTop: 4 }}>{errors.fullName}</Text>}
      </View>

      <View style={{ marginBottom: 12 }}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 4 }}
        />
        {errors.email && <Text style={{ color: "red", marginTop: 4 }}>{errors.email}</Text>}
      </View>

      <View style={{ marginBottom: 12 }}>
        <Picker
          selectedValue={departmentName}
          onValueChange={(itemValue) => setDepartmentName(itemValue)}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 4 }}
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
        {errors.departmentName && <Text style={{ color: "red", marginTop: 4 }}>{errors.departmentName}</Text>}
      </View>

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}

export default DepartmentRegistration;