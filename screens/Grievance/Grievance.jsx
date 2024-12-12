import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Image, Alert, ScrollView, Platform } from 'react-native';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../../Firebase/config';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from "expo-camera";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context'

// Fallback for CameraType
const CameraType = {
  Back: "back",
  Front: "front",
};

const Grievance = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  const [grievanceType, setGrievanceType] = useState('');
  // const [location, setLocation] = useState('');
  const [latlon, setLatlon] = useState([null, null]);
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  //camera
  const cameraRef = useRef(null); // Create a ref for CameraView
  const [cameraType, setCameraType] = useState(CameraType.Back);
  const [photos, setPhotos] = useState([]); // Array to store all captured photo URIs
  const [permission, requestPermission] = useCameraPermissions();
  //location
  const [location, setLocation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [latitude, setLatitude] = useState(null);
const [longitude, setLongitude] = useState(null);


const getCurrentLocation = async () => {
  try {
    // Reset error message
    setErrorMsg(null);

    // Request permissions with both foreground and background
    let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    // Additional check for background permissions on Android
    if (Platform.OS === 'android') {
      let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        console.log('Background location permission not granted');
      }
    }

    console.log('Foreground Permission Status:', foregroundStatus);

    if (foregroundStatus !== 'granted') {
      Alert.alert(
        'Permission denied', 
        'Allow the app to use location services', 
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK', 
            onPress: () => console.log('OK Pressed')
          },
        ]
      );
      setDisplayCurrentAddress('Location access denied');
      return;
    }

    // Get current position with multiple fallback strategies
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced, // Try balanced accuracy
      timeout: 30000,
      maximumAge: 10000
    });

    console.log('Coordinates:', coords);

    if (coords) {
      const { latitude, longitude } = coords;
      console.log('Latitude:', latitude, 'Longitude:', longitude);
      setLatitude(latitude);
      setLongitude(longitude);

      // Multiple geocoding attempts
      // try {
      //   // First attempt: Standard Expo Location Geocoding
      //   const response = await Location.reverseGeocodeAsync(
      //     { latitude, longitude },
      //     { useGoogleMaps: false, timeout: 30000 }
      //   );
      //   console.log("response of geocoding: ", response);

      //   console.log('Geocode Response:', JSON.stringify(response, null, 2));

      //   if (response && response.length > 0) {
      //     // Create a comprehensive address string with multiple fallback options
      //     const firstAddress = response[0];
      //     const addressParts = [
      //       firstAddress.name,
      //       firstAddress.street,
      //       firstAddress.district,
      //       firstAddress.city,
      //       firstAddress.region,
      //       firstAddress.country,
      //       firstAddress.postalCode
      //     ].filter(Boolean);

      //     const formattedAddress = addressParts.join(', ');
          
      //     setDisplayCurrentAddress(formattedAddress || `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      //   } else {
      //     // Fallback if no address found
      //     setDisplayCurrentAddress(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      //     setErrorMsg('No address details found');
      //   }
      // } catch (geocodeError) {
      //   console.error('Reverse Geocoding Error:', geocodeError);
        
      //   // Detailed error logging
      //   console.log('Error Name:', geocodeError.name);
      //   console.log('Error Message:', geocodeError.message);
      //   console.log('Error Stack:', geocodeError.stack);

      //   // Fallback error handling
      //   setDisplayCurrentAddress(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      //   setErrorMsg(`Geocoding failed: ${geocodeError.message}`);
      // }
    }
  } catch (error) {
    console.error('Location Retrieval Error:', error);
    
    // Comprehensive error handling
    if (error.code === 'E_LOCATION_SERVICES_DISABLED') {
      setErrorMsg('Location services are disabled');
      setDisplayCurrentAddress('Location services disabled');
    } else {
      setErrorMsg(`Location Error: ${error.message}`);
      setDisplayCurrentAddress('Location detection failed');
    }

    // Log additional error details
    console.log('Error Name:', error.name);
    console.log('Error Code:', error.code);
    console.log('Error Message:', error.message);
  }
};
useEffect(() => {
  getCurrentLocation();
}, []);

const checkIfLocationEnabled = async () => {
  try {
    let enabled = await Location.hasServicesEnabledAsync();
    console.log('Location Services Enabled:', enabled);

    if (!enabled) {
      Alert.alert(
        'Location not enabled', 
        'Please enable your Location', 
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK', 
            onPress: () => console.log('OK Pressed')
          },
        ]
      );
      setLocationServicesEnabled(false);
    } else {
      setLocationServicesEnabled(true);
    }
  } catch (error) {
    console.error('Error checking location services:', error);
    setLocationServicesEnabled(false);
  }
};

useEffect(() => {
  const initializeLocation = async () => {
    await checkIfLocationEnabled();
    await getCurrentLocation();
  };

  initializeLocation();
}, []);

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

  //Camera
  if (!permission) {
    return (
      <View>
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center mb-4">
          We need your permission to access the camera
        </Text>
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
        console.error("Error capturing photo:", error);
      }
    } else {
      Alert.alert("Error", "Camera not ready");
    }
  };

  const handleDelete = (index) => {
    // Delete photo by filtering out the photo at the specified index
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };


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

      `{/* Location */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16 }}>Location</Text>
        <TextInput
        style={{ height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 8 }}
        placeholder="Enter address"
        value={location}
        onChangeText={setLocation}
      />
      {latitude && longitude ? (
    <>
      <Text className="font-semibold underline">Current Latitude:</Text>
      <Text>{latitude}</Text>
      <Text className="font-semibold underline">Current Longitude:</Text>
      <Text>{longitude}</Text>
    </>
  ) : (
    <Text>No location data available yet.</Text>)}
      </View>`

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

      {/* camera */}
      <View className="flex-1 h-60">
        <CameraView
          ref={cameraRef} 
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
      <ScrollView className="flex flex-row h-40 mt-2" horizontal={true}>
        {photos.map((uri, index) => (
          <View key={index} className="relative w-48 h-48 mr-4 mb-4">
            <Image source={{ uri }} className="w-full h-full rounded" />
            <TouchableOpacity
              onPress={() => handleDelete(index)} // Delete the specific photo
              className="absolute top-0 right-0 bg-red-500 p-2 rounded-full"
            >
              <Text className="text-white">
                {" "}
                <MaterialIcons name="delete" size={24} color="white" />{" "}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

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
