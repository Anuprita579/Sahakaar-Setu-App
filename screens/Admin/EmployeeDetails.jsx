import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/config";
import { useParams } from "react-router-dom";
import { View, Text, ScrollView } from "react-native";

export default function EmployeeDetails() {
  const { email } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      const departmentName = sessionStorage.getItem("department");
      const departmentRef = doc(db, "departments", departmentName.trim());
      const departmentSnap = await getDoc(departmentRef);

      if (departmentSnap.exists()) {
        const employees = departmentSnap.data().employees;
        const selectedEmployee = Object.values(employees).find(
          (emp) => emp.email === email
        );
        setEmployee(selectedEmployee);
      } else {
        console.log("No such department!");
      }
    };

    fetchEmployeeDetails();
  }, [email]);

  return employee ? (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold mb-4">Employee Details</Text>
      <View className="mb-2">
        <Text className="font-medium">
          <Text className="font-bold">Name: </Text>{employee.Name}
        </Text>
      </View>
      <View className="mb-2">
        <Text className="font-medium">
          <Text className="font-bold">Email: </Text>{employee.email}
        </Text>
      </View>
      <View className="mb-2">
        <Text className="font-medium">
          <Text className="font-bold">Phone: </Text>{employee.phone}
        </Text>
      </View>
      <View className="mb-2">
        <Text className="font-medium">
          <Text className="font-bold">Gender: </Text>{employee.gender}
        </Text>
      </View>
      <View className="mb-2">
        <Text className="font-medium">
          <Text className="font-bold">Role: </Text>{employee.role}
        </Text>
      </View>
      <View className="mb-2">
        <Text className="font-medium">
          <Text className="font-bold">Designation: </Text>{employee.designation}
        </Text>
      </View>
      <View className="mb-2">
        <Text className="font-medium">
          <Text className="font-bold">Hire Date: </Text>{new Date(employee.hireDate).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  ) : (
    <Text>Loading...</Text>
  );
}
