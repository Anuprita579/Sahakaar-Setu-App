import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import PopoverComponent from "../commonComponent/PopoverComponent";
import { useNavigation } from "@react-navigation/native"; // for navigation
import AsyncStorage from '@react-native-async-storage/async-storage';

const TopHeader = ({ language, changeLanguage, isLogin,setIsLogin, navigate }) => {
    const navigation = useNavigation();
    const [anchorElLogin, setAnchorElLogin] = useState(null); // State for login popover
    const [popoverOpen, setPopoverOpen] = useState(false); // State to manage the popover visibility
    // const [isLogin, setIsLogin] = useState(false); // State for login status (default to false)


    // Toggle popover function
    const togglePopover = (isOpen) => setPopoverOpen(isOpen);

    // Function to handle navigation to the profile page
    const handleProfileNavigation = () => {
        navigation.navigate("Profile"); // Replace "Profile" with your actual profile screen name
    };

    // Function to handle logout (clear session and navigate to login screen)
    const handleLogout = () => {
        // You can clear AsyncStorage or use any session management logic here
        AsyncStorage.removeItem('isLoggedIn');
        AsyncStorage.removeItem('userEmail');
        AsyncStorage.removeItem('userName');
        AsyncStorage.removeItem('userRole');
        AsyncStorage.removeItem('userDepartment');
        setIsLogin(false);
        navigation.navigate("BottomStack"); // Replace "Login" with your login screen
        
    };

    return (
        <View className="flex flex-row bg-sky-950 justify-center py-2">
            <View className="flex flex-row text-white gap-6 items-center justify-end">
                {/* <TouchableOpacity>
                    <Text className="text-white">A-</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text className="text-white">A</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text className="text-white">A+</Text>
                </TouchableOpacity> */}

                {isLogin ? (
                    <PopoverComponent
                        open={popoverOpen}
                        togglePopover={togglePopover}
                        buttonContent={`Welcome back, ${isLogin}`}
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
                                    { key: "Citizen", path: "CitizenLogin" },
                                    { key: "Admin", path: "AdminLogin" },
                                    { key: "Department", path: "DepartmentLogin" },
                                    { key: "Employee", path: "EmployeeLogin" },
                                ]}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => navigate(item.path)}
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
                    onClick={() => navigate("/register-citizen")}
                >
                    <Text>Register as Citizen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TopHeader;
