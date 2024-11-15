import React from "react";
import { View, Text } from "react-native";
import { Video } from 'expo-video';

// Correct path to your local video file
const videoUrl = require("../../assets/home_vid.mp4");

const Banner = ({
  txtSpan1,
  txtSpan2,
  desc,
}) => {
  return (
    <View className="relative w-full h-[70vh]">
      {/* Video Background */}
      <Video
        source={videoUrl} // Use the correct video file path
        style={{ width: '100%', height: 250 }}
        shouldPlay
        useNativeControls
      />

      {/* Overlay */}
      <View className="absolute inset-0 bg-white/75 sm:bg-transparent sm:from-white/95 sm:to-white/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"></View>

      {/* Content */}
      <View className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:flex lg:h-full lg:items-center lg:px-8 justify-center">
        <View className="max-w-xl text-center sm:text-left rtl:sm:text-right">
          <Text className="font-extrabold text-[6rem] text-white">
            {txtSpan1 && txtSpan1}
            <Text className="block font-extrabold text-rose-700">
              {txtSpan2 && txtSpan2}
            </Text>
          </Text>

          <Text className="mt-4 max-w-lg sm:text-2xl/relaxed text-white">
            {desc && desc}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Banner;
