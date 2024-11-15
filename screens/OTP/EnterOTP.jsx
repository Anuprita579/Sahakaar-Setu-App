import React, { useState, useEffect, useRef } from "react";
import { TextInput, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Logo from "../assets/Logo.png"; // Ensure the image path is correct

function OTP({ separator, length, value, onChange }) {
  const inputRefs = useRef(new Array(length).fill(null));

  const focusInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.focus();
  };

  const selectInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.select();
  };

  const handleKeyDown = (event, currentIndex) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case "Delete":
      case "Backspace":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }

        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;
      default:
        break;
    }
  };

  const handleChange = (event, currentIndex) => {
    const currentValue = event.target.value;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
        indexToEnter += 1;
      } else {
        break;
      }
    }
    onChange((prev) => {
      const otpArray = prev.split('');
      const lastValue = currentValue[currentValue.length - 1];
      otpArray[indexToEnter] = lastValue;
      return otpArray.join('');
    });
    if (currentValue !== "") {
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1);
      }
    }
  };

  const handleClick = (event, currentIndex) => {
    selectInput(currentIndex);
  };

  const handlePaste = (event, currentIndex) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    if (clipboardData.types.includes("text/plain")) {
      let pastedText = clipboardData.getData("text/plain");
      pastedText = pastedText.substring(0, length).trim();
      let indexToEnter = 0;

      while (indexToEnter <= currentIndex) {
        if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
          indexToEnter += 1;
        } else {
          break;
        }
      }

      const otpArray = value.split("");
      for (let i = indexToEnter; i < length; i++) {
        const lastValue = pastedText[i - indexToEnter] ?? " ";
        otpArray[i] = lastValue;
      }

      onChange(otpArray.join(""));
    }
  };

  return (
    <View className="flex flex-row gap-2 items-center">
      {new Array(length).fill(null).map((_, index) => (
        <View key={index} className="flex flex-row items-center">
          <TextInput
            ref={(ele) => {
              inputRefs.current[index] = ele;
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onChangeText={(text) => handleChange({ target: { value: text } }, index)}
            value={value[index] ?? ""}
            style={{
              width: 40,
              fontSize: 16,
              textAlign: "center",
              paddingVertical: 8,
              borderRadius: 8,
              borderColor: "#B0B8C4",
              borderWidth: 1,
              backgroundColor: "#fff",
            }}
          />
          {index === length - 1 ? null : separator}
        </View>
      ))}
    </View>
  );
}

function OTPInput() {
  const [otp, setOtp] = useState("");

  return (
    <View className="flex flex-col gap-2 items-center">
      <OTP separator={<Text>-</Text>} value={otp} onChange={setOtp} length={6} />
      <Text>Entered value: {otp}</Text>
    </View>
  );
}

export default function EnterOTP() {
  const [otp, setOtp] = useState(""); // State for OTP
  const [error, setError] = useState(""); // State for handling errors
  const [timer, setTimer] = useState(120); // Timer state set to 120 seconds (2 minutes)
  const [canResend, setCanResend] = useState(false); // State to control resend visibility

  const navigation = useNavigation();

  // Effect to handle countdown timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown); // Cleanup on component unmount
    } else {
      setCanResend(true); // Show resend link when timer reaches 0
    }
  }, [timer]);

  const handleOTPSubmit = (e) => {
    e.preventDefault();

    // Sample logic for OTP verification
    if (otp.length === 6) {
      console.log("OTP Verified");
      navigation.navigate("ResetPassword"); // Update the navigation path
    } else {
      setError("Please enter a valid 6-digit OTP.");
    }
  };

  const handleResendOTP = () => {
    setOtp(""); // Reset OTP input
    setTimer(120); // Reset timer to 120 seconds
    setCanResend(false); // Hide resend link
    setError(""); // Clear error message
    console.log("OTP resent"); // Add your resend OTP logic here
  };

  // Format timer as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-8">
      <View className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        {/* Logo */}
        <View className="flex justify-center mb-6">
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <View className="w-24 h-24 bg-gray-300 rounded-full justify-center items-center">
              <Image source={Logo} className="w-full h-full rounded-full" />
            </View>
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-center mb-4">Enter OTP</Text>

        {error && <Text className="mb-4 text-red-500 text-center">{error}</Text>}

        <View className="mb-6">
          <OTPInput separator={<Text>-</Text>} value={otp} onChange={setOtp} length={6} />
        </View>

        <TouchableOpacity
          onPress={handleOTPSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Text className="text-center text-white">Verify OTP</Text>
        </TouchableOpacity>

        {/* Resend OTP Section */}
        <View className="mt-4 text-center">
          {canResend ? (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text className="text-blue-500">Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text>Didn't receive OTP? Resend in {formatTime()} minutes</Text>
          )}
        </View>
      </View>
    </View>
  );
}
