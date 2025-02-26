import "../global.css";
import { useFonts } from "expo-font";
import { Provider } from 'react-redux';
import { store } from '@/services/store';
import { Stack } from "expo-router";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { Text } from "react-native";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({ Pacifico_400Regular });
  if (!fontsLoaded) return <Text>App Loading</Text>;
  
  return (
      <Provider store={store}>
        <Stack screenOptions={{headerShown: false}}/>
      </Provider>
  );
}