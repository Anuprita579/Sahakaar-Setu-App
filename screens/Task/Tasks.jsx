import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons from react-native-vector-icons
import { db } from '../../Firebase/config'; // Ensure Firebase is configured
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Report from "../Report"

const TaskShortCard = ({
  backgroundImgLink,
  icon,
  title,
  contentNumber,
  totalNumber,
  className,
  iconClassName,
}) => {
  const IconComponent = icon;

  return (
    <View style={{ position: 'relative', padding: 16, backgroundColor: '#D1F7C4', borderRadius: 8 }}>
      <ImageBackground
        source={{ uri: backgroundImgLink }}
        style={{ flex: 1, justifyContent: 'center', opacity: 0.2, borderRadius: 8 }}
      >
        <View style={{ ...iconClassName, alignItems: 'center', justifyContent: 'center' }}>
          <Text><Icon name={icon} size={24} color="white" /></Text>
        </View>
        <Text style={{ color: '#2D3748' }}>{title}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{`${contentNumber}/${totalNumber} Task`}</Text>
      </ImageBackground>
    </View>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectQuery, setProjectQuery] = useState('');
  const [taskQuery, setTaskQuery] = useState('');
  const [startDateQuery, setStartDateQuery] = useState('');
  const [endDateQuery, setEndDateQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentName = await AsyncStorage.getItem('userDepartment');
        const employeeEmail = await AsyncStorage.getItem('userEmail');

        if (!departmentName || !employeeEmail) {
          setError('Missing department or email in session storage');
          return;
        }

        const taskRef = doc(db, 'tasks', departmentName);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
          const tasksData = taskSnap.data().Tasks;
          const projectIdsToFetch = [];

          // Map through tasks to find tasks assigned to this employee
          for (const [taskName, details] of Object.entries(tasksData)) {
            const isAssigned = details.assignedEmployees.some(
              (emp) => emp.email === employeeEmail
            );
            if (isAssigned) {
              projectIdsToFetch.push(details.projectId);
            }
          }

          setTasks(Object.entries(tasksData));

          if (projectIdsToFetch.length > 0) {
            const projectRef = doc(db, 'projects', departmentName);
            const projectSnap = await getDoc(projectRef);

            if (projectSnap.exists()) {
              const data = projectSnap.data();
              const projectsData = data.Projects;
              const projectList = [];

              for (const [projectName, projectDetails] of Object.entries(projectsData)) {
                if (projectIdsToFetch.includes(projectDetails.projectID)) {
                  projectList.push({
                    projectId: projectDetails.projectID,
                    projectName,
                    projectManager: projectDetails.projectManager,
                    startDate: projectDetails.projectStartDate,
                    endDate: projectDetails.projectEndDate,
                  });
                }
              }

              setProjects(projectList);
            } else {
              setError('No project data found for this department.');
            }
          } else {
            setError('No tasks found for this employee.');
          }
        } else {
          setError("Department's task document does not exist.");
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
        setError('Error fetching task details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = projects.filter((project) => {
      return (
        project.projectName.toLowerCase().includes(projectQuery.toLowerCase()) &&
        project.projectManager.toLowerCase().includes(taskQuery.toLowerCase())
      );
    });

    setFilteredData(filtered);
  }, [projects, projectQuery, taskQuery]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <ScrollView style={{ padding: 16, backgroundColor: '#FFFFFF' }}>
      {/* Task Summary Section */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <TaskShortCard
          title="Priority Task"
          contentNumber={2} // Adjust this value dynamically
          totalNumber={tasks.length}
          icon="tasks" // FontAwesome icon
          iconClassName={{
            backgroundColor: '#38A169',
            borderRadius: 50,
            padding: 8,
            height: 40,
            width: 40,
          }}
          backgroundImgLink="https://img.freepik.com/free-vector/sunset-landscape-with-lake-trees_107791-12785.jpg"
        />
        <TaskShortCard
          title="Upcoming Task"
          contentNumber={1} // Adjust this value dynamically
          totalNumber={tasks.length}
          icon="calendar" // FontAwesome icon
          iconClassName={{
            backgroundColor: '#3182CE',
            borderRadius: 50,
            padding: 8,
            height: 40,
            width: 40,
          }}
          backgroundImgLink="https://img.freepik.com/free-photo/fantastic-cloudscape_1232-490.jpg"
        />
      </View>

      {/* Filter Section */}
      <View style={{ marginBottom: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        <Text><Icon name="filter" size={24} color="#6B7280" /></Text>
        <TextInput
          style={{ borderWidth: 1, borderRadius: 4, padding: 8, fontSize: 14, width: 150 }}
          placeholder="Project Name"
          value={projectQuery}
          onChangeText={(text) => setProjectQuery(text)}
        />
        <TextInput
          style={{ borderWidth: 1, borderRadius: 4, padding: 8, fontSize: 14, width: 150 }}
          placeholder="Task Name"
          value={taskQuery}
          onChangeText={(text) => setTaskQuery(text)}
        />
        <TextInput
          style={{ borderWidth: 1, borderRadius: 4, padding: 8, fontSize: 14, width: 150 }}
          placeholder="Start Date"
          value={startDateQuery}
          onChangeText={(text) => setStartDateQuery(text)}
        />
        <TextInput
          style={{ borderWidth: 1, borderRadius: 4, padding: 8, fontSize: 14, width: 150 }}
          placeholder="End Date"
          value={endDateQuery}
          onChangeText={(text) => setEndDateQuery(text)}
        />
      </View>

      {/* Table Section */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          shadowColor: '#000000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          overflowX: 'auto',
          padding: 16,
        }}
      >
        <ScrollView style={{ padding: 16, backgroundColor: '#FFFFFF' }} >
      {/* Table Header Row with Horizontal Scroll */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 8,
          borderBottomWidth: 1,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#4B5563' }}>Project Id</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#4B5563' }}>Project Name</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#4B5563' }}>Task Id</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#4B5563' }}>Task Name</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#4B5563' }}>Task Start Date</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#4B5563' }}>Task Deadline</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#4B5563' }}>Task Status</Text>
      </View>

      {/* Horizontal Scroll for the rows */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {filteredData.map((project) => (
          <View
            key={project.projectId}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 8,
              borderBottomWidth: 1,
            }}
          >
            {/* Add the task data dynamically */}
            <Text style={{ color: '#4B5563', minWidth: 100 }}>{project.projectId}</Text>
            <Text style={{ color: '#4B5563', minWidth: 150 }}>{project.projectName}</Text>
            <Text style={{ color: '#4B5563', minWidth: 100 }}>{tasks.taskId}</Text> {/* Use a valid task ID from your data */}
            {/* <Text style={{ color: '#4B5563', minWidth: 150 }}>{}</Text> */}
            <Text style={{ color: '#4B5563', minWidth: 120 }}>2024-08-30</Text> {/* Update with dynamic task start date */}
            <Text style={{ color: '#4B5563', minWidth: 120 }}>2024-09-04</Text> {/* Update with dynamic task deadline */}
            <Text style={{ color: '#4B5563', minWidth: 120 }}>Complete</Text> {/* Update task status */}
          </View>
        ))}
      </ScrollView>
    </ScrollView>
      </View>
      <Report/>
    </ScrollView>


    
  );
};

export default Tasks;
