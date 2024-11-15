import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/config";
import {
  MaterialIcons,
  CalendarToday,
  LocationOn,
  Assignment,
  AttachMoney,
  FileCopy,
  AssignmentInd,
} from "@expo/vector-icons";
import { tw } from "nativewind";

const TaskDetails = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [task, setTask] = useState(null);
  const { projectId, taskId } = useLocalSearchParams();
  const department = sessionStorage.getItem("department");

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const taskRef = doc(db, "tasks", department);
        const docSnap = await getDoc(taskRef);

        if (docSnap.exists()) {
          const tasksData = docSnap.data().Tasks;
          let taskDetails = null;

          for (const [name, details] of Object.entries(tasksData)) {
            if (details.taskId === taskId) {
              taskDetails = details;
              break;
            }
          }

          if (taskDetails) {
            setTask(taskDetails);
          } else {
            console.log("Task not found!");
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching task details: ", error);
      }
    };

    fetchTaskDetails();
  }, [taskId, department]);

  const Tab = ({ label, icon, index }) => (
    <TouchableOpacity
      style={tw`flex flex-row items-center p-2 border-b-2 ${
        selectedTab === index ? "border-blue-500" : "border-transparent"
      }`}
      onPress={() => setSelectedTab(index)}
    >
      {icon}
      <Text style={tw`ml-2 text-lg text-gray-700`}>{label}</Text>
    </TouchableOpacity>
  );

  if (!task) return <ActivityIndicator size="large" color="#0000ff" />;

  const tabs = [
    { label: "Task Info", icon: <Assignment size={20} color="gray" />, content: renderTaskInfo },
    { label: "Timeline", icon: <CalendarToday size={20} color="gray" />, content: renderTimeline },
    { label: "Employees", icon: <AssignmentInd size={20} color="gray" />, content: renderEmployees },
    { label: "Budget", icon: <AttachMoney size={20} color="gray" />, content: renderBudget },
    { label: "Resources", icon: <LocationOn size={20} color="gray" />, content: renderResources },
    { label: "Progress", icon: <CalendarToday size={20} color="gray" />, content: renderProgress },
    { label: "Documents", icon: <FileCopy size={20} color="gray" />, content: renderDocuments },
  ];

  function renderTaskInfo() {
    return (
      <View>
        <Text style={tw`text-lg font-bold`}>Task Info</Text>
        <Text>{task.taskName}</Text>
        <Text>Location: {task.location || "N/A"}</Text>
        <Text>Priority: {task.priority || "N/A"}</Text>
        <Text>Description: {task.description || "N/A"}</Text>
      </View>
    );
  }

  function renderTimeline() {
    return (
      <View>
        <Text style={tw`text-lg font-bold`}>Timeline</Text>
        <Text>Start Date: {task.startDate || "N/A"}</Text>
        <Text>Deadline: {task.deadline || "N/A"}</Text>
        <Text>End Date: {task.endDate || "N/A"}</Text>
      </View>
    );
  }

  function renderEmployees() {
    return (
      <FlatList
        data={task.assignedEmployees}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={tw`p-2 border-b`}>
            <Text>Name: {item.name || "No name"}</Text>
            <Text>Email: {item.email || "No email"}</Text>
          </View>
        )}
      />
    );
  }

  function renderBudget() {
    return <Text>{task.budget || "No budget details available."}</Text>;
  }

  function renderResources() {
    return (
      <FlatList
        data={task.resources}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={tw`p-2 border-b`}>
            <Text>Item: {item.itemName || "Unknown"}</Text>
            <Text>Quantity: {item.itemQuantity || "Unknown"}</Text>
          </View>
        )}
      />
    );
  }

  function renderProgress() {
    return <Text>{task.progress || "No progress report available."}</Text>;
  }

  function renderDocuments() {
    return <Text>{task.documents || "No documents available."}</Text>;
  }

  return (
    <ScrollView>
      <View style={tw`bg-white shadow-md`}>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} icon={tab.icon} index={index} />
        ))}
      </View>
      <View style={tw`p-4`}>{tabs[selectedTab].content()}</View>
    </ScrollView>
  );
};

export default TaskDetails;
