import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useNavigate } from "@react-navigation/native";
import { PieChart } from "react-native-svg-charts"; // You can install this package
import { db } from "../Firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filterProjectId, setFilterProjectId] = useState("");
  const [filterProjectName, setFilterProjectName] = useState("");
  const navigate = useNavigate();
  const department = sessionStorage.getItem("department");

  // Pie chart data colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectRef = doc(db, "projects", department.trim());
        const docSnap = await getDoc(projectRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const projectsData = data.Projects;
          const projectList = [];

          for (const [projectName, projectDetails] of Object.entries(projectsData)) {
            projectList.push({
              projectName,
              projectId: projectDetails.projectID,
              department: department,
              status: projectDetails.currentProjectStatus,
              startDate: projectDetails.projectStartDate,
              endDate: projectDetails.projectEndDate,
              subTaskStatus: projectDetails.subTaskStatus,
            });
          }

          setProjects(projectList);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, []);

  const handleViewDetails = (projectId) => {
    navigate(`/dashboard/projects/details/${projectId}`);
  };

  const handleViewTasks = (projectId) => {
    navigate(`/dashboard/tasks/${projectId}`);
  };

  const filteredProjects = projects.filter((project) => {
    return (
      project.projectId.toLowerCase().includes(filterProjectId.toLowerCase()) &&
      project.projectName.toLowerCase().includes(filterProjectName.toLowerCase())
    );
  });

  const pieChartData = [
    { name: "Completed", value: projects.filter(p => p.status === "Completed").length },
    { name: "Ongoing", value: projects.filter(p => p.status === "Ongoing").length },
    { name: "Pending", value: projects.filter(p => p.status === "Pending").length },
  ];

  return (
    <View className="p-8 bg-gray-100 mb-4">
      {/* Top Metrics Section */}
      <View className="flex-row justify-between space-x-4">
        <View className="bg-purple-600 text-white rounded-lg p-6 w-1/3">
          <Text className="text-2xl font-bold mb-2">Total Projects</Text>
          <Text className="text-sm">{projects.length}</Text>
          <Text className="text-2xl font-bold mb-2">Budget</Text>
        </View>
        <View className="bg-purple-600 text-white rounded-lg p-6 w-1/3">
          <Text className="text-2xl font-bold mb-2">Department Metrics</Text>
          <Text className="text-sm">Metrics related to project status.</Text>
        </View>
        <View className="bg-purple-600 text-white rounded-lg p-6 w-1/3">
          <Text className="text-2xl font-bold mb-2">Project Breakdown</Text>
          <PieChart
            style={{ height: 200, width: 200 }}
            data={pieChartData}
            innerRadius="40%"
            outerRadius="80%"
            fill="#8884d8"
          />
        </View>
      </View>

      {/* Project Table Section */}
      <View className="p-4 rounded-md shadow-md">
        <Text className="text-xl font-bold text-gray-800 mb-6">Project Table</Text>

        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row space-x-4">
            <TextInput
              placeholder="Project ID"
              className="border rounded-md px-2 py-1 text-sm text-gray-700"
              value={filterProjectId}
              onChangeText={setFilterProjectId}
            />
            <TextInput
              placeholder="Project Name"
              className="border rounded-md px-2 py-1 text-sm text-gray-700"
              value={filterProjectName}
              onChangeText={setFilterProjectName}
            />
          </View>
        </View>

        <View className="bg-white rounded-lg shadow overflow-x-auto">
          <FlatList
            data={filteredProjects}
            keyExtractor={(item) => item.projectId}
            renderItem={({ item }) => (
              <View className="bg-white border-b hover:bg-gray-50">
                <View className="flex-row py-3 px-4">
                  <Text className="w-1/6">{item.projectId}</Text>
                  <Text className="w-1/3">{item.projectName}</Text>
                  <Text className="w-1/6">{item.status}</Text>
                  <Text className="w-1/6">{item.startDate}</Text>
                  <Text className="w-1/6">{item.endDate}</Text>
                  <TouchableOpacity
                    onPress={() => handleViewTasks(item.projectId)}
                    className="text-blue-600 hover:underline"
                  >
                    <Text>View Tasks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleViewDetails(item.projectId)}
                    className="text-blue-600 hover:underline"
                  >
                    <Text>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}
