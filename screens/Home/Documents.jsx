import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Fallback for CameraType
const CameraType = {
  Back: 'back',
  Front: 'front',
};

const Documents = () => {
  const cameraRef = useRef(null); // Create a ref for CameraView
  const [cameraType, setCameraType] = useState(CameraType.Back);
  const [photos, setPhotos] = useState([]); // Array to store all captured photo URIs
  const [deadline, setDeadline] = useState('');
  const [taskCompleted, setTaskCompleted] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View><Text>Requesting camera permissions...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center mb-4">We need your permission to access the camera</Text>
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded"
          onPress={requestPermission}
        >
          <Text className="text-white">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraType = () => {
    setCameraType((prevType) =>
      prevType === CameraType.Back ? CameraType.Front : CameraType.Back
    );
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync(); // Capture photo using the ref
        setPhotos((prevPhotos) => [...prevPhotos, photo.uri]); // Add new photo URI to the array
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    } else {
      Alert.alert('Error', 'Camera not ready');
    }
  };

  const handleDelete = (index) => {
    // Delete photo by filtering out the photo at the specified index
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!deadline || !taskCompleted) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    Alert.alert('Form Submitted', 'Your document details have been submitted successfully!');
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Submit Documents</Text>

      <View className="flex-1">
        <CameraView
          ref={cameraRef} // Attach the ref to CameraView
          style={{ flex: 1 }}
          facing={cameraType}
        >
          <View className="absolute bottom-0 left-0 right-0 flex flex-row justify-center items-center mb-4 gap-5">
            <TouchableOpacity
              className="bg-blue-500 p-3 rounded"
              onPress={toggleCameraType}
            >
              <Text className="text-white">Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-green-500 p-3 rounded"
              onPress={handleCapture}
            >
              <Text className="text-white">Capture Photo</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* Display Captured Photos */}
      <ScrollView className="flex flex-row h-0 mt-2" horizontal={true}>
        {photos.map((uri, index) => (
          <View key={index} className="relative w-48 h-48 mr-4 mb-4">
            <Image source={{ uri }} className="w-full h-full rounded" />
            <TouchableOpacity
              onPress={() => handleDelete(index)} // Delete the specific photo
              className="absolute top-0 right-0 bg-red-500 p-2 rounded-full"
            >
              <Text className="text-white"> <MaterialIcons name="delete" size={24} color="white" /> </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TextInput value={deadline} onChangeText={setDeadline} placeholder="Task Deadline" className="border p-2 rounded mb-4" />
      <TextInput value={taskCompleted} onChangeText={setTaskCompleted} placeholder="Task Completed (Yes/No)" className="border p-2 rounded mb-4" />
      <TextInput value={additionalInfo} onChangeText={setAdditionalInfo} placeholder="Additional Information" className="border p-2 rounded mb-4" />

      <TouchableOpacity onPress={handleSubmit} className="bg-green-500 p-3 rounded">
        <Text className="text-white text-center">Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Documents;
