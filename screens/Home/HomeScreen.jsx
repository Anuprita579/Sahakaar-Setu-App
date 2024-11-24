import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TouchableNativeFeedback } from "react-native";
import News from "./News";
import MapPlotting from "../../components/MapPlotting";
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="bg-slate-100">

      {/* Banner */}
      {/* <View className="mt-4 px-4">
        <Banner
          txtSpan1="SAHKAAR"
          txtSpan2="SETU"
          desc="Govern Smarter, Govern Better"
        />
      </View> */}


      {/* News Section */}
      <View className="mt-6 px-4 bg-slate-100 rounded-lg py-4">
        <Text className="text-3xl font-bold text-center text-black">
          Recent 
          <Text className="text-sky-700">News</Text>
        </Text>
        <News />
      </View>

      <MapPlotting />

      <TouchableOpacity
        className="bg-blue-500 p-4"
        onPress={() => navigation.navigate("MapPlotting")}
      >
        <Text className="text-white">
            Visit Map
        </Text>
      </TouchableOpacity>


      {/* Footer */}
      <View className="py-4 bg-yellow-500">
        <Text className="text-center text-black  text-xs">
            © 2024 Sahkaar Setu. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  )
}

export default HomeScreen

// DEPARTMENT LOGIN 
// import DepartmentLogin from "../Login/DepartmentLogin"

// <View className="flex-1 justify-center items-center bg-gray-50">
// <Text className="text-3xl font-bold mb-6">Welcome to the Platform</Text>
// <DepartmentLogin />
// </View>