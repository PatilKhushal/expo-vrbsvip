import "../global.css";
/* import { useFonts } from "expo-font"; */
import { Provider } from "react-redux";
/* import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { Text } from "react-native"; */
import { store } from "../services/store";
import { Slot, Stack } from "expo-router";

export default function RootLayout() {  
  return (
    <Provider store={store}>
      <Stack screenOptions={{headerShown: false}} >
        {/* <Stack.Screen name="initial"/> */}
        <Stack.Screen name="Modes"/>
      </Stack>
    </Provider>
  );
}