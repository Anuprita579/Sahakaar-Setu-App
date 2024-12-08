import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../Firebase/config"; // Import Firebase config
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    gender: '',
    hireDate: '',
    designation: '',
  });
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the department and email from AsyncStorage
        const department = await AsyncStorage.getItem('userDepartment');
        const email = await AsyncStorage.getItem('userEmail');

        if (!department || !email) {
          setError('User department or email not found');
          return;
        }

        // Reference to the department document in Firestore
        const departmentRef = doc(db, "departments", department);
        const docSnap = await getDoc(departmentRef);

        if (docSnap.exists()) {
          const departmentData = docSnap.data();
          const employees = departmentData.employees;  // Access employees field

          // Check if employee exists
          if (employees && employees[email]) {
            const employee = employees[email];

            // Set the retrieved employee data into state
            setUserData({
              name: employee.Name,
              email: employee.email,
              role: employee.role,
              phone: employee.phone,
              gender: employee.gender,
              hireDate: employee.hireDate,
              designation: employee.designation,
            });

            setLoading(false); // Set loading to false after data is fetched
          } else {
            setError('Employee not found in this department');
            setLoading(false);
          }
        } else {
          setError('Department not found');
          setLoading(false);
        }
      } catch (err) {
        setError('Error fetching user data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserData(); // Call the function to fetch data
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: 'your-image-url' }} style={styles.profileImage} />
        <Text style={styles.profileText}>Name: {userData.name}</Text>
        <Text style={styles.profileText}>Email: {userData.email}</Text>
        <Text style={styles.profileText}>Role: {userData.role}</Text>
        <Text style={styles.profileText}>Phone: {userData.phone}</Text>
        <Text style={styles.profileText}>Gender: {userData.gender}</Text>
        <Text style={styles.profileText}>Hire Date: {userData.hireDate}</Text>
        <Text style={styles.profileText}>Designation: {userData.designation}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  profileContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ProfileScreen;