import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Image, Alert, ScrollView } from 'react-native';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../../Firebase/config';
import * as ImagePicker from 'expo-image-picker';

const GrievanceForm = () => {
  const [userName, setUserName] = useState(sessionStorage.getItem("name"));
  const [email, setEmail] = useState(sessionStorage.getItem('email'));
  const [phone, setPhone] = useState('');
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  const [grievanceType, setGrievanceType] = useState('');
  const [location, setLocation] = useState('');
  const [latlon, setLatlon] = useState([sessionStorage.getItem("lat"),sessionStorage.getItem("lon")]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // Reset the form
      setUserName('');
      setEmail('');
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
  };

  return (
    <ScrollView contentContainerStyle="p-6 bg-white">
      <Text className="text-2xl font-bold mb-4 text-gray-800">Submit a Grievance</Text>
      <View className="space-y-4">
        <View>
          <Text className="block text-sm font-medium text-gray-700">Your Name</Text>
          <TextInput
            className="mt-1 p-2 border rounded-md"
            placeholder="Enter your name"
            value={userName}
            onChangeText={setUserName}
            required
          />
        </View>

        <View>
          <Text className="block text-sm font-medium text-gray-700">Email Address</Text>
          <TextInput
            className="mt-1 p-2 border rounded-md"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            required
          />
        </View>

        <View>
          <Text className="block text-sm font-medium text-gray-700">Phone Number</Text>
          <TextInput
            className="mt-1 p-2 border rounded-md"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            required
          />
        </View>

        <View>
          <Text className="block text-sm font-medium text-gray-700">Department</Text>
          <TextInput
            className="mt-1 p-2 border rounded-md"
            placeholder="Select a department"
            value={department}
            onChangeText={setDepartment}
            required
          />
        </View>

        <View>
          <Text className="block text-sm font-medium text-gray-700">Type of Grievance</Text>
          <TextInput
            className="mt-1 p-2 border rounded-md"
            placeholder="Enter grievance type"
            value={grievanceType}
            onChangeText={setGrievanceType}
            required
          />
        </View>

        <View>
          <Text className="block text-sm font-medium text-gray-700">Location</Text>
          <TextInput
            className="mt-1 p-2 border rounded-md"
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
            required
          />
        </View>

        <View>
          <Text className="block text-sm font-medium text-gray-700">Priority Level</Text>
          <TextInput
            className="mt-1 p-2 border rounded-md"
            placeholder="Select priority level"
            value={priority}
            onChangeText={setPriority}
            required
          />
        </View>

        <View>
          <Text className="block text-sm font-medium text-gray-700">Detailed Description</Text>
          <TextInput
            className="mt-1 p-2 border rounded-md"
            placeholder="Provide description"
            value={description}
            onChangeText={setDescription}
            required
            multiline
          />
        </View>

        <View>
          <Text className="block text-sm font-medium text-gray-700">Upload Images (optional)</Text>
          <Button title="Pick images" onPress={handleImageUpload} />
          <View className="flex-row mt-2">
            {images.length > 0 && images.map((image, index) => (
              <Image key={index} source={{ uri: image.uri }} style={{ width: 80, height: 80, marginRight: 8 }} />
            ))}
          </View>
        </View>

        <TouchableOpacity
          className={`mt-4 py-2 px-4 rounded-md text-white text-center ${uploading ? 'bg-gray-400' : 'bg-indigo-600'}`}
          onPress={handleSubmit}
          disabled={uploading}
        >
          <Text>{uploading ? 'Submitting...' : 'Submit Grievance'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default GrievanceForm;
