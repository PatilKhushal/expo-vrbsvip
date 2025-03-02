import "../global.css";
/* import { useFonts } from "expo-font"; */
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/services/store";
import { Stack } from "expo-router";
/* import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { Text } from "react-native"; */
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { loadLanguage } from "../services/translationService";
import { setIsFirstTime } from "../reducers/configurations";

export default function RootLayout() {
  /* const [fontsLoaded] = useFonts({ Pacifico_400Regular });
  if (!fontsLoaded) return <Text>App Loading</Text>; */
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadLanguage());
  }, [dispatch]);
  const isFirstTime = useSelector(state => state.configurations.isFirstTime);

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("isFirstTime");
        if (hasLaunched === null) {
          await AsyncStorage.setItem("isFirstTime", "true");
          dispatch(setIsFirstTime(true));
        } else dispatch(setIsFirstTime(false));

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking first-time usage:", error);
        dispatch(setIsFirstTime(false));
        setIsLoading(true);
      }
    };

    checkFirstTimeUser();
  }, []);
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name={isFirstTime == true ? "(intial)" : "(Modes)"} />
      </Stack>
    </Provider>
  );
}