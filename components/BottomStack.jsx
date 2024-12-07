import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TabBar from './TabBar';
import HomeScreen from '../screens/Home/HomeScreen';
import Documents from '../screens/Home/Documents';
import MapPlotting from './MapPlotting';


const Tab = createBottomTabNavigator();

const BottomStack = () => {
  return (
    <Tab.Navigator
      backBehavior="history"
      tabBar={props => <TabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialIcons name="home" size={24} color="white"/>
          ),
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Documents"
        component={Documents}
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialIcons name="article" size={24} color="white"/>
          ),
          tabBarLabel: 'Documents',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapPlotting}
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialIcons name="map" size={24} color="white"/>
          ),
          tabBarLabel: 'Map',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomStack;