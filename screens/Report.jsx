import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Platform } from 'react-native';
import { db } from '../Firebase/config';  // Adjust the import based on your file structure
import { collection, addDoc, getDocs, query, orderBy, limit, getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Firebase Firestore functions
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import { Alert } from 'react-native'; // Ensure you have this import for Alert


const Report = () => {
    // State variables for each field
    const [workerName, setWorkerName] = useState('');
    const [workerEmail, setWorkerEmail] = useState('');
    const [taskId, setTaskId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [department, setDepartment] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dateOfTask, setDateOfTask] = useState('');
    const [timeRequiredForCompletion, setTimeRequiredForCompletion] = useState('');
    const [location, setLocation] = useState('');
    const [reportId, setReportId] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false); // State to control Date Picker visibility

    // Fetch worker data from AsyncStorage
    const fetchWorkerData = async () => {
        try {
            const name = await AsyncStorage.getItem('userName');
            const email = await AsyncStorage.getItem('userEmail');
            const department = await AsyncStorage.getItem('userDepartment');

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
        const reportsRef = doc(db, 'reports', 'classD'); // Reference to the "classD" document in the "reports" collection

        // Get the classD document
        const docSnapshot = await getDoc(reportsRef);

        if (docSnapshot.exists()) {
            const reportsData = docSnapshot.data().reports; // Access the reports field

            // If there are existing reports, find the highest reportId
            if (reportsData) {
                // Extract all reportIds from the reports data and ensure they are valid integers
                const reportIds = Object.values(reportsData)
                    .map(report => parseInt(report.reportId, 10))  // Ensure reportId is parsed as an integer
                    .filter(id => !isNaN(id));  // Remove any NaN values

                // If there are valid reportIds, find the maximum reportId
                if (reportIds.length > 0) {
                    const lastReportId = Math.max(...reportIds);  // Find the max reportId

                    // Increment the report ID and ensure it's 3 digits
                    const newReportId = (lastReportId + 1).toString().padStart(3, '0');
                    setReportId(newReportId);
                } else {
                    // If no valid reportIds are found, start with '001'
                    setReportId('001');
                }
            } else {
                // If no reports exist, start with '001'
                setReportId('001');
            }
        } else {
            // If the classD document doesn't exist, initialize with '001'
            setReportId('001');
        }
    };


    // Function to show date picker
    const showDatePickerHandler = () => {
        setShowDatePicker(true);  // Show the date picker
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        // Ensure reportId is generated
        if (!reportId) {
            console.log('Report ID is not generated yet.');
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
                timestamp: serverTimestamp(),  // Add the current timestamp from Firestore
                reportId,  // Adding the generated report ID
            };

            // Reference to the "classD" document in the "reports" collection
            const reportRef = doc(db, 'reports', 'classD');

            // Using reportId to map to a specific field under "reports"
            await setDoc(reportRef, {
                reports: {
                    [reportId]: newReport,  // Using the reportId to dynamically map the report under its own unique key
                }
            }, { merge: true }); // Merge with the existing document to avoid overwriting other reports

            Alert.alert("Submitted successfully");

            console.log('Report submitted successfully!');
            setWorkerName('');
            setWorkerEmail('');
            setTaskId('');
            setProjectId('');
            setDepartment('');
            setTaskDescription('');
            setDateOfTask('');
            setTimeRequiredForCompletion('');
            setLocation('');
            setReportId('');
            setShowDatePicker(false); // Reset Date Picker visibility
        } catch (error) {
            console.error('Error submitting report: ', error);
        }
    };


    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date(); // Use current date if no date is selected
        setShowDatePicker(false); // Set show date picker to false after selection
        setDateOfTask(currentDate.toLocaleDateString()); // Format the date as you prefer
    };

    return (
        <ScrollView style={{ flex: 1, padding: 16, margn:3, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>Report Form</Text>

            {/* Worker Name Field */}
            <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, marginBottom: 8 }}>Worker Name</Text>
                <TextInput
                    style={{ height: 40, borderColor: '#ccc', borderWidth: 1, paddingLeft: 8 }}
                    placeholder="Enter worker's name"
                    value={workerName}
                    onChangeText={setWorkerName}
                />
            </View>

            {/* Worker Email Field */}
            <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, marginBottom: 8 }}>Worker Email</Text>
                <TextInput
                    style={{ height: 40, borderColor: '#ccc', borderWidth: 1, paddingLeft: 8 }}
                    placeholder="Enter worker's email"
                    value={workerEmail}
                    onChangeText={setWorkerEmail}
                />
            </View>

            {/* Task ID Field */}
            <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, marginBottom: 8 }}>Task ID</Text>
                <TextInput
                    style={{ height: 40, borderColor: '#ccc', borderWidth: 1, paddingLeft: 8 }}
                    placeholder="Enter task ID"
                    value={taskId}
                    onChangeText={setTaskId}
                />
            </View>

            {/* Project ID Field */}
            <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, marginBottom: 8 }}>Project ID</Text>
                <TextInput
                    style={{ height: 40, borderColor: '#ccc', borderWidth: 1, paddingLeft: 8 }}
                    placeholder="Enter project ID"
                    value={projectId}
                    onChangeText={setProjectId}
                />
            </View>

            {/* Department Field */}
            <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, marginBottom: 8 }}>Department</Text>
                <TextInput
                    style={{ height: 40, borderColor: '#ccc', borderWidth: 1, paddingLeft: 8 }}
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
                        borderColor: '#ccc',
                        borderWidth: 1,
                        paddingLeft: 8,
                        textAlignVertical: 'top'
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
                        borderColor: '#ccc',
                        borderWidth: 1,
                        paddingLeft: 8,
                        marginBottom: 10
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
                <Text style={{ fontSize: 18, marginBottom: 8 }}>Time Required for Completion</Text>
                <TextInput
                    style={{ height: 40, borderColor: '#ccc', borderWidth: 1, paddingLeft: 8 }}
                    placeholder="Enter time required"
                    value={timeRequiredForCompletion}
                    onChangeText={setTimeRequiredForCompletion}
                />
            </View>

            {/* Location Field */}
            <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, marginBottom: 8 }}>Location</Text>
                <TextInput
                    style={{ height: 40, borderColor: '#ccc', borderWidth: 1, paddingLeft: 8 }}
                    placeholder="Enter location"
                    value={location}
                    onChangeText={setLocation}
                />
            </View>

            {/* Submit Button */}
            <Button style= {{marginBottom: 16 }} title="Submit" onPress={handleSubmit} />
        </ScrollView>
    );
};

export default Report;
