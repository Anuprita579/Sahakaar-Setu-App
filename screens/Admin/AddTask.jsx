import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../Firebase/config"; // Adjust import as needed
import { doc, setDoc, getDoc } from "firebase/firestore";
import municipalTasks from "../utils/municipalTasks";

const AddTask = () => {
  const department = sessionStorage.getItem("department");
  const dept = department.replaceAll(" ", "");
  const navigation = useNavigation();

  const [taskOptions, setTaskOptions] = useState([]);
  const [filteredTaskOptions, setFilteredTaskOptions] = useState([]);
  const [taskInfo, setTaskInfo] = useState({
    taskName: "",
    location: "",
    taskId: "",
    department: department,
    priority: "",
    description: "",
    startDate: "",
    deadline: "",
    endDate: "",
    statusUpdates: "",
    assignedEmployees: [{ name: "", email: "" }],
    resources: [{ itemName: "", itemQuantity: "" }],
    budget: "",
    note: "",
    projectManagerName: "",
    projectManagerEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFetchTasks = async () => {
    if (!descriptionInput || !department) {
      setError("Please select both task description and department.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://sahkaar-setu-api-10pj.onrender.com/api/results/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: descriptionInput,
            department: department,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setIsModalOpen(true);
      } else {
        setError(`API call failed: ${response.statusText}`);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const generateTaskId = async () => {
      try {
        setLoading(true);

        const departmentDocRef = doc(db, "tasks", department);
        const departmentDoc = await getDoc(departmentDocRef);

        if (departmentDoc.exists()) {
          const independentTasks = departmentDoc.data().independent_tasks || {};
          const existingTaskIds = Object.keys(independentTasks);
          const numericTaskIds = existingTaskIds
            .map((id) => parseInt(id.split("_")[0], 10))
            .filter((id) => !isNaN(id))
            .sort((a, b) => b - a);
          const highestTaskId = numericTaskIds.length > 0 ? numericTaskIds[0] : 0;
          const newTaskId = (highestTaskId + 1).toString().padStart(3, "0");

          setTaskInfo((prevTaskInfo) => ({
            ...prevTaskInfo,
            taskId: newTaskId,
          }));
        } else {
          setTaskInfo((prevTaskInfo) => ({ ...prevTaskInfo, taskId: "001" }));
        }
      } catch (error) {
        console.error("Error generating task ID: ", error);
        setError("Failed to generate task ID. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    generateTaskId();
  }, [department]);

  useEffect(() => {
    if (dept && municipalTasks.departments[dept]) {
      setTaskOptions(municipalTasks.departments[dept].tasks);
    }
  }, [dept]);

  const handleDescriptionChange = (value) => {
    setDescriptionInput(value);

    if (value) {
      const filteredOptions = taskOptions.filter((task) =>
        task.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTaskOptions(filteredOptions);
    } else {
      setFilteredTaskOptions([]);
    }

    setTaskInfo({ ...taskInfo, description: value });
  };

  const handleSuggestionClick = (suggestion) => {
    setDescriptionInput(suggestion);
    setTaskInfo({ ...taskInfo, description: suggestion });
    setFilteredTaskOptions([]);
  };

  const handleInputChange = (name, value) => {
    setTaskInfo({ ...taskInfo, [name]: value });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!taskInfo.taskName || !taskInfo.location || !taskInfo.description) {
      setError("Please fill in all required fields.");
      return;
    }

    const cleanedTaskInfo = {
      ...taskInfo,
      assignedEmployees: taskInfo.assignedEmployees.filter(
        (emp) => emp.name && emp.email
      ),
      resources: taskInfo.resources.filter(
        (res) => res.itemName && res.itemQuantity
      ),
    };

    try {
      setLoading(true);

      const taskDocRef = doc(db, "tasks", department);
      await setDoc(
        taskDocRef,
        {
          independent_tasks: {
            [taskInfo.taskId]: cleanedTaskInfo,
          },
        },
        { merge: true }
      );

      navigation.navigate("TaskAssigned");
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Failed to submit task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-6 bg-gray-100 rounded-md">
      <Text className="text-xl font-semibold text-gray-600 mb-4">
        Task Information
      </Text>

      <TextInput
        className="p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Task Name"
        value={taskInfo.taskName}
        onChangeText={(value) => handleInputChange("taskName", value)}
      />
      <TextInput
        className="p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Location"
        value={taskInfo.location}
        onChangeText={(value) => handleInputChange("location", value)}
      />
      <TextInput
        className="p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Description"
        value={descriptionInput}
        onChangeText={handleDescriptionChange}
      />

      {filteredTaskOptions.length > 0 && (
        <FlatList
          data={filteredTaskOptions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-2 border border-gray-300 bg-gray-100 rounded-md mb-2"
              onPress={() => handleSuggestionClick(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Button
        title={loading ? "Fetching Tasks..." : "View Tasks"}
        onPress={handleFetchTasks}
        disabled={loading}
      />

      {error && <Text className="text-red-500 mt-4">{error}</Text>}

      <Modal visible={isModalOpen} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-md w-3/4">
            <Text className="text-lg font-semibold mb-4">Task Results</Text>
            <FlatList
              data={results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text>{item}</Text>}
            />
            <Button title="Close" onPress={handleModalClose} />
          </View>
        </View>
      </Modal>

      <TextInput
        className="p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Budget"
        value={taskInfo.budget}
        onChangeText={(value) => handleInputChange("budget", value)}
        keyboardType="numeric"
      />

      <Button title="Submit Task" onPress={handleSubmit} />
    </View>
  );
};

export default AddTask;
