import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/config';
import { tw } from 'nativewind';

const department = sessionStorage.getItem("department");
console.log(department);

const ProjectDetails = () => {
  const { projectId } = useRoute().params; // Getting projectId from route params
  const navigation = useNavigation();
  const [value, setValue] = useState(0);
  const [project, setProject] = useState(null);
  const [projectName1, setProjectName1] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const department = sessionStorage.getItem("department");
        const projectRef = doc(db, "projects", department.trim());
        const docSnap = await getDoc(projectRef);

        if (docSnap.exists()) {
          const projectsData = docSnap.data().Projects;
          let projectDetails = null;
          let projectName = '';

          for (const [name, details] of Object.entries(projectsData)) {
            if (details.projectID === projectId) {
              projectDetails = details;
              projectName = name;
              break;
            }
          }

          if (projectDetails) {
            setProject(projectDetails);
            setProjectName1(projectName);
          } else {
            console.log("Project not found!");
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching project details: ", error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleChange = (index) => {
    setValue(index);
  };

  const handleViewMap = () => {
    if (project && project.formattedCoordinates) {
      navigation.navigate('MapView', { coordinates: project.formattedCoordinates, projectName: projectName1 });
    } else {
      Alert.alert('No coordinates available for this project.');
    }
  };

  if (!project) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={tw`p-4`}>
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-bold`}>Project Details</Text>
      </View>

      {/* Tabs */}
      <View style={tw`flex-row border-b`}>
        <TouchableOpacity onPress={() => handleChange(0)} style={tw`flex-1 p-3 border-b ${value === 0 ? 'border-blue-500' : ''}`}>
          <Text style={tw`text-center`}>Project Info</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChange(1)} style={tw`flex-1 p-3 border-b ${value === 1 ? 'border-blue-500' : ''}`}>
          <Text style={tw`text-center`}>Timeline</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChange(2)} style={tw`flex-1 p-3 border-b ${value === 2 ? 'border-blue-500' : ''}`}>
          <Text style={tw`text-center`}>Tender & Financial</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChange(3)} style={tw`flex-1 p-3 border-b ${value === 3 ? 'border-blue-500' : ''}`}>
          <Text style={tw`text-center`}>Personnel</Text>
        </TouchableOpacity>
      </View>

      {/* Project Info Tab */}
      {value === 0 && (
        <View style={tw`mt-4`}>
          <Text style={tw`text-xl font-bold mb-2`}>Project Info</Text>
          <Text><Text style={tw`font-bold`}>Project Name:</Text> {projectName1}</Text>
          <Text><Text style={tw`font-bold`}>Project ID:</Text> {project.projectID}</Text>
          <Text><Text style={tw`font-bold`}>Location:</Text> 
            {project.formattedCoordinates ? (
              <TouchableOpacity onPress={handleViewMap}>
                <Text style={tw`text-blue-600`}>View on Map</Text>
              </TouchableOpacity>
            ) : (
              <Text>No coordinates available</Text>
            )}
          </Text>
          <Text><Text style={tw`font-bold`}>Department:</Text> {department}</Text>
        </View>
      )}

      {/* Timeline Tab */}
      {value === 1 && (
        <View style={tw`mt-4`}>
          <Text style={tw`text-xl font-bold mb-2`}>Timeline</Text>
          <Text><Text style={tw`font-bold`}>Project Start Date:</Text> {project.projectStartDate}</Text>
          <Text><Text style={tw`font-bold`}>Project End Date:</Text> {project.projectEndDate}</Text>
          <Text><Text style={tw`font-bold`}>Expected Completion Date:</Text> {project.expectedCompletionDate}</Text>
        </View>
      )}

      {/* Tender & Financial Tab */}
      {value === 2 && (
        <View style={tw`mt-4`}>
          <Text style={tw`text-xl font-bold mb-2`}>Tender & Financial Details</Text>
          <Text><Text style={tw`font-bold`}>Tender ID:</Text> {project.tenderID}</Text>
          <Text><Text style={tw`font-bold`}>Tender Issued Date:</Text> {project.tenderIssuedDate}</Text>
          <Text><Text style={tw`font-bold`}>Tender Closing Date:</Text> {project.tenderClosingDate}</Text>
          <Text><Text style={tw`font-bold`}>Budget Allocation:</Text> {project.budgetAllocation}</Text>
        </View>
      )}

      {/* Personnel Tab */}
      {value === 3 && (
        <View style={tw`mt-4`}>
          <Text style={tw`text-xl font-bold mb-2`}>Project Personnel</Text>
          <Text><Text style={tw`font-bold`}>Project Manager:</Text> {project.projectManager}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ProjectDetails;
