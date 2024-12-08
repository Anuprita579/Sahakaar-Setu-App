import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Modal, FlatList, TouchableOpacity } from "react-native";
import { db } from "../../Firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "../Firebase/config";
import municipalTasks from "../../utils/constants/municipalTasks";

const AddTask = () => {
  //     const department = AsyncStorage.getItem("department");
  //   const dept = department.replaceAll(" ", "");
  const department = "Water Supply and Sewage";
  const dept = "WaterSupplyandSewage";
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
    documentURL: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [availableManagers, setAvailableManagers] = useState([]);
  const [documentFile, setDocumentFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchAvailableEmployees = async () => {
      try {
        const classType = await AsyncStorage.getItem("classType"); // Fetch user's class type
        const departmentName = await AsyncStorage.getItem("department");
        // console.log(`Class Type: ${classType}`);

        if (!classType || !departmentName) {
          console.error(
            "Class type or department not found in session storage."
          );
          return;
        }
        // Remove "Class " prefix if it exists
        const trimmedClassType = classType
          .replace("Class ", "")
          .trim()
          .toUpperCase();

        // Map classType to next classType (e.g., A -> B, B -> C, etc.)
        const classHierarchy = { A: ["C", "B"], B: ["C", "D"], C: ["D"] };
        //or const classHierarchy = { A: ["B"], B: ["C"], C: ["D"] };
        const targetClasses = classHierarchy[trimmedClassType];

        if (!targetClasses) {
          console.error("Invalid class type.");
          return;
        }

        // Fetch department document
        const departmentRef = doc(db, "departments", departmentName.trim());
        const departmentSnap = await getDoc(departmentRef);

        if (departmentSnap.exists()) {
          const employees = departmentSnap.data().employees;
          console.log(employees);
          const filteredEmployees = Object.values(employees).filter(
            (employee) =>
              targetClasses.some(
                (targetClass) =>
                  employee.role.replace("Class ", "").trim().toUpperCase() ===
                  targetClass
              )
          );
          console.log("Filtered Employees:", filteredEmployees);

          setAvailableEmployees(filteredEmployees);
        } else {
          console.error("No such department exists.");
        }
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchAvailableEmployees();
  }, []);

  useEffect(() => {
    const fetchAvailableManagers = async () => {
      try {
        const classType = AsyncStorage.getItem("classType");
        const departmentName = await AsyncStorage.getItem("department");
        if (!classType || !departmentName) {
          console.error(
            "Class type or department not found in session storage."
          );
          return;
        }
        const trimmedClassType = classType
          .replace("Class ", "")
          .trim()
          .toUpperCase();

        const classHierarchy = { A: ["B"], B: ["B"] };
        const targetClasses = classHierarchy[trimmedClassType];

        if (!targetClasses) {
          console.error("Invalid class type.");
          return;
        }

        // Fetch department document
        const departmentRef = doc(db, "departments", departmentName.trim());
        const departmentSnap = await getDoc(departmentRef);

        if (departmentSnap.exists()) {
          const employees = departmentSnap.data().employees;
          console.log(employees);
          const filteredEmployees = Object.values(employees).filter(
            (employee) =>
              targetClasses.some(
                (targetClass) =>
                  employee.role.replace("Class ", "").trim().toUpperCase() ===
                  targetClass
              )
          );
          console.log("Filtered Employees:", filteredEmployees);

          setAvailableManagers(filteredEmployees);
        } else {
          console.error("No such department exists.");
        }
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchAvailableManagers();
  }, []);

  const handleFetchTasks = async () => {
    if (!descriptionInput || !department) {
      setError("Please select both task description and department.");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors

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
      // console.log(response)

      if (response.ok) {
        const data = await response.json();
        // console.log("data", data);
        setResults(data.results); // Set the results to display
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
        setLoading(true); // Set loading state

        // Reference to the department document
        const departmentDocRef = doc(db, "tasks", department);
        const departmentDoc = await getDoc(departmentDocRef);

        if (departmentDoc.exists()) {
          const independentTasks = departmentDoc.data().independent_tasks || {}; // Get independent_tasks field, default to empty object if not present
          const existingTaskIds = Object.keys(independentTasks); // Extract task IDs from the keys of the independent_tasks object
          console.log("Existing Task IDs:", existingTaskIds);

          // Filter and sort task IDs based on the numeric part
          const numericTaskIds = existingTaskIds
            .map((id) => parseInt(id.split("_")[0], 10))
            .filter((id) => !isNaN(id))
            .sort((a, b) => b - a); // Sort in descending order

          // Determine the highest numeric task ID
          const highestTaskId =
            numericTaskIds.length > 0 ? numericTaskIds[0] : 0;

          // Generate the next task ID based on the highest existing ID
          const newTaskId = (highestTaskId + 1).toString().padStart(3, "0");
          console.log("New Task ID:", newTaskId);

          setTaskInfo((prevTaskInfo) => ({
            ...prevTaskInfo,
            taskId: newTaskId,
          }));
        } else {
          // If the department document does not exist, start with ID '001'
          setTaskInfo((prevTaskInfo) => ({ ...prevTaskInfo, taskId: "001" }));
        }
      } catch (error) {
        console.error("Error generating task ID: ", error);
        setError("Failed to generate task ID. Please try again.");
      } finally {
        setLoading(false); // Clear loading state
      }
    };

    generateTaskId();
  }, [department]);

  useEffect(() => {
    console.log("dept", dept);
    console.log(municipalTasks.departments[dept]);
    if (dept && municipalTasks.departments[dept]) {
      setTaskOptions(municipalTasks.departments[dept].tasks);
    }
  }, [dept]);

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescriptionInput(value);

    if (value) {
      const filteredOptions = taskOptions.filter((task) =>
        task.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTaskOptions(filteredOptions);
    } else {
      setFilteredTaskOptions([]); // Clear suggestions if input is empty
    }

    setTaskInfo({ ...taskInfo, description: value });
  };

  const handleSuggestionClick = (suggestion) => {
    setDescriptionInput(suggestion); // Set input to selected suggestion
    setTaskInfo({ ...taskInfo, description: suggestion }); // Update description in taskInfo
    setFilteredTaskOptions([]); // Clear suggestions after selection
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskInfo({ ...taskInfo, [name]: value });
  };

  const handleEmployeeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEmployees = taskInfo.assignedEmployees.map((employee, i) =>
      i === index ? { ...employee, [name]: value } : employee
    );
    setTaskInfo({ ...taskInfo, assignedEmployees: updatedEmployees });
  };

  const handleResourceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedResources = taskInfo.resources.map((resource, i) =>
      i === index ? { ...resource, [name]: value } : resource
    );
    setTaskInfo({ ...taskInfo, resources: updatedResources });
  };

  const addEmployee = () => {
    setTaskInfo({
      ...taskInfo,
      assignedEmployees: [
        ...taskInfo.assignedEmployees,
        { name: "", email: "" },
      ],
    });
  };

  const addResource = () => {
    setTaskInfo({
      ...taskInfo,
      resources: [...taskInfo.resources, { itemName: "", itemQuantity: "" }],
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close modal
  };
  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!taskInfo.taskName || !taskInfo.location || !taskInfo.description) {
      setError("Please fill in all required fields.");
      return;
    }

    // Remove undefined or incomplete fields
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
      setLoading(true); // Start loading
      let documentURL = "";

      // Handle file upload to Firebase Storage
      if (documentFile) {
        const storagePath = `tasks/${department}/independent_tasks/${taskInfo.taskId}/${documentFile.name}`;
        const storageRef = ref(storage, storagePath);
        console.log("Uploading file to:", storagePath);

        // Upload file
        await uploadBytes(storageRef, documentFile);

        // Get public URL
        documentURL = await getDownloadURL(storageRef);
        console.log("Document URL:", documentURL);
      }

      // Update task info with document URL
      const updatedTaskInfo = {
        ...cleanedTaskInfo,
        documentURL,
      };

      // Add task to Firestore
      const taskDocRef = doc(db, "tasks", department);
      await setDoc(
        taskDocRef,
        {
          independent_tasks: {
            [taskInfo.taskId]: updatedTaskInfo,
          },
        },
        { merge: true }
      );

      // Success notification
      triggerNotification("Task added successfully!", "success");

      // Redirect to tasks page
      navigate(`/dashboard/taskassigned`);
    } catch (error) {
      console.error("Error submitting task:", error);
      setError("Failed to submit task. Please try again.");
      triggerNotification("Failed to add task. Please try again.", "error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View className="max-w-3xl mx-auto p-8 bg-white shadow-xl shadow-slate-300 rounded-lg mt-10 dark:bg-gray-800 dark:text-white">
      <Text className="text-3xl font-bold text-gray-800 mb-8 text-center dark:text-white">
        New Task
      </Text>
      <Text className="text-xl font-semibold text-gray-600 mb-4 dark:text-slate-400">
        Task Information
      </Text>

      {currentStep === 1 && (
        <>
          <View className="grid grid-cols-1 gap-4 mb-6">
            <View className="flex flex-col">
              <Text className="mb-1 text-gray-600 dark:text-slate-400">
                Task Name
              </Text>
              <TextInput
                value={taskInfo.taskName}
                onChangeText={(text) =>
                  handleInputChange({
                    target: { name: "taskName", value: text },
                  })
                }
                className="p-2 border border-gray-300 rounded-md dark:text-slate-400"
                required
              />
            </View>

            <View className="flex flex-col">
              <Text className="mb-1 text-gray-600 dark:text-slate-400">
                Location
              </Text>
              <TextInput
                value={taskInfo.location}
                onChangeText={(text) =>
                  handleInputChange({
                    target: { name: "location", value: text },
                  })
                }
                className="p-2 border border-gray-300 rounded-md dark:text-slate-400"
                required
              />
            </View>

            <View className="flex flex-col">
              <Text className="mb-1 text-gray-600 dark:text-slate-400">
                Task Description
              </Text>
              <TextInput
                value={taskInfo.description}
                onChangeText={handleDescriptionChange}
                className="p-2 border border-gray-300 rounded-md dark:text-slate-400"
                required
              />
              {filteredTaskOptions.length > 0 && (
                <FlatList
                  data={filteredTaskOptions}
                  renderItem={({ item }) => (
                    <View
                      className="p-2 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-700"
                      onTouchEnd={() => handleSuggestionClick(item)}
                    >
                      <Text>{item}</Text>
                    </View>
                  )}
                />
              )}
            </View>

            <Button
              title={loading ? "Fetching Tasks..." : "View Tasks"}
              onPress={handleFetchTasks}
              disabled={loading}
            />
            {error && <Text className="text-red-500 mt-4">{error}</Text>}

            {isModalOpen && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={isModalOpen}
              >
                <View className="fixed inset-0 bg-black bg-opacity-50 justify-center items-center">
                  <View className="bg-white p-6 rounded-md shadow-lg w-1/2 max-h-96 overflow-auto dark:bg-gray-800 dark:text-white">
                    <Text className="text-lg font-semibold mb-4">
                      Task Results
                    </Text>
                    <FlatList
                      data={results}
                      renderItem={({ item }) => (
                        <Text className="mb-2">{item}</Text>
                      )}
                    />
                    <Button title="Close" onPress={handleModalClose} />
                  </View>
                </View>
              </Modal>
            )}

            <View className="flex flex-col">
              <Text className="mb-1 text-gray-600 dark:text-slate-400">
                Budget
              </Text>
              <TextInput
                value={taskInfo.budget}
                onChangeText={(text) =>
                  handleInputChange({ target: { name: "budget", value: text } })
                }
                className="p-2 border border-gray-300 rounded-md dark:text-slate-400"
                keyboardType="numeric"
                required
              />
            </View>

            <View className="flex flex-col">
              <Text className="mb-1 text-gray-600 dark:text-slate-400">
                Priority
              </Text>
              <TextInput
                value={taskInfo.priority}
                onChangeText={(text) =>
                  handleInputChange({
                    target: { name: "priority", value: text },
                  })
                }
                className="p-2 border border-gray-300 rounded-md dark:text-slate-400"
                required
              />
            </View>
          </View>
        </>
      )}

      {currentStep === 2 && (
        <View className="space-y-4 mb-6">
          <Text className="text-lg font-semibold text-gray-600 mb-2 dark:text-slate-400">
            Task Timeline
          </Text>
          <View className="space-y-4">
            {[
              { label: "Start Date", name: "startDate", type: "date" },
              { label: "Deadline", name: "deadline", type: "date" },
              { label: "End Date", name: "endDate", type: "date" },
              { label: "Status Updates", name: "statusUpdates" },
            ].map((field, idx) => (
              <View key={idx} className="flex flex-col">
                <Text className="mb-1 text-gray-600 dark:text-slate-400">
                  {field.label}
                </Text>
                <TextInput
                  keyboardType={field.type === "date" ? "default" : "default"} // Adjust as needed for date input
                  placeholder={field.label}
                  value={taskInfo[field.name]}
                  onChangeText={(value) => handleInputChange(field.name, value)}
                  className="p-2 border border-gray-300 rounded-md dark:text-slate-400"
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {currentStep === 3 && (
        <View className="space-y-4 mb-6">
          {/* Project Manager */}
          <Text className="text-lg font-semibold text-gray-600 mb-2 dark:text-slate-400">
            Project Manager Information
          </Text>

          {/* Select Manager */}
          <Picker
            selectedValue={taskInfo.projectManagerEmail}
            onValueChange={(itemValue, itemIndex) => {
              const selectedManager = availableManagers[itemIndex];
              setTaskInfo({
                ...taskInfo,
                projectManagerName: selectedManager?.Name,
                projectManagerEmail: itemValue,
              });
            }}
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "#ccc",
            }}
          >
            {availableManagers.map((manager, idx) => (
              <Picker.Item
                key={idx}
                label={`${manager.Name} (${manager.email})`}
                value={manager.email}
              />
            ))}
          </Picker>

          {/* Assigned Employees */}
          <Text className="text-lg font-semibold text-gray-600 mb-2 dark:text-slate-400">
            Assigned Employees
          </Text>
          <Picker
            selectedValue={null} // For multi-select, use a separate controlled state or library
            onValueChange={(itemValue, itemIndex) => {
              const selectedEmployee = availableEmployees[itemIndex];
              const updatedEmployees = [
                ...(taskInfo.assignedEmployees || []),
                {
                  name: selectedEmployee?.Name,
                  email: itemValue,
                },
              ];
              setTaskInfo({ ...taskInfo, assignedEmployees: updatedEmployees });
            }}
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: "#ccc",
            }}
          >
            {availableEmployees.map((employee, idx) => (
              <Picker.Item
                key={idx}
                label={`${employee.Name} (${employee.email})`}
                value={employee.email}
              />
            ))}
          </Picker>
        </View>
      )}

      {currentStep === 4 && (
        <View className="space-y-4 mb-6">
          {/* Resources */}
          <Text className="text-lg font-semibold text-gray-600 mb-2 dark:text-slate-400">
            Resources
          </Text>
          {taskInfo.resources.map((resource, index) => (
            <View key={index} className="space-y-4">
              {[
                { label: "Resource Name", name: "itemName" },
                { label: "Resource Quantity", name: "itemQuantity" },
              ].map((field, idx) => (
                <View key={idx} className="flex flex-col">
                  <Text className="mb-1 text-gray-600 dark:text-slate-400">
                    {field.label}
                  </Text>
                  <TextInput
                    placeholder={field.label}
                    value={resource[field.name]}
                    onChangeText={(value) =>
                      handleResourceChange(index, field.name, value)
                    }
                    className="p-2 border border-gray-300 rounded-md dark:text-slate-400"
                  />
                </View>
              ))}
            </View>
          ))}
          <TouchableOpacity
            onPress={addResource}
            className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            <Text className="text-white text-center">Add Another Resource</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentStep === 5 && (
        <View className="space-y-4 mb-6">
          {/* Notes */}
          <View className="flex flex-col mb-6">
            <Text className="mb-1 text-gray-600 dark:text-slate-400">
              Notes
            </Text>
            <TextInput
              multiline
              placeholder="Additional notes about the task"
              value={taskInfo.note}
              onChangeText={(value) => handleInputChange("note", value)}
              className="p-2 border border-gray-300 rounded-md dark:text-slate-400"
            />
          </View>

          {/* File Upload */}
          <Text className="block text-gray-700 text-sm font-bold mb-2">
            Upload Document
          </Text>
          <TouchableOpacity
            onPress={selectFile} // Replace with your file picker logic
            className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue hover:bg-blue hover:text-green-500"
          >
            <Svg height={32} width={32} fill="currentColor" viewBox="0 0 20 20">
              <Path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </Svg>
            <Text className="mt-2 text-base leading-normal">Select File</Text>
          </TouchableOpacity>
        </View>
      )}
      {error && <Text className="text-red-500 mb-4">{error}</Text>}
      {loading && <Text className="text-blue-500 mb-4">Loading...</Text>}
      <View className="mt-8 flex flex-row justify-between">
        {currentStep > 1 && (
          <TouchableOpacity
            onPress={handlePreviousStep}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            <Text className="text-white">Previous</Text>
          </TouchableOpacity>
        )}
        {currentStep < 5 && (
          <TouchableOpacity
            onPress={handleNextStep}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            <Text className="text-white">Next</Text>
          </TouchableOpacity>
        )}
        {currentStep === 5 && (
          <TouchableOpacity
            onPress={handleSubmit} // Replace with your form submission logic
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            <Text className="text-white">Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AddTask;
