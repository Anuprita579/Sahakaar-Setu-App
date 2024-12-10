import React, { useState, useEffect } from "react";
import { View } from "react-native";
import TopHeader from "./TopHeader";
import BelowHeader from "./BelowHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const HeaderComponent = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState(null);
  const [language, setLanguage] = useState("en");

  // Retrieve data from AsyncStorage on component mount
  useEffect(() => {
    const fetchData = async () => {
      const storedLanguage = await AsyncStorage.getItem("language");
      setLanguage(storedLanguage || "en");

      const storedUserName = await AsyncStorage.getItem("userName");
      setUserName(storedUserName || "Login"); // Set a default value ("Login") if no userName
    };

    fetchData();
  }, []);

  // Function to change language and persist it in AsyncStorage
  const changeLanguage = async (lang) => {
    await AsyncStorage.setItem("language", lang);
    setLanguage(lang);

    // Simulating the language change functionality
    if (window.google && window.google.translate) {
      const instance = window.google.translate.TranslateElement.getInstance();
      instance.setLanguage(lang);
    }
  };

  return (
    <View>
      <TopHeader
        language={language}
        changeLanguage={changeLanguage}
        userName={userName}
        setUserName={setUserName}
        navigate={navigation.navigate}
      />
      <BelowHeader
        userName={userName}
        navigate={navigation.navigate}
      />
    </View>
  );
};

export default HeaderComponent;
