import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

const ForumMessage = ({ message, department, onReply }) => {
  const [newReply, setNewReply] = useState("");

  const handleReply = () => {
    if (newReply.trim()) {
      if (message.id) {
        onReply(message.id, newReply);
        setNewReply("");
      } else {
        console.error("Message ID is undefined:", message);
      }
    } else {
      console.error("Reply text is not a valid string:", newReply);
    }
  };

  return (
    <View className="bg-white p-6 rounded-lg shadow-lg">
      <View className="flex-row items-start space-x-4">
        <Image
          source={{ uri: message.userProfile }}
          style={{ width: 56, height: 56, borderRadius: 28 }}
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className="text-xl font-bold">
              {message.userName} ({message.userdep})
            </Text>
            <Text className="text-sm text-gray-500">
              {new Date(message.timestamp).toLocaleString()}
            </Text>
          </View>
          <Text className="mt-4 text-gray-700">{message.message}</Text>

          {/* Replies Section */}
          {message.replies?.length > 0 && (
            <View className="mt-4 space-y-2">
              {message.replies.map((reply, index) => (
                <View key={index} className="bg-gray-100 p-2 rounded-md">
                  <Text className="font-semibold">
                    {reply.userName} ({reply.userdep})
                  </Text>
                  <Text>{reply.replyText}</Text>
                  <Text className="text-xs text-gray-500">
                    {new Date(reply.timestamp).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Reply Input */}
          <View className="flex-row items-center space-x-2 mt-4">
            <TextInput
              style={{
                flexGrow: 1,
                padding: 8,
                borderColor: "#D1D5DB",
                borderWidth: 1,
                borderRadius: 8,
              }}
              placeholder="Reply..."
              value={newReply}
              onChangeText={setNewReply}
            />
            <TouchableOpacity
              onPress={handleReply}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              <Text className="text-white">Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ForumMessage;
