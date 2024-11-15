import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Firebase/config';

const AddWorkshop = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    audience: '',
    speaker: '',
    venue: '',
    image: '',
    registrationLink: ''
  });

  // Get user session data for authorization
  const classtype = sessionStorage.getItem('classType');
  const department = sessionStorage.getItem('department');

  // Check if user is authorized (adjust this logic based on your requirements)
  const isAuthorized = classtype === 'Platform Admin' || department === 'workshop-admin';

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'workshops'), formData);
      Alert.alert('Success', 'Workshop added successfully!');
    } catch (error) {
      console.error('Error adding workshop:', error);
      Alert.alert('Error', 'Error adding workshop.');
    }
  };

  if (!isAuthorized) {
    return <Text>You are not authorized to add workshops. Only platform admin.</Text>;
  }

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-3xl font-semibold mb-4">Add New Workshop</Text>
      <View className="space-y-4">
        <View>
          <Text className="font-semibold mb-2">Title</Text>
          <TextInput
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Enter title"
          />
        </View>

        <View>
          <Text className="font-semibold mb-2">Description</Text>
          <TextInput
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Enter description"
            multiline
          />
        </View>

        <View>
          <Text className="font-semibold mb-2">Date</Text>
          <TextInput
            value={formData.date}
            onChangeText={(text) => handleInputChange('date', text)}
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Enter date"
          />
        </View>

        <View>
          <Text className="font-semibold mb-2">Time</Text>
          <TextInput
            value={formData.time}
            onChangeText={(text) => handleInputChange('time', text)}
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Enter time"
          />
        </View>

        <View>
          <Text className="font-semibold mb-2">Target Audience</Text>
          <TextInput
            value={formData.audience}
            onChangeText={(text) => handleInputChange('audience', text)}
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Enter audience"
          />
        </View>

        <View>
          <Text className="font-semibold mb-2">Speaker/Organizer</Text>
          <TextInput
            value={formData.speaker}
            onChangeText={(text) => handleInputChange('speaker', text)}
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Enter speaker/organizer"
          />
        </View>

        <View>
          <Text className="font-semibold mb-2">Venue</Text>
          <TextInput
            value={formData.venue}
            onChangeText={(text) => handleInputChange('venue', text)}
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Enter venue"
          />
        </View>

        <View>
          <Text className="font-semibold mb-2">Image URL</Text>
          <TextInput
            value={formData.image}
            onChangeText={(text) => handleInputChange('image', text)}
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Enter image URL"
          />
        </View>

        <View>
          <Text className="font-semibold mb-2">Registration Link</Text>
          <TextInput
            value={formData.registrationLink}
            onChangeText={(text) => handleInputChange('registrationLink', text)}
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Enter registration link"
          />
        </View>

        <Button title="Add Workshop" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default AddWorkshop;
