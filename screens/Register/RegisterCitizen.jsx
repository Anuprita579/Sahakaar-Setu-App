import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, doc, setDoc } from "../Firebase/config";
import Logo from "../assets/Logo.png";
import Loader from "../Components/Loader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterCitizen = () => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleNewPasswordChange = (e) => setNewPassword(e);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e);

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleToggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validate = () => {
    const validationErrors = {};
    if (!fullName.trim()) validationErrors.fullName = "Full Name is required";
    if (!gender.trim()) validationErrors.gender = "Gender is required";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) validationErrors.email = "Email is required";
    else if (!emailPattern.test(email)) validationErrors.email = "Email is invalid";

    const phonePattern = /^\d{10}$/;
    if (!phone.trim()) validationErrors.phone = "Phone number is required";
    else if (!phonePattern.test(phone)) validationErrors.phone = "Phone number is invalid";

    if (newPassword !== confirmPassword) validationErrors.password = "Passwords do not match";

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

    const registerDate = new Date().toISOString();

    const citizenDetails = {
      Name: fullName.trim(),
      gender: gender.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: newPassword,
      registerDate,
    };

    try {
      const departmentRef = doc(db, "departments", "citizens");

      await setDoc(departmentRef, {
        citizens: {
          [email.trim()]: citizenDetails,
        },
      }, { merge: true });

      console.log("Citizen registered successfully");
      navigation.navigate("Login");

      // Clear form fields and errors
      setFullName("");
      setGender("");
      setEmail("");
      setPhone("");
      setErrors({});
    } catch (e) {
      console.error("Error adding citizen: ", e);
      Alert.alert("Error", "An error occurred during registration");
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
        {/* Logo */}
        <View className="flex justify-center mb-6">
          <Image source={Logo} style={{ width: 96, height: 96, borderRadius: 48 }} />
        </View>

        <Text className="text-2xl font-bold text-center mb-4">Register Citizen</Text>

        <View className="mb-4">
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your Full Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          {errors.fullName && <Text className="text-red-500 text-xs mt-1">{errors.fullName}</Text>}
        </View>

        <View className="mb-4">
          <TextInput
            value={gender}
            onChangeText={setGender}
            placeholder="Select Gender"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          {errors.gender && <Text className="text-red-500 text-xs mt-1">{errors.gender}</Text>}
        </View>

        <View className="mb-4">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your Email"
            keyboardType="email-address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>}
        </View>

        <View className="mb-4">
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          {errors.phone && <Text className="text-red-500 text-xs mt-1">{errors.phone}</Text>}
        </View>

        <View className="mb-4 relative">
          <TextInput
            value={newPassword}
            onChangeText={handleNewPasswordChange}
            placeholder="Enter New Password"
            secureTextEntry={!showPassword}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <TouchableOpacity onPress={handleTogglePasswordVisibility} className="absolute right-3 top-2">
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 relative">
          <TextInput
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            placeholder="Confirm New Password"
            secureTextEntry={!showConfirmPassword}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <TouchableOpacity onPress={handleToggleConfirmPasswordVisibility} className="absolute right-3 top-2">
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>}

        <View className="flex justify-center mb-4">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            <Text className="text-center text-white">Register</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 text-center">
          <TouchableOpacity onPress={() => navigation.navigate("AdminCitizens")}>
            <Text className="text-blue-500 hover:underline text-sm">Back to Citizens</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterCitizen;
