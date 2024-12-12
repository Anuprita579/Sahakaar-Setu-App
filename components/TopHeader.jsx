import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import PopoverComponent from "../commonComponent/PopoverComponent";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TopHeader = ({ language, changeLanguage, userName, setUserName, navigate }) => {
  const navigation = useNavigation();
  const [popoverOpen, setPopoverOpen] = useState(false); // State to manage the popover visibility

  // Toggle popover function
  const togglePopover = (isOpen) => setPopoverOpen(isOpen);

  // Function to handle navigation to the profile page
  const handleProfileNavigation = () => {
    navigation.navigate("Profile"); // Replace "Profile" with your actual profile screen name
  };

  // Function to handle logout (clear session and navigate to login screen)
  const handleLogout = async () => {
    // Clear AsyncStorage items related to the session
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('userDepartment');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('name');
    await AsyncStorage.removeItem('type');
    
    // Update the state for the logged-out user
    setUserName("Login");

    // Navigate to the login screen or bottom stack
    navigation.navigate("BottomStack"); // Replace with actual login screen
  };

  // Function to handle login as Citizen and set username from AsyncStorage
  const handleLoginAsCitizen = async () => {
    // Navigate to CitizenLogin screen
    navigation.navigate("CitizenLogin"); // Replace with the actual path for the CitizenLogin screen

    // Assuming after successful login, the username is stored in AsyncStorage
    const storedUserName = await AsyncStorage.getItem('name');
    console.log(storedUserName);
    
    if (storedUserName) {
      // Set the userName state after login
      setUserName(storedUserName);
    }
  };

  // Function to handle login as Employee and set username from AsyncStorage
  const handleLoginAsEmployee = async () => {
    // Navigate to EmployeeLogin screen
    navigation.navigate("DepartmentLogin"); // Replace with the actual path for the EmployeeLogin screen

    // Assuming after successful login, the username is stored in AsyncStorage
    const storedUserName = await AsyncStorage.getItem('userName');
    
    if (storedUserName) {
      // Set the userName state after login
      setUserName(storedUserName);
    }
  };

  useEffect(() => {
    // Check if the user is already logged in on component mount
    const checkUserLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        const userName = await AsyncStorage.getItem('userName');
        setUserName(userName); // Set userName from AsyncStorage if logged in as employee
      } else {
        const name = await AsyncStorage.getItem('name');
        if (name) {
          setUserName(name); // Set userName from AsyncStorage if logged in as citizen
        }
      }
    };
    

    checkUserLogin();
  }, []);

  return (
    <View className="flex flex-row bg-sky-950 justify-center py-2">
      <View className="flex flex-row text-white gap-6 items-center justify-end">
        {userName !== "Login" ? (
          <PopoverComponent
            open={popoverOpen}
            togglePopover={togglePopover}
            buttonContent={`Welcome back, ${userName}`}
            buttonClassName="bg-white text-black py-1 px-3 rounded"
            popoverContent={
              <FlatList
                className="bg-slate-50"
                data={[
                  { key: "View Profile", action: handleProfileNavigation },
                  { key: "Logout", action: handleLogout },
                ]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={item.action} // Handle click for profile or logout
                    className="px-4 py-2 hover:bg-gray-300 rounded"
                  >
                    <Text className="text-gray-700 text-sm">
                      {item.key}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            }
          />
        ) : (
          <PopoverComponent
            open={popoverOpen}
            togglePopover={togglePopover}
            buttonContent="Login"
            buttonClassName="bg-white text-black py-1 px-3 rounded"
            popoverContent={
              <FlatList
                className="bg-slate-50"
                data={[
                  { key: "Citizen", action: handleLoginAsCitizen }, // Updated to handle login as Citizen
                  { key: "Employee", action: handleLoginAsEmployee }, // Updated to handle login as Employee
                ]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={item.action} // Handle click for Citizen login or Employee login
                    className="px-4 py-2 hover:bg-gray-300 rounded"
                  >
                    <Text className="text-gray-700 text-sm">
                      Login as {item.key}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            }
          />
        )}

        <TouchableOpacity
          className="bg-white text-black py-1 px-3 rounded"
          onPress={() => navigate("/register-citizen")}
        >
          <Text>Register as Citizen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopHeader;
