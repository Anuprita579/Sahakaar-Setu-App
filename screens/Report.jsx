import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, Alert, Platform, Linking } from "react-native";
import { db } from "../Firebase/config"; // Adjust the import based on your file structure
import {collection, addDoc, getDocs,
  query,
  orderBy,
  limit,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore"; // Firebase Firestore functions
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import DateTimePicker from "@react-native-community/datetimepicker"; // Import DateTimePicker
import * as Location from "expo-location";
import * as IntentLauncher from 'expo-intent-launcher';

const Report = () => {
  // State variables for each field
  const [workerName, setWorkerName] = useState("");
  const [workerEmail, setWorkerEmail] = useState("");
  const [taskId, setTaskId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [department, setDepartment] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dateOfTask, setDateOfTask] = useState("");
  const [timeRequiredForCompletion, setTimeRequiredForCompletion] =
    useState("");
  // const [location, setLocation] = useState('');
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [reportId, setReportId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control Date Picker visibility

  // Fetch worker data from AsyncStorage
  const fetchWorkerData = async () => {
    try {
      const name = await AsyncStorage.getItem("userName");
      const email = await AsyncStorage.getItem("userEmail");
      const department = await AsyncStorage.getItem("userDepartment");

      if (name && email && department) {
        setWorkerName(name);
        setWorkerEmail(email);
        setDepartment(department);
      }
    } catch (error) {
      console.error("Error fetching worker data from AsyncStorage", error);
    }
  };

  // Function to fetch the last report ID and increment it

  // Fetch last report ID and worker data when the component mounts
  useEffect(() => {
    fetchWorkerData();
    getLastReportId();
  }, []);

  const getLastReportId = async () => {
    const reportsRef = doc(db, "reports", "classD"); // Reference to the "classD" document in the "reports" collection

    // Get the classD document
    const docSnapshot = await getDoc(reportsRef);

    if (docSnapshot.exists()) {
      const reportsData = docSnapshot.data().reports; // Access the reports field

      // If there are existing reports, find the highest reportId
      if (reportsData) {
        // Extract all reportIds from the reports data and ensure they are valid integers
        const reportIds = Object.values(reportsData)
          .map((report) => parseInt(report.reportId, 10)) // Ensure reportId is parsed as an integer
          .filter((id) => !isNaN(id)); // Remove any NaN values

        // If there are valid reportIds, find the maximum reportId
        if (reportIds.length > 0) {
          const lastReportId = Math.max(...reportIds); // Find the max reportId

          // Increment the report ID and ensure it's 3 digits
          const newReportId = (lastReportId + 1).toString().padStart(3, "0");
          setReportId(newReportId);
        } else {
          // If no valid reportIds are found, start with '001'
          setReportId("001");
        }
      } else {
        // If no reports exist, start with '001'
        setReportId("001");
      }
    } else {
      // If the classD document doesn't exist, initialize with '001'
      setReportId("001");
    }
  };

  // Function to show date picker
  const showDatePickerHandler = () => {
    setShowDatePicker(true); // Show the date picker
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Ensure reportId is generated
    if (!reportId) {
      console.log("Report ID is not generated yet.");
      return;
    }

    // Submit the report data to Firestore under the "classD" document in the "reports" collection
    try {
      const newReport = {
        workerName,
        workerEmail,
        taskId,
        projectId,
        department,
        taskDescription,
        dateOfTask,
        timeRequiredForCompletion,
        location,
        timestamp: serverTimestamp(), // Add the current timestamp from Firestore
        reportId, // Adding the generated report ID
      };

      // Reference to the "classD" document in the "reports" collection
      const reportRef = doc(db, "reports", "classD");

      // Using reportId to map to a specific field under "reports"
      await setDoc(
        reportRef,
        {
          reports: {
            [reportId]: newReport, // Using the reportId to dynamically map the report under its own unique key
          },
        },
        { merge: true }
      ); // Merge with the existing document to avoid overwriting other reports

      Alert.alert("Submitted successfully");

      console.log("Report submitted successfully!");
      setWorkerName("");
      setWorkerEmail("");
      setTaskId("");
      setProjectId("");
      setDepartment("");
      setTaskDescription("");
      setDateOfTask("");
      setTimeRequiredForCompletion("");
      setLocation("");
      setReportId("");
      setShowDatePicker(false); // Reset Date Picker visibility
    } catch (error) {
      console.error("Error submitting report: ", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(); // Use current date if no date is selected
    setShowDatePicker(false); // Set show date picker to false after selection
    setDateOfTask(currentDate.toLocaleDateString()); // Format the date as you prefer
  };

// useEffect(() => {
//     const requestLocationPermissions = async () => {
//       try {
//         // Request permissions
//         const { status } = await Location.requestForegroundPermissionsAsync();
        
//         if (status === 'granted') {
//           setLocationPermission(true);
//           await getLocation();
//         } else {
//           setLocationPermission(false);
//           Alert.alert(
//             "Location Permission",
//             "Location permission is required to detect your current location. Please enable location services for the app.",
//             [
//               { 
//                 text: "OK", 
//                 onPress: () => {
//                   // Optionally open app settings
//                   if (Platform.OS === 'ios') {
//                     Linking.openSettings();
//                   } else {
//                     // For Android, you might want to add IntentLauncher
//                     // import * as IntentLauncher from 'expo-intent-launcher';
//                     // IntentLauncher.startActivityAsync(
//                     //   IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
//                     //   { data: 'package:' + yourPackageName }
//                     // );
//                     try {
//                         IntentLauncher.startActivityAsync(
//                           IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
//                           { data: 'package:' + Constants.expoConfig.android.package }
//                         );
//                       } catch (error) {
//                         console.error("Error opening app settings:", error);
//                         Alert.alert(
//                           "Error", 
//                           "Could not open app settings. Please manually go to app settings."
//                         );
//                       }
//                   }
//                 }
//               }
//             ]
//           );
//         }
//       } catch (error) {
//         console.error("Error requesting location permissions:", error);
//         Alert.alert("Error", "Failed to request location permissions");
//       }
//     };

//     requestLocationPermissions();
//   }, []);

//   const getLocation = async () => {
//     if (!locationPermission) {
//       Alert.alert(
//         "Permission Denied", 
//         "Please grant location permission in app settings."
//       );
//       return;
//     }

//     try {
//       const { coords } = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//         timeout: 15000,
//         maximumAge: 10000
//       });

//       const { latitude, longitude } = coords;

//       try {
//         const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
        
//         if (addresses && addresses.length > 0) {
//           const firstAddress = addresses[0];
//           const cityName = 
//             firstAddress.city || 
//             firstAddress.subregion || 
//             firstAddress.region || 
//             `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
//           setLocation(cityName);
//         } else {
//           setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
//         }
//       } catch (geocodeError) {
//         console.error("Reverse geocoding error:", geocodeError);
//         setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
//       }
//     } catch (error) {
//       console.error("Location error:", error);
//       Alert.alert(
//         "Location Error", 
//         "Could not retrieve location. Please check your device's location settings."
//       );
//     }
//   };

  return (
    <ScrollView
      style={{ flex: 1, padding: 16, margn: 3 }}
      className="py-16 bg-gray-200"
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Report Form
      </Text>

      {/* Worker Name Field */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Worker Name</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingLeft: 8,
          }}
          placeholder="Enter worker's name"
          value={workerName}
          onChangeText={setWorkerName}
          editable={false}
          className="bg-gray-300"
        />
      </View>

      {/* Worker Email Field */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Worker Email</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingLeft: 8,
          }}
          placeholder="Enter worker's email"
          value={workerEmail}
          onChangeText={setWorkerEmail}
          className="bg-gray-300"
          editable={false}
        />
      </View>

      {/* Task ID Field */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Task ID</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingLeft: 8,
          }}
          placeholder="Enter task ID"
          value={taskId}
          onChangeText={setTaskId}
        />
      </View>

      {/* Project ID Field */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Project ID</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingLeft: 8,
          }}
          placeholder="Enter project ID"
          value={projectId}
          onChangeText={setProjectId}
        />
      </View>

      {/* Department Field */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Department</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingLeft: 8,
          }}
          placeholder="Enter department"
          value={department}
          onChangeText={setDepartment}
        />
      </View>

      {/* Task Description Field */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Task Description</Text>
        <TextInput
          style={{
            height: 100,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingLeft: 8,
            textAlignVertical: "top",
          }}
          placeholder="Describe the task"
          value={taskDescription}
          onChangeText={setTaskDescription}
          multiline
        />
      </View>

      {/* Date of Task Field */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Date of Task</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingLeft: 8,
            marginBottom: 10,
          }}
          placeholder="Select the date"
          value={dateOfTask}
          onFocus={showDatePickerHandler}
        />
        {showDatePicker && (
          <DateTimePicker
            value={new Date(dateOfTask || Date.now())}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Time Required for Completion Field */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>
          Time Required for Completion
        </Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingLeft: 8,
          }}
          placeholder="Enter time required"
          value={timeRequiredForCompletion}
          onChangeText={setTimeRequiredForCompletion}
        />
      </View>

      {/* Location Field */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Location</Text>
         <TextInput
        style={{ 
          height: 40, 
          borderColor: '#ccc', 
          borderWidth: 1, 
          paddingLeft: 8,
          marginBottom: 8
        }}
        placeholder="Location"
        value={location || ''}
        editable={false}
      />
      <Button 
        title="Detect Location" 
        // onPress={getLocation} 
        disabled={locationPermission !== true}
      />
      </View>

      {/* Submit Button */}
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default Report;
