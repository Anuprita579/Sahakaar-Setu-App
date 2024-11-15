import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/config';
import { useNavigation } from '@react-navigation/native';
import { NativeWindStyleSheet } from 'nativewind';

const WorkshopCard = ({ workshop }) => {
  return (
    <View className="bg-white rounded-lg shadow-md mb-6">
      {/* Workshop Image */}
      <Image
        className="w-full h-48 object-cover rounded-t-lg"
        source={{ uri: workshop.image }}
        alt={workshop.title}
      />

      {/* Workshop Details */}
      <View className="p-4">
        <Text className="text-2xl font-semibold mb-2">{workshop.title}</Text>
        <Text className="text-gray-600 mb-2">{workshop.date}</Text>
        <Text className="text-gray-800 mb-4">{workshop.description}</Text>

        {/* Target Audience */}
        <View className="mb-2">
          <Text className="font-bold">Target Audience:</Text>
          <Text>{workshop.audience}</Text>
        </View>

        {/* Speaker/Organizer */}
        <View className="mb-2">
          <Text className="font-bold">Speaker/Organizer:</Text>
          <Text>{workshop.speaker}</Text>
        </View>

        {/* Workshop Time */}
        <View className="mb-2">
          <Text className="font-bold">Time:</Text>
          <Text>{workshop.time}</Text>
        </View>

        {/* Venue */}
        <View className="mb-2">
          <Text className="font-bold">Venue:</Text>
          <Text>{workshop.venue}</Text>
        </View>

        {/* Registration Link */}
        {workshop.registrationLink && (
          <TouchableOpacity onPress={() => Linking.openURL(workshop.registrationLink)}>
            <Text className="text-indigo-600 hover:text-indigo-400 font-medium">
              Register Now
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [department, setDepartment] = useState(sessionStorage.getItem('department') || '');
  const [userName, setUsername] = useState(sessionStorage.getItem('name') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true');

  const navigation = useNavigation();

  function handleClick() {
    navigation.navigate('AddWorkshop'); // Adjust route name as per your navigation setup
  }

  // Fetch workshops from Firestore
  useEffect(() => {
    const fetchWorkshops = async () => {
      const querySnapshot = await getDocs(collection(db, 'workshops'));
      const workshopsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorkshops(workshopsList.sort((a, b) => new Date(a.date) - new Date(b.date)));
    };

    fetchWorkshops();
  }, []);

  return (
    <ScrollView className="flex-1 p-6">
      <View className='flex-row justify-between items-center mb-6'>
        <Text className="text-4xl font-bold">Upcoming Workshops & Seminars</Text>
        {isLoggedIn && (
          <TouchableOpacity
            className='bg-blue-500 rounded-xl p-2'
            onPress={handleClick}
          >
            <Text className="text-white font-medium">Add Workshop</Text>
          </TouchableOpacity>
        )}
      </View>
      {workshops.length ? (
        workshops.map((workshop) => (
          <WorkshopCard key={workshop.id} workshop={workshop} />
        ))
      ) : (
        <Text>Loading workshops...</Text>
      )}
    </ScrollView>
  );
};

export default Workshops;
