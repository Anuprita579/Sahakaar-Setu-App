import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { db } from "../Firebase/config";
import { collection, getDocs } from "firebase/firestore";

const departmentColors = {
  "Public Health and Sanitation": "#B22222", // Dark Red
  "Public Works": "#228B22", // Forest Green
  "Environment and Parks": "#1E90FF", // Dodger Blue
  "Education": "#8B008B", // Dark Magenta
  "Water Supply and Sewage": "#20B2AA", // Light Sea Green
  "Housing and Urban Poverty Alleviation": "#8B0000", // Dark Red
  "Legal and General Administration": "#9400D3", // Dark Violet
  "Fire Services": "#9ACD32", // Yellow Green
  "Finance and Accounts": "yellow", // Dark Red
  "Urban Planning and Development": "orange", // Dodger Blue
};

const MapComponents = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          Alert.alert("Error", "Unable to fetch location");
        }
      );
    } else {
      Alert.alert("Error", "Geolocation is not supported by this device");
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsCollectionRef = collection(db, "projects");
        const projectsSnapshot = await getDocs(projectsCollectionRef);
        const allProjects = [];

        projectsSnapshot.forEach((doc) => {
          const departmentData = doc.data();
          const projectsData = departmentData.Projects;

          if (projectsData) {
            Object.keys(projectsData).forEach((projectName) => {
              const projectDetails = projectsData[projectName];

              if (projectDetails) {
                allProjects.push({
                  ...projectDetails,
                  projectName,
                  department: doc.id,
                  coordinates: projectDetails.formattedCoordinates || [],
                });
              }
            });
          }
        });

        setProjects(allProjects);
      } catch (error) {
        console.error("Error fetching project details: ", error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (coordinates) => {
    if (coordinates.length > 0) {
      setSelectedCoordinates({
        latitude: coordinates[0].lat,
        longitude: coordinates[0].lng,
      });
    }
  };

  return (
    <View className="flex-1">
      <View className="h-4/6">
        <MapView
          className="flex-1"
          initialRegion={{
            latitude: userPosition?.latitude || 19.076,
            longitude: userPosition?.longitude || 72.8777,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          region={
            selectedCoordinates
              ? {
                  latitude: selectedCoordinates.latitude,
                  longitude: selectedCoordinates.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }
              : undefined
          }
        >
          {userPosition && (
            <Marker
              coordinate={userPosition}
              title="You are here"
              pinColor="blue"
            />
          )}

          {projects.map((project, index) => (
            <Polygon
              key={index}
              coordinates={project.coordinates.map((coord) => ({
                latitude: coord.lat,
                longitude: coord.lng,
              }))}
              strokeColor={departmentColors[project.department] || "blue"}
              fillColor={(departmentColors[project.department] || "blue") + "80"} // Add transparency
              tappable
              onPress={() => handleProjectClick(project.coordinates)}
            />
          ))}
        </MapView>
      </View>

      <View className="h-2/6 bg-white rounded-t-xl p-4">
        <Text className="text-xl font-bold mb-4">Ongoing Projects</Text>
        <ScrollView>
          {projects.map((project, index) => (
            <TouchableOpacity
              key={index}
              className="p-3 mb-2 bg-gray-100 rounded-lg"
              onPress={() => handleProjectClick(project.coordinates)}
            >
              <Text className="text-base font-semibold text-gray-700">
                {project.projectName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default MapComponents;
