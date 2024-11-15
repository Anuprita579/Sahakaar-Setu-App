import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';

function MapViewProject() {
  const route = useRoute();
  const { coordinates = [], projectName = '' } = route.params || {};

  // Convert coordinates into the correct format for Polygon
  const polygonCoordinates = coordinates.map(coord => ({
    latitude: coord.lat,
    longitude: coord.lng,
  }));

  // Center of the polygon (computed as the average of all coordinates)
  const center =
    polygonCoordinates.length > 0
      ? {
          latitude: polygonCoordinates.reduce((sum, coord) => sum + coord.latitude, 0) / polygonCoordinates.length,
          longitude: polygonCoordinates.reduce((sum, coord) => sum + coord.longitude, 0) / polygonCoordinates.length,
        }
      : { latitude: 0, longitude: 0 };

  return (
    <View className="flex-1">
      <MapView
        className="flex-1"
        initialRegion={{
          ...center,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {polygonCoordinates.length > 0 && (
          <>
            <Polygon coordinates={polygonCoordinates} strokeColor="blue" fillColor="rgba(0, 0, 255, 0.2)" />
            <Marker coordinate={center}>
              <View className="bg-white p-2 rounded-lg">
                <Text className="text-blue-500 font-bold">{projectName}</Text>
              </View>
            </Marker>
          </>
        )}
      </MapView>
    </View>
  );
}

export default MapViewProject;
