import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DepartmentCard from "./DepartmentCard";

const DepartmentDirectory = () => {
    const [departments, setDepartments] = useState([
        // Mock data - replace with actual data or API fetching logic
        {
            departmentName: "Ministry of Education",
            servicesProvided: "Service1, Service2, Service3",
            overview: "This is a brief overview of the department.",
            noOfProj: 5,
            budgetAllotted: "$2M",
            email: "email@domain.com",
            contactNumber: "+123456789",
        },
        {
            departmentName: "Ministry of Health",
            servicesProvided: "Service1, Service2",
            overview: "Overview of the health department.",
            noOfProj: 3,
            budgetAllotted: "$5M",
            email: "health@domain.com",
            contactNumber: "+987654321",
        },
        // Add more department data as needed
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 3;

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? departments.length - itemsToShow : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= departments.length - itemsToShow ? 0 : prevIndex + 1
        );
    };

    return (
        <ScrollView className="flex p-4" horizontal={true}>
            {departments
                .slice(currentIndex, currentIndex + itemsToShow)
                .map((department, index) => (
                    <DepartmentCard
                        key={index}
                        ministryName={department.departmentName}
                        departments={
                            department.servicesProvided
                                ?.split(",")
                                .map((service) => ({ label: service.trim() })) || []
                        }
                        desc={department.overview || "No description available."}
                        noOfProj={department.noOfProj || "N/A"}
                        budgetAllotted={department.budgetAllotted || "N/A"}
                        newsTitle="No recent news"
                        emailId={department.email || "Not provided"}
                        mobileNo={department.contactNumber || "Not provided"}
                    />
                ))}
        </ScrollView>
    );
};

export default DepartmentDirectory;