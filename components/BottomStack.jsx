import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TabBar from './TabBar';
import HomeScreen from '../screens/Home/HomeScreen';
import Documents from '../screens/Home/Documents';
import MapPlotting from './MapPlotting';
import Tasks from '../screens/Task/Tasks';
import Grievance from '../screens/Grievance/Grievance';  // Import Grievance Screen
import Help from '../screens/Help';  // Import Help Screen
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

const Tab = createBottomTabNavigator();

const BottomStack = () => {
  const [userType, setUserType] = useState(null);  // State to store user type (citizen or employee)

  // Function to check user login status and user type
  const checkUserType = async () => {
    const type = await AsyncStorage.getItem('type'); // Get user type from AsyncStorage
    setUserType(type);  // Set user type based on the data retrieved
  };

  useEffect(() => {
    checkUserType();  // Check user type when the component mounts
  }, []);

  return (
    <Tab.Navigator
    backBehavior="history"
    tabBar={(props) => <TabBar {...props} />}>

    <Tab.Screen
      name="Home"
      initialRoute="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <MaterialIcons name="home" size={24} color="white" />
        ),
        tabBarLabel: 'Home',
        headerShown: false,
      }}
    />

    {userType === 'citizen' ? (
      <>
        <Tab.Screen
          name="Grievance"
          component={Grievance}  // Citizen can see Grievance tab
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="report-problem" size={24} color="white" />
            ),
            tabBarLabel: 'Grievance',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Help"
          component={Help}  // Citizen can see Help tab
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="help" size={24} color="white" />
            ),
            tabBarLabel: 'Help',
            headerShown: false,
          }}
        />
      </>
    ) : (
      <>
        <Tab.Screen
          name="Task"
          component={Tasks}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="task" size={24} color="white" />
            ),
            tabBarLabel: 'Task',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Documents"
          component={Documents}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="article" size={24} color="white" />
            ),
            tabBarLabel: 'Documents',
            headerShown: false,
          }}
        />
      </>
    )}

  </Tab.Navigator>
  );
};

export default BottomStack;
