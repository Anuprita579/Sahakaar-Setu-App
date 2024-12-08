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

        </Stack.Navigator>

      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Dimensions } from 'react-native';

// import Home from '../screens/Home/News';
// // import EmployeeRegister from './Pages/RegisterEmployee';
// // import Login from './Pages/Login';
// // import AdminDashboard from './Pages/AdminDashboard';
// // import Reports from './Pages/Reports';
// // import Projects from './Pages/Projects';
// // import Header from './Components/HeaderLayout';
// // import DepartmentRegistration from './Pages/DepartmentRegistration';
// // import Sidebar from './Components/Sidebar';
// // import Profile from './Pages/Profile';
// // import ResourceInventory from './Pages/ResourceInventory';
// // import DiscussionForum from './Pages/Forum/DiscussionForum';
// // import Tasks from './Pages/Tasks';
// // import ProjectDetails from './Pages/ProjectDetails';
// // import ResourceProvider from './utils/ResourceContext';
// // import AddProject from './Pages/AddProject';
// // import Departments from './Pages/Departments';
// // import AddDepartments from './Pages/AddDepartments';
// // import DepartmentsInfo from './Pages/DepartmentsInfo';
// // import EnterOTP from './Pages/EnterOtp';
// // import ResetPassword from './Pages/ResetPassword';
// // import RegisterCitizen from './Pages/RegisterCitizen';
// // import AddProjectTask from './Pages/AddProjectTask';
// // import TaskDetails from './Pages/TaskDetails';
// import MapPlotting from '../components/MapPlotting';
// import MapViewProject from '../components/MapViewProject';
// // import Employees from './Pages/Employee';
// // import AddTask from './Pages/AddTask';
// // import TaskAssigned from './Pages/TaskAssigned';
// // import TaskAssignedDetails from './Pages/TaskAssignedDetails';
// // import RegisterEmployee from './Pages/RegisterEmployee';
// // import MeetTheTeam from './Pages/MeetTheTeam';
// // import AllProjects from './Pages/AllProjects';
// // import GrievanceForm from './Pages/Grievance/grievance';
// // import Workshops from './Pages/Workshop/Workshop';
// // import AddWorkshop from './Pages/Workshop/WorkshopAdd';
// // import AnnouncementsList from './Pages/announcement/Announce';
// // import AddAnnouncementForm from './Pages/announcement/AnnounceAdd';
// // import DepartmentLogin from './Pages/DepartmentLogin';
// // import CitizenLogin from './Pages/CitizenLogin';
// // import EmployeeLogin from './Pages/EmployeeLogin';
// // import AdminLogin from './Pages/AdminLogin';
// // import Employee from './Pages/employeeManagement/Employees';
// // import EmployeeDetails from './Pages/employeeManagement/EmployeeDetails';
// // import EditEmployee from './Pages/employeeManagement/EditEmployee';
// // import EditTask from './Pages/EditTask';

// const { width, height } = Dimensions.get('window');

// const Stack = createNativeStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       {/* <StatusBar style="auto" /> */}
//       {/* <ResourceProvider> */}
//         <Stack.Navigator initialRouteName="Home">
//           <Stack.Screen name="Home" component={Home} />
//           {/* <Stack.Screen
//             name="EmployeeRegister"
//             component={EmployeeRegister}
//           />
//           <Stack.Screen name="Login" component={Login} />
//           <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
//           <Stack.Screen name="Reports" component={Reports} />
//           <Stack.Screen name="Projects" component={Projects} />
//           <Stack.Screen name="Header" component={Header} />
//           <Stack.Screen
//             name="DepartmentRegistration"
//             component={DepartmentRegistration}
//           />
//           <Stack.Screen name="Sidebar" component={Sidebar} />
//           <Stack.Screen name="Profile" component={Profile} />
//           <Stack.Screen
//             name="ResourceInventory"
//             component={ResourceInventory}
//           />
//           <Stack.Screen
//             name="DiscussionForum"
//             component={DiscussionForum}
//           />
//           <Stack.Screen name="Tasks" component={Tasks} />
//           <Stack.Screen
//             name="ProjectDetails"
//             component={ProjectDetails}
//           />
//           <Stack.Screen name="AddProject" component={AddProject} />
//           <Stack.Screen name="Departments" component={Departments} />
//           <Stack.Screen
//             name="AddDepartments"
//             component={AddDepartments}
//           />
//           <Stack.Screen
//             name="DepartmentsInfo"
//             component={DepartmentsInfo}
//           />
//           <Stack.Screen name="EnterOTP" component={EnterOTP} />
//           <Stack.Screen
//             name="ResetPassword"
//             component={ResetPassword}
//           />
//           <Stack.Screen
//             name="RegisterCitizen"
//             component={RegisterCitizen}
//           />
//           <Stack.Screen
//             name="AddProjectTask"
//             component={AddProjectTask}
//           />
//           <Stack.Screen
//             name="TaskDetails"
//             component={TaskDetails}
//           /> */}
//           <Stack.Screen name="MapPlotting" component={MapPlotting} />
//           <Stack.Screen
//             name="MapViewProject"
//             component={MapViewProject}
//           />
//           {/* <Stack.Screen name="Employees" component={Employees} />
//           <Stack.Screen name="AddTask" component={AddTask} />
//           <Stack.Screen
//             name="TaskAssigned"
//             component={TaskAssigned}
//           />
//           <Stack.Screen
//             name="TaskAssignedDetails"
//             component={TaskAssignedDetails}
//           />
//           <Stack.Screen
//             name="RegisterEmployee"
//             component={RegisterEmployee}
//           />
//           <Stack.Screen name="MeetTheTeam" component={MeetTheTeam} />
//           <Stack.Screen name="AllProjects" component={AllProjects} />
//           <Stack.Screen
//             name="GrievanceForm"
//             component={GrievanceForm}
//           />
//           <Stack.Screen name="Workshops" component={Workshops} />
//           <Stack.Screen name="AddWorkshop" component={AddWorkshop} />
//           <Stack.Screen
//             name="AnnouncementsList"
//             component={AnnouncementsList}
//           />
//           <Stack.Screen
//             name="AddAnnouncementForm"
//             component={AddAnnouncementForm}
//           />
//           <Stack.Screen
//             name="DepartmentLogin"
//             component={DepartmentLogin}
//           />
//           <Stack.Screen
//             name="CitizenLogin"
//             component={CitizenLogin}
//           />
//           <Stack.Screen
//             name="EmployeeLogin"
//             component={EmployeeLogin}
//           />
//           <Stack.Screen
//             name="AdminLogin"
//             component={AdminLogin}
//           />
//           <Stack.Screen
//             name="Employee"
//             component={Employee}
//           />
//           <Stack.Screen
//             name="EmployeeDetails"
//             component={EmployeeDetails}
//           />
//           <Stack.Screen
//             name="EditEmployee"
//             component={EditEmployee}
//           />
//           <Stack.Screen
//             name="EditTask"
//             component={EditTask}
//           /> */}
//         </Stack.Navigator>
//       {/* </ResourceProvider> */}
//     </NavigationContainer>
//   );
// }

// export default App;