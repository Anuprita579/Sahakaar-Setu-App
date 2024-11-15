import { Text, View } from 'react-native';
import HeaderComponent from "../components/HeaderComponent";

export default function Index() {
  return (
    <View className="bg-slate-700">
      <HeaderComponent />
      <Text className="text-white">Home screen</Text>
      <Text>Sahkaar Setu</Text>
    </View>
  );
}