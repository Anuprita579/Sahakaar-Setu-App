import React, { useState, useEffect } from "react";
import { View } from "react-native";
import TopHeader from "./TopHeader";
import BelowHeader from "./BelowHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";


const HeaderComponent = () => {
  const navigation = useNavigation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogin, setIsLogin] = useState("Login");
  const [language, setLanguage] = useState("en");

  // Retrieve data from AsyncStorage on component mount
  useEffect(() => {
    const fetchData = async () => {
      const storedLanguage = await AsyncStorage.getItem("language");
      setLanguage(storedLanguage || "en");

      const userName = await AsyncStorage.getItem("userName");
      setIsLogin(userName); // Boolean indicating if user is logged in
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
    <View >
      <TopHeader
        language={language}
        changeLanguage={changeLanguage}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        navigate={navigation.navigate}
      />
      <BelowHeader
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        navigate={navigation.navigate}
      /> 
    </View>
  );
};

export default HeaderComponent;
