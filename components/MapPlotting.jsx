import React, { useState } from "react";
import MapView, { Polygon, Marker } from "react-native-maps";
import { View, Text, Button } from "react-native";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";

const MapPlotting = ({ setCoordinates }) => {
  const [coordinates, setLocalCoordinates] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const navigation = useNavigation();

  const handleMapPress = (e) => {
    if (isAdding) {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      setLocalCoordinates((prevCoords) => [...prevCoords, { latitude, longitude }]);
    }
  };

  const handleFinalize = () => {
    setIsAdding(false);
    localStorage.setItem("coordinates", JSON.stringify(coordinates)); // Simulating persistent storage
    navigation.navigate("AddProject"); // Navigate to the AddProject screen
  };

  const handleClear = () => {
    setLocalCoordinates([]);
  };

  return (
    <View className="flex-1 h-96">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 19.076,
          longitude: 72.8777,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {coordinates.length > 0 &&
          coordinates.map((coord, index) => (
            <Marker key={index} coordinate={coord} />
          ))}

        {coordinates.length > 2 && (
          <Polygon
            coordinates={coordinates}
            strokeColor="blue"
            fillColor="rgba(0, 0, 255, 0.4)"
          />
        )}
      </MapView>

      <View className="flex-row justify-around p-4 bg-white">
        <Button title="Add Points" onPress={() => setIsAdding(true)} />
        <Button
          title="Finalize"
          onPress={handleFinalize}
          disabled={!isAdding || coordinates.length < 3}
        />
        <Button title="Clear" onPress={handleClear} />
      </View>
    </View>
  );
};

export default MapPlotting;
