import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/config';
import { useNavigation } from '@react-navigation/native';

const TaskAssigned = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const department = sessionStorage.getItem('department');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        // Reference to the department document
        const departmentDocRef = doc(db, 'tasks', department);
        const departmentDoc = await getDoc(departmentDocRef);

        if (departmentDoc.exists()) {
          const independentTasks = departmentDoc.data().independent_tasks || {};
          const tasksArray = Object.entries(independentTasks).map(([taskId, taskData]) => ({
            taskId,
            ...taskData,
          }));

          setTasks(tasksArray);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching tasks: ', error);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [department]);

  const handleViewTask = (taskId) => {
    navigation.navigate('TaskDetails', { taskId });
  };

  const handleAddTasks = () => {
    navigation.navigate('AddTask');
  };

  const renderTask = ({ item }) => (
    <View className="bg-white p-4 rounded-lg mb-2 shadow">
      <Text className="text-gray-800 font-semibold">Task ID: {item.taskId}</Text>
      <Text className="text-gray-600">Name: {item.taskName}</Text>
      <Text className="text-gray-600">Deadline: {item.deadline}</Text>
      <Text className="text-gray-600">Progress: {item.progress}</Text>
      <Text className="text-gray-600">Priority: {item.priority}</Text>
      <TouchableOpacity
        className="mt-2 bg-blue-500 py-2 px-4 rounded"
        onPress={() => handleViewTask(item.taskId)}
      >
        <Text className="text-white text-center">View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-semibold">TASK DETAILS</Text>
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded"
          onPress={handleAddTasks}
        >
          <Text className="text-white">+ Add Tasks</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text className="text-gray-600">Loading tasks...</Text>
      ) : error ? (
        <Text className="text-red-500">{error}</Text>
      ) : tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.taskId}
          renderItem={renderTask}
          className="mt-4"
        />
      ) : (
        <Text className="text-gray-600">No tasks available.</Text>
      )}
    </ScrollView>
  );
};

export default TaskAssigned;
