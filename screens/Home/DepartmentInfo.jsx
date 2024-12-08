import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/config"; // Ensure your Firestore setup is correct

export default function DepartmentInfo() {
  const [departmentData, setDepartmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch data from Firestore
    const fetchDepartmentInfo = async () => {
      try {
        // Reference to the department document
        const departmentRef = doc(db, "departmentsInfo", "Water Supply and Sewage");
        
        // Get the document data
        const docSnap = await getDoc(departmentRef);
        
        if (docSnap.exists()) {
          // If document exists, set the department data
          setDepartmentData(docSnap.data());
        } else {
          // If no document is found
          setError("No such department found!");
        }
      } catch (err) {
        setError("An error occurred while fetching the department data.");
        console.error("Error fetching department data: ", err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchDepartmentInfo();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{departmentData?.departmentName}</Text>

      <Text style={styles.label}>Accessibility:</Text>
      <Text>{departmentData?.accessibility}</Text>

      <Text style={styles.label}>Address:</Text>
      <Text>{departmentData?.address}</Text>

      <Text style={styles.label}>Contact Number:</Text>
      <Text>{departmentData?.contactNumber}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text>{departmentData?.email}</Text>

      <Text style={styles.label}>Emergency Contact:</Text>
      <Text>{departmentData?.emergencyContact}</Text>

      <Text style={styles.label}>Head of Department:</Text>
      <Text>{departmentData?.headOfDepartment}</Text>

      <Text style={styles.label}>Office Hours:</Text>
      <Text>{departmentData?.officeHours}</Text>

      <Text style={styles.label}>Overview:</Text>
      <Text>{departmentData?.overview}</Text>

      <Text style={styles.label}>Procedures:</Text>
      <Text>{departmentData?.procedures}</Text>

      <Text style={styles.label}>Services Provided:</Text>
      <Text>{departmentData?.servicesProvided}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
