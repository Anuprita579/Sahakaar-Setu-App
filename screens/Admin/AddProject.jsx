import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { db, setDoc, doc, collection } from "../Firebase/config";
import { useTailwind } from "nativewind";

const AddProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectID, setProjectID] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [tenderID, setTenderID] = useState("");
  const [tenderIssuedDate, setTenderIssuedDate] = useState("");
  const [tenderClosingDate, setTenderClosingDate] = useState("");
  const [budgetAllocation, setBudgetAllocation] = useState("");

  const department = sessionStorage.getItem("department");
  const navigation = useNavigation();
  const tailwind = useTailwind(); // Initialize NativeWind tailwind utility

  useEffect(() => {
    const savedCoordinates = localStorage.getItem("coordinates");
    if (savedCoordinates) {
      setCoordinates(JSON.parse(savedCoordinates));
      localStorage.removeItem("coordinates"); // Clear the stored coordinates
    }
  }, []);

  const handleSubmit = async () => {
    // Validation
    if (
      !projectName ||
      !projectID ||
      !coordinates.length ||
      !projectStartDate ||
      !projectEndDate ||
      !projectManager ||
      !tenderID ||
      !tenderIssuedDate ||
      !tenderClosingDate ||
      !budgetAllocation
    ) {
      Alert.alert("Validation", "Please fill in all required fields.");
      return;
    }

    if (!department) {
      Alert.alert("Validation", "Department information is missing.");
      return;
    }

    const formattedCoordinates = coordinates.map(([lat, lng]) => ({ lat, lng }));

    const ProjectDetails = {
      projectID,
      formattedCoordinates,
      projectStartDate,
      projectEndDate,
      projectManager,
      tenderID,
      tenderIssuedDate,
      tenderClosingDate,
      budgetAllocation,
      currentProjectStatus: "Pending",
    };

    try {
      const projectRef = doc(db, "projects", department.trim());
      await setDoc(projectRef, {
        Projects: {
          [projectName]: ProjectDetails,
        },
      }, { merge: true });

      navigation.navigate("DashboardProjects"); // Redirect after successful creation
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={tailwind('flex-1 p-8 bg-white')}>
      <Text style={tailwind('text-3xl font-bold text-gray-800 text-center mb-8')}>
        Create New Project
      </Text>

      <View>
        {/* Project Name */}
        <Text style={tailwind('text-gray-700 text-sm font-bold mb-2')}>Project Name</Text>
        <TextInput
          style={tailwind('shadow-sm border border-gray-300 rounded py-3 px-4 text-gray-700 mb-4')}
          value={projectName}
          onChangeText={setProjectName}
        />

        {/* Project ID */}
        <Text style={tailwind('text-gray-700 text-sm font-bold mb-2')}>Project ID</Text>
        <TextInput
          style={tailwind('shadow-sm border border-gray-300 rounded py-3 px-4 text-gray-700 mb-4')}
          value={projectID}
          onChangeText={setProjectID}
        />

        {/* Project Start Date */}
        <Text style={tailwind('text-gray-700 text-sm font-bold mb-2')}>Project Start Date</Text>
        <TextInput
          style={tailwind('shadow-sm border border-gray-300 rounded py-3 px-4 text-gray-700 mb-4')}
          value={projectStartDate}
          onChangeText={setProjectStartDate}
          placeholder="YYYY-MM-DD"
        />

        {/* Project End Date */}
        <Text style={tailwind('text-gray-700 text-sm font-bold mb-2')}>Project End Date</Text>
        <TextInput
          style={tailwind('shadow-sm border border-gray-300 rounded py-3 px-4 text-gray-700 mb-4')}
          value={projectEndDate}
          onChangeText={setProjectEndDate}
          placeholder="YYYY-MM-DD"
        />

        {/* Project Manager */}
        <Text style={tailwind('text-gray-700 text-sm font-bold mb-2')}>Project Manager</Text>
        <TextInput
          style={tailwind('shadow-sm border border-gray-300 rounded py-3 px-4 text-gray-700 mb-4')}
          value={projectManager}
          onChangeText={setProjectManager}
        />

        {/* Tender ID */}
        <Text style={tailwind('text-gray-700 text-sm font-bold mb-2')}>Tender ID</Text>
        <TextInput
          style={tailwind('shadow-sm border border-gray-300 rounded py-3 px-4 text-gray-700 mb-4')}
          value={tenderID}
          onChangeText={setTenderID}
        />

        {/* Tender Issued Date */}
        <Text style={tailwind('text-gray-700 text-sm font-bold mb-2')}>Tender Issued Date</Text>
        <TextInput
          style={tailwind('shadow-sm border border-gray-300 rounded py-3 px-4 text-gray-700 mb-4')}
          value={tenderIssuedDate}
          onChangeText={setTenderIssuedDate}
          placeholder="YYYY-MM-DD"
        />

        {/* Tender Closing Date */}
        <Text style={tailwind('text-gray-700 text-sm font-bold mb-2')}>Tender Closing Date</Text>
        <TextInput
          style={tailwind('shadow-sm border border-gray-300 rounded py-3 px-4 text-gray-700 mb-4')}
          value={tenderClosingDate}
          onChangeText={setTenderClosingDate}
          placeholder="YYYY-MM-DD"
        />

        {/* Budget Allocation */}
        <Text style={tailwind('text-gray-700 text-sm font-bold mb-2')}>Budget Allocation</Text>
        <TextInput
          style={tailwind('shadow-sm border border-gray-300 rounded py-3 px-4 text-gray-700 mb-4')}
          value={budgetAllocation}
          onChangeText={setBudgetAllocation}
          keyboardType="numeric"
        />

        {/* Location Coordinates */}
        <Text style={tailwind('text-gray-700 text-sm font-bold mb-2')}>Location Coordinates</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Map")}
          style={tailwind('bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded mb-4')}
        >
          <Text style={tailwind('text-white text-center')}>Plot Location on Map</Text>
        </TouchableOpacity>

        {/* Coordinates Table */}
        {coordinates.length > 0 && (
          <View>
            <Text style={tailwind('text-lg font-semibold text-gray-800 mb-2')}>Selected Coordinates:</Text>
            <View style={tailwind('bg-white border border-gray-300 rounded-lg p-4')}>
              {coordinates.map(([lat, lng], index) => (
                <View key={index} style={tailwind('flex-row justify-between mb-2')}>
                  <Text style={tailwind('text-gray-600 text-sm')}>Latitude: {lat}</Text>
                  <Text style={tailwind('text-gray-600 text-sm')}>Longitude: {lng}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={tailwind('bg-green-500 text-white py-3 px-6 rounded-lg mt-8')}
        >
          <Text style={tailwind('text-center text-white')}>Create Project</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddProject;
