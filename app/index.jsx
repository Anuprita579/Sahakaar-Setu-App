import React from "react";
import { View, Text, ScrollView } from "react-native";
import HeaderComponent from "../components/HeaderComponent";
import Banner from "../components/Home/Banner";
import News from "../components/Home/News";

export default function Index() {
  return (
    <ScrollView className="bg-slate-700">
      {/* Header */}
      <HeaderComponent />

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
          Recent <Text className="text-sky-700">News</Text>
        </Text>
        <News />
      </View>

      {/* Footer */}
      <View className="mt-8 py-4">
        <Text className="text-center text-white text-xs">
          © 2024 Sahkaar Setu. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}
