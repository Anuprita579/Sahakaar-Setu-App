import React from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// import PopoverComponent from "../commonComponents/PopoverComponent"; // Adjust for React Native
// import MenuLayout from "../Components/MenuLayout"; // Ensure compatibility for React Native

const BelowHeader = ({ anchorEl, setAnchorEl }) => {
  const navigation = useNavigation();

  return (
    <View className="flex justify-center bg-blue-400">
      <View className="flex flex-column items-center gap-4 py-2 px-4">
        {/* Logo and Title */}
        <TouchableOpacity
          onPress={() => navigation.navigate("BottomStack")}
          className="flex flex-row items-center"
        >
          <View className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
            <Image
              source={require("../assets/images/Logo.png")}
              alt="Logo"
              className="rounded-full w-8 h-8"
            />
          </View>
          <View>
            <Text className="uppercase font-semibold text-xl text-white">
              Sahkaar Setu
            </Text>
            <Text className="text-xs text-white">
              Govern Smarter, Govern Better
            </Text>
          </View>
        </TouchableOpacity>

        
        

        {/* Popover Menu */}
        {/* <PopoverComponent
          anchorEl={anchorEl}
          handleClick={(e) => setAnchorEl(e.currentTarget)}
          handleClose={() => setAnchorEl(null)}
          buttonContent={ <MaterialIcons name="menu" size={24} color="white" /> }
          buttonId="popover-button"
          buttonStyle={{
            backgroundColor: "transparent",
            elevation: 0,
          }}
          popoverContent={<MenuLayout onClose={() => setAnchorEl(null)} />}
          popoverStyle={{
            marginTop: 15,
            alignSelf: "center",
            marginRight: 50,
          }}
        /> */}

        {/* Join Us Button */}
        {/* <TouchableOpacity
          children="Join Us"
          style={{
            backgroundColor: "#E0A800",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
        >
            <Text>Join us</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default BelowHeader;
