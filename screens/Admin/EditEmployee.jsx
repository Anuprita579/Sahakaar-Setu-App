import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/config";
import { useParams, useNavigate } from "react-router-dom";
import { View, Text, TextInput, Button, ScrollView } from "react-native";

export default function EditEmployee() {
  const { email } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

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

  const handleUpdateEmployee = async () => {
    const departmentName = sessionStorage.getItem("department");
    const departmentRef = doc(db, "departments", departmentName.trim());
    
    try {
      const updatedEmployees = {
        ...employee,
        hireDate: new Date(employee.hireDate).toISOString(),
      };

      await updateDoc(departmentRef, {
        [`employees.${email}`]: updatedEmployees,
      });

      navigate("/employee-management");
    } catch (error) {
      console.error("Error updating employee: ", error);
    }
  };

  return employee ? (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold mb-4">Edit Employee</Text>
      <View className="space-y-4">
        <TextInput
          value={employee.Name}
          onChangeText={(text) => setEmployee({ ...employee, Name: text })}
          className="border rounded-md px-2 py-1"
          placeholder="Employee Name"
        />
        <TextInput
          value={employee.designation}
          onChangeText={(text) =>
            setEmployee({ ...employee, designation: text })
          }
          className="border rounded-md px-2 py-1"
          placeholder="Designation"
        />
        <TextInput
          value={employee.phone}
          onChangeText={(text) =>
            setEmployee({ ...employee, phone: text })
          }
          className="border rounded-md px-2 py-1"
          placeholder="Phone"
        />
        {/* <TextInput
          value={new Date(employee.hireDate).toISOString().split("T")[0]}
          onChangeText={(text) =>
            setEmployee({ ...employee, hireDate: text })
          }
          className="border rounded-md px-2 py-1"
          placeholder="Hire Date"
        /> */}
      </View>
      <Button
        title="Save Changes"
        onPress={handleUpdateEmployee}
        color="#2563eb" // Tailwind bg-blue-600 equivalent
      />
    </ScrollView>
  ) : (
    <Text>Loading...</Text>
  );
}
