import React from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import News from "./News";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DepartmentDirectory from "./DepartmentDirectory";
import DepartmentInfo from "./DepartmentInfo";
import AddTask from "../ClassD/AddTask";
import Tasks from "../Task/Tasks";
import Grievance from "../Grievance/Grievance";
import Report from "../Report";
import Help from "../Help"

const HomeScreen = () => {

  return (
    <ScrollView className="bg-slate-100">
      {/* Search Bar */}
      {/* <View className="flex justify-center bg-blue-400">
        <View className="flex flex-column items-center gap-4 py-2 px-4">
          <View className="flex flex-row items-center bg-sky-950 rounded mb-2">
            <TextInput
              placeholder="Search..."
              className="bg-white p-2 text-black w-72 rounded-l"
            />
            <TouchableOpacity
              style={{
                backgroundColor: "rgb(8 47 73)",
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <MaterialIcons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View> */}

      {/* News Section */}
      <View className="mt-6 px-4 bg-slate-100 rounded-lg py-4">
        <Text className="text-3xl font-bold text-center text-black">
          Recent
          <Text className="text-sky-700"> News</Text>
        </Text>
        <News />
      </View>

      {/* Department Directory Section */}
      <View className="mt-6 px-4 bg-white rounded-lg py-4">
        <Text className="text-3xl font-bold text-center text-black mt-10">
          Department
          <Text className="text-sky-700"> Directory</Text>
        </Text>
        <DepartmentDirectory />

      </View>

      <View className="mt-6 px-4 bg-white rounded-lg py-4">
        <Text className="text-3xl font-bold text-center text-black mt-10">
          Tasks 
          {/* <Text className="text-sky-700"> Directory</Text> */}
        </Text>
        <Tasks />
      </View>

      <View className="mt-6 px-4 bg-white rounded-lg py-4">
        <Text className="text-3xl font-bold text-center text-black mt-10">
          Grivence
          {/* <Text className="text-sky-700"> Directory</Text> */}
        </Text>
        <Grievance/>
      </View>


      <AddTask />
      <Report/>
      <Help/>


      

    </ScrollView>
  );
};

export default HomeScreen;