import React, { useState } from "react";
import { View, Text, TouchableOpacity, Picker, FlatList } from "react-native";
import PopoverComponent from "../commonComponent/PopoverComponent";
import { useNavigation } from "@react-navigation/native";

const TopHeader = ({ language, changeLanguage, isLogin, navigate }) => {
    const navigation = useNavigation();
    const [anchorElLogin, setAnchorElLogin] = useState(null); // State for login popover
    const [popoverOpen, setPopoverOpen] = useState(false); // State to manage the popover visibility

    //   const togglePopover = () => setPopoverOpen((prev) => !prev); // Toggle function
    const togglePopover = (isOpen) => setPopoverOpen(isOpen);

    return (
        <View className="flex flex-row bg-sky-950 justify-center pr-10 py-2">
            <View className="flex-row text-white gap-6 items-center w-4/6 ">
                <TouchableOpacity className="bg-white text-black py-1 px-3 rounded">
                    <Text>Skip to main Content</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text className="text-white">A-</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text className="text-white">A</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text className="text-white">A+</Text>
                </TouchableOpacity>

                {/* Language Selector */}
                {/* <Picker
          selectedValue={language}
          onValueChange={(value) => changeLanguage(value)}
          style={{ color: "white", backgroundColor: "#0369A1" }}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Marathi" value="mr" />
          <Picker.Item label="Hindi" value="hi" />
        </Picker> */}

                {isLogin ? (
                    <TouchableOpacity
                        className="bg-white text-black text-sm py-1 px-3 rounded"
                    >
                        <Text>Welcome back, {isLogin} </Text>
                    </TouchableOpacity>
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
                                    {
                                        key: "User",
                                        path: "CitizenLogin",
                                    },
                                    {
                                        key: "Admin",
                                        path: "AdminLogin",
                                    },
                                    {
                                        key: "Department",
                                        path: "DepartmentLogin",
                                    },
                                    {
                                        key: "Employee",
                                        path: "EmployeeLogin",
                                    },
                                ]}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => navigate(item.path)}
                                        // onPress={() => navigation.navigate("Home")}
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



                    // <Text>Hello</Text>
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
