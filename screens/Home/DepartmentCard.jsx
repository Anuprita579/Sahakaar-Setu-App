import React, { useState } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { motion } from "framer-motion"; // Keep if you're using Framer Motion for animation in React Native

const DepartmentCard = ({
  ministryName = "N/A",
  departments = [],
  backgroundImageUrl = "",
  desc = "No description available.",
  noOfProj = "N/A",
  budgetAllotted = "N/A",
  newsTitle = "No recent news.",
  emailId = "Not provided",
  mobileNo = "Not provided",
}) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  return (
    <View className="overflow-hidden rounded-lg border border-gray-100 p-4 m-4 w-72 bg-white flex flex-col justify-between shadow-lg">

      <View className="flex flex-row justify-between gap-4">
        <View>
          <Text className="text-lg font-bold text-gray-900">{ministryName}</Text>

          <View className="mt-1 text-xs font-medium text-gray-600">
            {departments.length > 2 ? (
              <>
                {departments.slice(0, 2).map((item, index) => (
                  <View key={index} className="list-disc">
                    <Text>{item.label}</Text>
                  </View>
                ))}
                <Text>+ {departments.length - 2} More</Text>
              </>
            ) : (
              departments.map((item, index) => (
                <View key={index} className="list-disc">
                  <Text>{item.label}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>

      <View className="mt-4">
        <Text className={`text-sm text-gray-500 ${showFullDesc ? "" : "line-clamp-3"}`}>
          {desc}
        </Text>
        {!showFullDesc && desc.length > 100 && (
          <TouchableOpacity
            onPress={() => setShowFullDesc(true)}
            className="text-blue-600 mt-2"
          >
            <Text>Read More</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex flex-row justify-between pt-2 pb-2">
        <View className="flex flex-col justify-center items-center bg-slate-50 p-2 rounded-xl border-blue-100 border-2 w-28">
          <Text className="font-semibold">Projects Completed</Text>
          <Text>{noOfProj}</Text>
        </View>

        <View className="flex flex-col justify-center items-center bg-slate-50 p-2 rounded-xl border-blue-100 border-2 w-28">
          <Text className="font-semibold">Budget Allotted</Text>
          <Text>{budgetAllotted}</Text>
        </View>
      </View>

      <View>
        <Text className="flex items-center font-semibold">
          <Text className="w-5 h-5 mr-2">{/* Add icon here if needed */}</Text>
          Recent News
        </Text>
        <TouchableOpacity className="mt-2 px-4 py-2 bg-blue-100 text-black rounded-lg shadow-sm hover:bg-blue-200">
          <Text>{newsTitle}</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6 flex flex-row gap-4">
        <View className="flex flex-col-reverse">
          <Text className="text-sm font-medium text-gray-600">{emailId}</Text>
          <Text className="text-xs text-gray-500">Email</Text>
        </View>

        <View className="flex flex-col-reverse">
          <Text className="text-sm font-medium text-gray-600">{mobileNo}</Text>
          <Text className="text-xs text-gray-500">Phone</Text>
        </View>
      </View>
    </View>
  );
};

export default DepartmentCard;