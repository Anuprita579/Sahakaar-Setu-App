import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Image, Alert, ScrollView } from 'react-native';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../../Firebase/config';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Grievance = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  const [grievanceType, setGrievanceType] = useState('');
  const [location, setLocation] = useState('');
  const [latlon, setLatlon] = useState([null, null]);
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const departmentsCollection = collection(db, "departmentsInfo");
      const departmentsSnapshot = await getDocs(departmentsCollection);
      const departmentsList = departmentsSnapshot.docs.map((doc) => doc.data());
      setDepartments(departmentsList);

      // Fetch user details from AsyncStorage
      const storedUserName = await AsyncStorage.getItem('name');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedLat = await AsyncStorage.getItem('lat');
      const storedLon = await AsyncStorage.getItem('lon');
      
      setUserName(storedUserName || '');
      setEmail(storedEmail || '');
      setLatlon([storedLat, storedLon]);
    };
    fetchData();
  }, []);

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);

    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `grievances/${uuidv4()}_${image.fileName}`);
          const uploadTask = uploadBytesResumable(imageRef, {
            uri: image.uri,
            type: image.type,
            name: image.fileName,
          });

          await new Promise((resolve, reject) => {
            uploadTask.on('state_changed', null, (error) => reject(error), () => resolve());
          });

          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          return downloadURL;
        })
      );

      const grievanceData = {
        latlon,
        userName,
        email,
        phone,
        department,
        grievanceType,
        location,
        priority,
        description,
        imageUrls,
        timestamp: new Date(),
      };

      const departmentDocRef = doc(db, 'departments', department);
      const grievancesCollectionRef = collection(departmentDocRef, 'grievances');
      await addDoc(grievancesCollectionRef, grievanceData);

      setUploading(false);

      // Reset form after submission
      setPhone('');
      setDepartment('');
      setGrievanceType('');
      setLocation('');
      setPriority('');
      setDescription('');
      setImages([]);
      Alert.alert('Success', 'Grievance submitted successfully!');
    } catch (error) {
      console.error('Error submitting grievance:', error);
      setUploading(false);
      Alert.alert('Error', 'Failed to submit grievance. Please try again.');
    }
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Submit a Grievance</Text>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16 }}>Your Name</Text>
        <TextInput
          style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 8 }}
          placeholder="Enter your name"
          value={userName}
          onChangeText={setUserName}
          editable={false}
          className="bg-gray-300"
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16 }}>Email Address</Text>
        <TextInput
          style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 8 }}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          editable={false}
          className="bg-gray-300"
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16 }}>Phone Number</Text>
        <TextInput
          style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 8 }}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16 }}>Department</Text>
        <TextInput
          style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 8 }}
          placeholder="Enter department"
          value={department}
          onChangeText={setDepartment}
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16 }}>Grievance Type</Text>
        <TextInput
          style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 8 }}
          placeholder="Enter grievance type"
          value={grievanceType}
          onChangeText={setGrievanceType}
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16 }}>Location</Text>
        <TextInput
          style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 8 }}
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16 }}>Priority Level</Text>
        <TextInput
          style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 8 }}
          placeholder="Enter priority level"
          value={priority}
          onChangeText={setPriority}
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16 }}>Description</Text>
        <TextInput
          style={{ height: 80, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 8, textAlignVertical: 'top' }}
          placeholder="Enter a detailed description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16 }}>Upload Images</Text>
        <Button title="Pick images" onPress={handleImageUpload} />
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {images.length > 0 && images.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={{ width: 80, height: 80, marginRight: 8 }} />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: '#4CAF50',
          paddingVertical: 10,
          borderRadius: 5,
          alignItems: 'center',
          opacity: uploading ? 0.5 : 1,
        }}
        onPress={handleSubmit}
        disabled={uploading}
        className="mb-10"
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>{uploading ? 'Submitting...' : 'Submit Grievance'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Grievance;
