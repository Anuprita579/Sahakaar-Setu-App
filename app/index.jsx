import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';

import HeaderComponent from "../components/HeaderComponent";
import HomeScreen from "../screens/Home/HomeScreen"
import MapPlotting from "../components/MapPlotting";
import DepartmentLogin from "../screens/Login/DepartmentLogin"
import Documents from "../screens/Home/Documents"
import BottomStack from "../components/BottomStack";
import Profile from "../screens/Profile/Profile";
import CitizenLogin from "../screens/Login/CitizenLogin";
import DepartmentInfo from "../screens/Home/DepartmentInfo";
import Tasks from "../screens/Task/Tasks";
// import ReportForm from "../screens/ClassD/ReportForm";

const Stack = createStackNavigator();

export default function Index() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>

        {/* Header */}
        <HeaderComponent />
        

        <Stack.Navigator initialRouteName="BottomStack">
        <Stack.Screen name="BottomStack" showHeaders={false} options={{ headerShown: false }} component={BottomStack} />
          {/* <Stack.Screen name="Home" showHeaders={false} options={{ headerShown: false }} component={HomeScreen} /> */}
          <Stack.Screen name="MapPlotting" options={{ headerShown: false }} component={MapPlotting} />
          <Stack.Screen name="DepartmentLogin" options={{ headerShown: false }} component={DepartmentLogin} />
          <Stack.Screen name="CitizenLogin" options={{ headerShown: false }} component={CitizenLogin} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="DepartmentInfo" component={DepartmentInfo} />
          <Stack.Screen name="Tasks" component={Tasks} />

          {/* <Stack.Screen name="ReportForm" component={ReportForm} /> */}

        </Stack.Navigator>

      </NavigationContainer>
    </NavigationIndependentTree>
  );
}