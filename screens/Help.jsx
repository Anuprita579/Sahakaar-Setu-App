import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, ScrollView } from 'react-native';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../Firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker'; // Correct Picker import

const Help = () => {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const faqCollection = collection(db, 'HelpPage');
        const q = query(faqCollection, orderBy('timestamp', 'desc'));
        const faqSnapshot = await getDocs(q);
        const faqList = faqSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuestions(faqList);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const departmentsCollection = collection(db, 'departmentsInfo');
        const departmentsSnapshot = await getDocs(departmentsCollection);
        const departmentsList = departmentsSnapshot.docs.map((doc) => doc.data());
        setDepartments(departmentsList);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchFAQs();
    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const userName = await AsyncStorage.getItem('name');
      const userEmail = await AsyncStorage.getItem('email');

      const faqData = {
        question,
        department,
        userName,
        userEmail,
        timestamp: new Date(),
        answer: '', // Initially empty
      };

      const faqCollection = collection(db, 'HelpPage');
      await addDoc(faqCollection, faqData);

      // Update the questions list locally after submitting
      setQuestions((prev) => [{ ...faqData, id: Date.now() }, ...prev]);
      setQuestion('');
      setDepartment('');
      Alert.alert('Your question has been submitted!');
    } catch (error) {
      console.error('Error submitting question:', error);
      Alert.alert('Failed to submit your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={{ maxWidth: 800, marginHorizontal: 'auto', padding: 24, backgroundColor: 'white', shadowRadius: 4, borderRadius: 12 }}>
      {/* Heading Banner */}
      <View style={{ display: 'flex', alignItems: 'center', paddingVertical: 40, position: 'relative', backgroundColor: '#FFFAE5', paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E40AF' }}>
          Looking for help? Here are our most frequently asked questions.
        </Text>
        <Text style={{ color: '#1E40AF', fontSize: 14, marginTop: 8 }}>
          Everything you want to know about Sahkaar Setu. Can't find the answer to a question you have? No worries, just write your question and select the department and click on Submit Question.
        </Text>

        <View style={{ borderWidth: 2, borderColor: '#1E40AF', borderRadius: 50, paddingHorizontal: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
          <MaterialIcons name="search" size={20} />
          <TextInput
            style={{ padding: 8, borderWidth: 0, borderRadius: 8, width: 240, backgroundColor: 'transparent', fontSize: 14 }}
            placeholder="Search messages..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>
      </View>

      {/* Question Form */}
      <View style={{ paddingVertical: 32 }}>
        <TextInput
          style={{ marginTop: 4, width: '100%', borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', padding: 8, fontSize: 14 }}
          placeholder="Type your question here..."
          value={question}
          onChangeText={setQuestion}
          multiline
          numberOfLines={3}
        />

        {/* Department dropdown */}
        <Text style={{ marginTop: 8, fontSize: 12, fontWeight: '500', color: '#4B5563' }}>Choose Department (Optional)</Text>
        <View className= "border-2 border-gray-200 p-0 mb-7 mt-2 rounded-lg">
          <Picker
            selectedValue={department}
            onValueChange={setDepartment}
            style={{ width: '100%', borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', fontSize: 14 }}
          >
            <Picker.Item label="None" value="" />
            {departments.map((dept, index) => (
              <Picker.Item key={index} label={dept.departmentName} value={dept.departmentName} />
            ))}
          </Picker>
        </View>

        <Button
          title={loading ? 'Submitting...' : 'Submit Question'}
          onPress={handleSubmit}
          disabled={loading || !question.trim()}
        />
      </View>

      {/* FAQ List */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#4B5563' }}>Frequently Asked Questions</Text>
        {filteredQuestions.length === 0 ? (
          <Text style={{ color: '#4B5563' }}>No questions have been asked yet. Be the first!</Text>
        ) : (
          <FlatList
            data={filteredQuestions}
            renderItem={({ item }) => (
              <View style={{ padding: 16, borderRadius: 8, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 }}>
                <Text style={{ color: '#1F2937', fontWeight: '500' }}>
                  <MaterialIcons name="question-answer" size={18} /> {item.question}
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                  Asked by {item.userName || 'Anonymous'} {item.department && ` | Department: ${item.department}`}
                </Text>
                {item.answer ? (
                  <Text style={{ marginTop: 8, color: '#374151' }}>
                    <Text style={{ fontWeight: '600', color: '#6B7280' }}>Answer:</Text> {item.answer}
                  </Text>
                ) : (
                  <Text style={{ marginTop: 8, fontSize: 12, color: '#9CA3AF' }}>No answer yet.</Text>
                )}
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default Help;
