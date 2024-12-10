import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../Firebase/config"; // Import Firebase config
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    gender: '',
    hireDate: '',
    designation: '',
  });
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the department and email from AsyncStorage
        const department = await AsyncStorage.getItem('userDepartment');
        const email = await AsyncStorage.getItem('userEmail');

        if (!department || !email) {
          setError('User department or email not found');
          return;
        }

        // Reference to the department document in Firestore
        const departmentRef = doc(db, "departments", department);
        const docSnap = await getDoc(departmentRef);

        if (docSnap.exists()) {
          const departmentData = docSnap.data();
          const employees = departmentData.employees; // Access employees field

          // Check if employee exists
          if (employees && employees[email]) {
            const employee = employees[email];

            // Set the retrieved employee data into state
            setUserData({
              name: employee.Name,
              email: employee.email,
              role: employee.role,
              phone: employee.phone,
              gender: employee.gender,
              hireDate: employee.hireDate,
              designation: employee.designation,
            });

            setLoading(false); // Set loading to false after data is fetched
          } else {
            setError('Employee not found in this department');
            setLoading(false);
          }
        } else {
          setError('Department not found');
          setLoading(false);
        }
      } catch (err) {
        setError('Error fetching user data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserData(); // Call the function to fetch data
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600 text-lg text-center">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-center items-center pt-5">
        <View className="w-4/5 bg-white p-5 rounded-lg shadow-md mb-5">
          <Image
            source={{ uri: 'https://p7.hiclipart.com/preview/442/17/110/computer-icons-user-profile-male-user-thumbnail.jpg' }}
            className="w-24 h-24 rounded-full self-center mb-5"
          />
          <Text className="text-lg mb-2 text-gray-700">Name: {userData.name}</Text>
          <Text className="text-lg mb-2 text-gray-700">Email: {userData.email}</Text>
          <Text className="text-lg mb-2 text-gray-700">Role: {userData.role}</Text>
          <Text className="text-lg mb-2 text-gray-700">Phone: {userData.phone}</Text>
          <Text className="text-lg mb-2 text-gray-700">Gender: {userData.gender}</Text>
          <Text className="text-lg mb-2 text-gray-700">Hire Date: {userData.hireDate || "N/A"}</Text>
          <Text className="text-lg mb-2 text-gray-700">Designation: {userData.designation}</Text>
          <TouchableOpacity className="bg-teal-400 py-2 px-4" onPress={() => navigation.navigate("DepartmentInfo")}>
            <Text> View Department Information</Text>
          </TouchableOpacity>
        </View>
      </View>


      
    </ScrollView>
  );
};

export default ProfileScreen;