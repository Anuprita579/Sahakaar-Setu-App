import React, { useState } from "react";
import { View, Text, TextInput, Button, Picker, Alert, Image, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { db, collection, doc, setDoc } from "../Firebase/config.js";
import Logo from "../assets/Logo.png";
import Loader from "../Components/Loader.jsx";

const generateRandomPassword = (length = 12) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
};

const RegisterEmployee = () => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [classType, setClassType] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const validate = () => {
    const validationErrors = {};

    if (!fullName.trim()) {
      validationErrors.fullName = "Full Name is required";
    }

    if (!gender.trim()) {
      validationErrors.gender = "Gender is required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!emailPattern.test(email)) {
      validationErrors.email = "Email is invalid";
    }

    const phonePattern = /^\d{10}$/;
    if (!phone.trim()) {
      validationErrors.phone = "Phone number is required";
    } else if (!phonePattern.test(phone)) {
      validationErrors.phone = "Phone number is invalid";
    }

    if (!designation.trim()) {
      validationErrors.designation = "Designation is required";
    }

    if (!classType.trim()) {
      validationErrors.classType = "Class Type is required";
    }

    return validationErrors;
  };

  const handleSubmit = async () => {
    setLoading(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const randomPassword = generateRandomPassword();
    const departmentName = sessionStorage.getItem("department");

    if (!departmentName) {
      console.error("Department name not found in session storage.");
      setLoading(false);
      return;
    }

    const hireDate = new Date().toISOString();

    const employeeDetails = {
      Name: fullName.trim(),
      gender: gender.trim(),
      email: email.trim(),
      phone: phone.trim(),
      hireDate,
      password: randomPassword,
      role: classType.trim(),
      designation: designation.trim(),
    };

    try {
      const departmentRef = doc(db, "departments", departmentName.trim());

      await setDoc(
        departmentRef,
        {
          employees: {
            [email.trim()]: employeeDetails,
          },
        },
        { merge: true }
      );

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

      console.log("Employee registered successfully");
      navigation.navigate("Employees");

      // Clear form fields and errors
      setFullName("");
      setGender("");
      setEmail("");
      setPhone("");
      setDesignation("");
      setClassType("");
      setErrors({});
    } catch (e) {
      console.error("Error adding employee: ", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <View className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <View className="flex justify-center mb-6">
          <Image source={Logo} style={{ width: 96, height: 96, borderRadius: 48 }} />
        </View>

        <Text className="text-2xl font-bold text-center mb-4">Register Employee</Text>
        <View>
          <TextInput
            placeholder="Employee Full Name"
            value={fullName}
            onChangeText={setFullName}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.fullName && <Text className="text-red-500 text-xs">{errors.fullName}</Text>}

          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
          {errors.gender && <Text className="text-red-500 text-xs">{errors.gender}</Text>}

          <TextInput
            placeholder="Employee Email"
            value={email}
            onChangeText={setEmail}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <Text className="text-red-500 text-xs">{errors.email}</Text>}

          <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && <Text className="text-red-500 text-xs">{errors.phone}</Text>}

          <TextInput
            placeholder="Designation"
            value={designation}
            onChangeText={setDesignation}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.designation && <Text className="text-red-500 text-xs">{errors.designation}</Text>}

          <Picker
            selectedValue={classType}
            onValueChange={setClassType}
            className="w-full px-4 py-2 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Picker.Item label="Select Class" value="" />
            <Picker.Item label="Class B" value="Class B" />
            <Picker.Item label="Class C" value="Class C" />
            <Picker.Item label="Class D" value="Class D" />
          </Picker>
          {errors.classType && <Text className="text-red-500 text-xs">{errors.classType}</Text>}

          <Button title="Register" onPress={handleSubmit} color="#4CAF50" />
        </View>
      </View>
    </View>
  );
};

export default RegisterEmployee;
