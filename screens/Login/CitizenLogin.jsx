import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { db } from '../../Firebase/config';  // Update with your Firebase config
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native"; // Import useNavigation


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation(); // Hook to access navigation


  // Handle login functionality
  const handleLogin = async () => {
    setError('');  // Clear previous errors

    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }

      // Fetch the 'citizens' data from Firestore based on the email
      const documentRef = doc(db, 'departments', 'citizens');
      const docSnap = await getDoc(documentRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const citizen = data.citizens[email]; // Map lookup for citizen by email

        if (citizen && citizen.password === password) {
          // If citizen exists and passwords match, store email in AsyncStorage
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('name', citizen.Name);
          Alert.alert('Login Successful', 'Welcome back!');
          navigation.navigate("BottomStack");
          // Navigate to the home screen or dashboard (you can use react-navigation here)
        } else {
          setError('Incorrect email or password. Please try again.');
        }
      } else {
        setError('No such department found!');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' }}>
      <View style={{ width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Login</Text>

        {/* Error Message */}
        {error && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text>}

        {/* Email Input */}
        <TextInput
          style={{ width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15 }}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password Input */}
        <TextInput
          style={{ width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 20 }}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: '#007bff', padding: 15, borderRadius: 5 }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
