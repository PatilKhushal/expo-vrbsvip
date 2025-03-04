import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

const InitialLayout = () => {
  const { t } = useTranslation();

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("welcomeScreen", { returnObjects: true }).title,
          headerRight: () => (
            <FontAwesome6
              name="person"
              size={24}
              color="white"
              iconStyle="solid"
            />
          ),
        }}
      />
      <Stack.Screen
        name="language-selection"
        options={{
          title: t("languageSelectionScreen", { returnObjects: true }).title,
          headerRight: () => (
            <FontAwesome6
              name="language"
              size={24}
              color="white"
              iconStyle="solid"
            />
          ),
        }}
      />
      <Stack.Screen
        name="emergency-contact-setup"
        options={{
          title: t("emergencyContactScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="listening-screen"
        options={{
          title: t("listeningScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="contact-view"
        options={{
          title: t("contactViewScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="confirmation-screen"
        options={{
          title: t("confirmationScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="setup-completion"
        options={{
          title: t("setupCompleteScreen", { returnObjects: true }).title,
        }}
      />
    </Stack>
  );
};

export default InitialLayout;
