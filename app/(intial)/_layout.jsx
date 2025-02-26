import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { loadLanguage } from "../../services/translationService";
import { useEffect } from "react";

const RootLayout = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadLanguage())
  }, [dispatch]);
  return (
    <Stack
      screenOptions={{
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "black",
        },
      }}
    >
      {/* <Stack.Screen
        name="index"
        options={{
          title: t('welcomeScreen', {returnObjects : true}).title,
          headerRight: () => (
            <FontAwesome6 name="person" size={24} color="white" />
          ),
        }}
        unmountOnBlur={true}
      />
      <Stack.Screen
        name="language-selection"
        options={{
          title: t('languageSelectionScreen', {returnObjects : true}).title,
          headerRight: () => (
            <FontAwesome6 name="language" size={24} color="white" />
          ),
        }}
        unmountOnBlur={true}
      /> */}
      <Stack.Screen
        name="index"
        options={{ title: t('emergencyContactScreen', {returnObjects : true}).title }}
      />
      <Stack.Screen
        name="emergency-contact-adding"
        options={{ title: t('emergencyContactScreen', {returnObjects : true}).title }}
      />
      {/* <Stack.Screen
        name="setup-completion"
        options={{ title: "Setup Completion" }}
      /> */}
    </Stack>
  );
};

export default RootLayout;
