import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { tw } from "nativewind";

const screenWidth = Dimensions.get("window").width;

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { projectId } = route.params;
  const department = sessionStorage.getItem("department");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskDocRef = doc(db, "tasks", department);
        const taskDoc = await getDoc(taskDocRef);

        if (taskDoc.exists()) {
          const taskData = taskDoc.data().Tasks || {};
          const taskArray = Object.values(taskData)
            .map((task) => ({
              taskId: task.taskId || "",
              taskName: task.taskName || "",
              deadline: task.deadline || "",
              description: task.description || "",
              startDate: task.startDate || "",
              endDate: task.endDate || "",
              priority: task.priority || "",
              statusUpdates: task.statusUpdates || "",
              location: task.location || "",
              projectId: task.projectId || "",
              progress: task.progress || "",
            }))
            .filter((task) => task.taskId.startsWith(projectId));
          setTasks(taskArray);
        }
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [department]);

  const handleViewTask = (taskId) => {
    navigation.navigate("TaskDetails", { projectId, taskId });
  };

  const handleEditTask = (taskId) => {
    navigation.navigate("EditTask", { projectId, taskId });
  };

  const handleAddTasks = () => {
    navigation.navigate("AddTasks", { projectId });
  };

  const totalTasks = tasks.length;
  const priorityCounts = {
    High: tasks.filter((task) => task.priority === "High").length,
    Medium: tasks.filter((task) => task.priority === "Medium").length,
    Low: tasks.filter((task) => task.priority === "Low").length,
  };

  const progressData = [
    { name: "Not Started", value: tasks.filter((task) => task.progress === "Not Started").length },
    { name: "In Progress", value: tasks.filter((task) => task.progress === "In Progress").length },
    { name: "Completed", value: tasks.filter((task) => task.progress === "Completed").length },
  ];

  return (
    <ScrollView style={tw`bg-gray-100 flex-1 p-4`}>
      {/* TASK STATISTICS */}
      <View style={tw`flex-row justify-between mb-6`}>
        <View style={tw`bg-purple-600 rounded-lg p-4 w-1/3`}>
          <Text style={tw`text-white text-lg font-bold`}>Total Tasks</Text>
          <Text style={tw`text-white text-2xl`}>{totalTasks}</Text>
        </View>
        <View style={tw`bg-purple-600 rounded-lg p-4 w-1/3`}>
          <Text style={tw`text-white text-lg font-bold`}>Priority Summary</Text>
          <Text style={tw`text-white`}>High: {priorityCounts.High}</Text>
          <Text style={tw`text-white`}>Medium: {priorityCounts.Medium}</Text>
          <Text style={tw`text-white`}>Low: {priorityCounts.Low}</Text>
        </View>
        <View style={tw`bg-purple-600 rounded-lg p-4 w-1/3`}>
          <Text style={tw`text-white text-lg font-bold mb-2`}>Task Progress</Text>
          <PieChart
            data={progressData.map((item, index) => ({
              name: item.name,
              population: item.value,
              color: ["#00C49F", "#FFBB28", "#FF8042"][index % 3],
              legendFontColor: "#7F7F7F",
              legendFontSize: 12,
            }))}
            width={screenWidth / 3}
            height={150}
            chartConfig={{
              color: () => `rgba(255, 255, 255, 0.5)`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"0"}
          />
        </View>
      </View>

      {/* TASK TABLE */}
      <View style={tw`bg-white rounded-lg shadow p-4`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-xl font-semibold`}>Task Details</Text>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 rounded`}
            onPress={handleAddTasks}
          >
            <Text style={tw`text-white`}>+ Add Tasks</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.taskId}
          ListEmptyComponent={
            <Text style={tw`text-center text-gray-500 mt-4`}>No tasks available</Text>
          }
          renderItem={({ item }) => (
            <View style={tw`flex-row justify-between border-b p-2`}>
              <Text style={tw`flex-1`}>{item.taskName}</Text>
              <View style={tw`flex-row space-x-2`}>
                <TouchableOpacity onPress={() => handleViewTask(item.taskId)}>
                  <MaterialIcons name="visibility" size={24} color="#1E90FF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEditTask(item.taskId)}>
                  <MaterialIcons name="edit" size={24} color="#FFD700" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}
