import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { db } from "../Firebase/config"; // Adjust the import based on your file structure
import { doc, getDoc } from "firebase/firestore";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const departmentName = sessionStorage.getItem("department");

      if (departmentName) {
        try {
          const departmentRef = doc(db, "departments", departmentName.trim());
          const departmentSnap = await getDoc(departmentRef);

          if (departmentSnap.exists()) {
            const employeeData = departmentSnap.data().employees;
            setEmployees(Object.values(employeeData));
          } else {
            console.log("No such department!");
          }
        } catch (error) {
          console.error("Error fetching employees: ", error);
        }
      } else {
        console.log("No department found in sessionStorage.");
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    employee.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Overview Section */}
      <View className="flex-row justify-between space-x-4 p-6 mb-4">
        <View className="bg-purple-600 text-white p-6 rounded-lg w-1/3">
          <Text className="text-2xl font-bold mb-2">Employee Overview</Text>
          <Text className="text-sm">Details of employees.</Text>
        </View>
        <View className="bg-purple-600 text-white p-6 rounded-lg w-1/3">
          <Text className="text-2xl font-bold mb-2">Department Metrics</Text>
          <Text className="text-sm">Metrics related to employee performance.</Text>
        </View>
        <View className="bg-purple-600 text-white p-6 rounded-lg w-1/3">
          <Text className="text-2xl font-bold mb-2">Upcoming Collaborations</Text>
          <Text className="text-sm">Upcoming projects and collaboration opportunities.</Text>
        </View>
      </View>

      {/* Search Section */}
      <View className="p-4 bg-gray-200 rounded-md shadow-md">
        <Text className="text-xl font-bold text-gray-800 mb-6">Employee Table</Text>

        {/* Search Inputs */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row space-x-4">
            <TextInput
              placeholder="Employee Name"
              className="border rounded-md p-2 text-sm w-1/3 text-gray-700"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
            <TextInput
              placeholder="Email"
              className="border rounded-md p-2 text-sm w-1/3 text-gray-700"
            />
            <TextInput
              placeholder="Phone Number"
              className="border rounded-md p-2 text-sm w-1/3 text-gray-700"
            />
          </View>
          <TouchableOpacity className="text-gray-600 hover:text-gray-800">
            <Text className="text-lg">Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Employee Table */}
        <View className="bg-white rounded-lg shadow overflow-x-auto">
          <FlatList
            data={filteredEmployees}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                key={index}
                className="flex-row bg-white border-b hover:bg-gray-50 p-4"
              >
                <Text className="flex-1">{item.Name}</Text>
                <Text className="flex-1">{item.gender}</Text>
                <Text className="flex-1">{item.email}</Text>
                <Text className="flex-1">{item.phone}</Text>
                <Text className="flex-1">{item.role}</Text>
                <Text className="flex-1">{item.designation}</Text>
                <Text className="flex-1">{new Date(item.hireDate).toLocaleDateString()}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center text-gray-700 py-3">No employees found.</Text>
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}
