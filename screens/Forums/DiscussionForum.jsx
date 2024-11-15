import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, FlatList, TouchableOpacity, Picker, ActivityIndicator } from 'react-native';
import { ref, onValue, push, set } from 'firebase/database';
import { db2 } from "../../Firebase/config.js";
import Message from './ForumMessage';

const DiscussionForum = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [targetDepartment, setTargetDepartment] = useState('');

    const department = sessionStorage.getItem('department') || '';
    const userName = sessionStorage.getItem('name') || '';
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    useEffect(() => {
        const messagesRef = ref(db2, 'messages');
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedMessages = Object.entries(data).map(([id, msg]) => ({
                    ...msg,
                    id,
                }));
                setMessages(formattedMessages);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleAddMessage = async () => {
        if (newMessage.trim()) {
            setLoading(true);
            const timestamp = Date.now();
            const newMessageRef = push(ref(db2, 'messages'));

            let departmentAccess = ['general'];

            if (selectedCategory === 'intradepartment') {
                departmentAccess = [department];
            } else if (selectedCategory === 'interdepartment' && targetDepartment) {
                departmentAccess = [department, targetDepartment];
            }

            await set(newMessageRef, {
                userName,
                userdep: department,
                message: newMessage,
                likeCount: 0,
                relatedTopics: [],
                access: departmentAccess,
                category: selectedCategory,
                replies: [],
                timestamp,
            });

            setNewMessage('');
            setLoading(false);
        }
    };

    const handleAddReply = async (msgId, replyText) => {
        if (replyText.trim()) {
            const reply = {
                userName: sessionStorage.getItem('name') || 'Anonymous',
                userdep: sessionStorage.getItem('department') || 'Unknown Department',
                replyText: replyText.trim(),
                timestamp: Date.now(),
                access: [sessionStorage.getItem('department') || 'General'],
            };

            const messageRef = ref(db2, `messages/${msgId}`);
            const snapshot = await new Promise((resolve) => {
                onValue(messageRef, (dataSnapshot) => resolve(dataSnapshot), { onlyOnce: true });
            });

            const messageData = snapshot.val();
            if (messageData) {
                const updatedReplies = messageData.replies ? [...messageData.replies, reply] : [reply];
                await set(messageRef, {
                    ...messageData,
                    replies: updatedReplies,
                });
            } else {
                console.error('Message data not found for msgId:', msgId);
            }
        }
    };

    const filteredMessages = messages
        .filter(msg => {
            const messageCategory = msg.category || 'general';
            if (selectedCategory === 'general') {
                return messageCategory === 'general';
            } else if (selectedCategory === 'intradepartment') {
                return messageCategory === 'intradepartment' && msg.access.includes(department);
            } else if (selectedCategory === 'interdepartment') {
                return messageCategory === 'interdepartment' && msg.access.includes(department);
            }
            return false;
        })
        .filter(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'newest') return b.timestamp - a.timestamp;
            return a.timestamp - b.timestamp;
        });

    return (
        <View className="bg-gray-100 p-2 flex-1">
            <View className="max-w-3xl mx-auto">
                <View className="flex-row items-center justify-between mb-4">
                    {/* Category Selection */}
                    <View className="flex-row space-x-2">
                        <TouchableOpacity
                            className={`px-3 py-1.5 rounded-full text-sm transition ${selectedCategory === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            onPress={() => { setSelectedCategory('general'); }}
                        >
                            <Text>General</Text>
                        </TouchableOpacity>
                        {isLoggedIn && (
                            <TouchableOpacity
                                className={`px-3 py-1.5 rounded-full text-sm transition ${selectedCategory === 'intradepartment' && department ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                onPress={() => { setSelectedCategory('intradepartment'); }}
                            >
                                <Text>{department} department</Text>
                            </TouchableOpacity>
                        )}
                        {isLoggedIn && (
                            <TouchableOpacity
                                className={`px-3 py-1.5 rounded-full text-sm transition ${selectedCategory === 'interdepartment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                onPress={() => { setSelectedCategory('interdepartment'); }}
                            >
                                <Text>Interdepartment</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Search and Sort */}
                    <View className="flex-row items-center space-x-2">
                        <Picker
                            selectedValue={sortOrder}
                            onValueChange={(itemValue) => setSortOrder(itemValue)}
                            style={{ height: 50, width: 150 }}
                        >
                            <Picker.Item label="Newest First" value="newest" />
                            <Picker.Item label="Oldest First" value="oldest" />
                        </Picker>
                        <TextInput
                            style={{ padding: 8, borderColor: 'gray', borderWidth: 1, borderRadius: 4, width: 200 }}
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChangeText={(text) => setSearchTerm(text)}
                        />
                    </View>
                </View>

                {/* Target Department Selector (only for Interdepartment) */}
                {selectedCategory === 'interdepartment' && (
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700">Choose Target Department:</Text>
                        <Picker
                            selectedValue={targetDepartment}
                            onValueChange={(value) => setTargetDepartment(value)}
                            style={{ height: 50, width: 250 }}
                        >
                            <Picker.Item label="Select Department" value="" />
                            <Picker.Item label="Public Health and Sanitation" value="Public Health and Sanitation" />
                            <Picker.Item label="Public Works" value="Public Works" />
                            {/* Add other departments here */}
                        </Picker>
                    </View>
                )}

                {/* Message Input */}
                <View className="mb-4">
                    <TextInput
                        style={{ height: 80, padding: 8, borderColor: 'gray', borderWidth: 1, borderRadius: 4 }}
                        multiline
                        placeholder="Write a message..."
                        value={newMessage}
                        onChangeText={(text) => setNewMessage(text)}
                    />
                    <TouchableOpacity
                        title={loading ? 'Posting...' : 'Post Message'}
                        onPress={handleAddMessage}
                        disabled={loading || !newMessage.trim() || (selectedCategory === 'interdepartment' && !targetDepartment)}
                    />
                </View>

                {/* Display Messages */}
                <FlatList
                    data={filteredMessages}
                    renderItem={({ item }) => (
                        <Message
                            key={item.id}
                            message={item}
                            userDepartment={department}
                            onReply={handleAddReply}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
    );
};

export default DiscussionForum;
