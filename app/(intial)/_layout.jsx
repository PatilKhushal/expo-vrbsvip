import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Stack } from "expo-router";
import LanguageSelection from "./language-selection";
import WelcomePage from ".";
import EmergencyContactSetup from "./emergency-contact-setup";
import ListeningScreen from "./listening-screen";
import ContactsView from "./contact-view";
import ConfirmationScreen from "./confirmation-screen";
import SetupCompletion from "./setup-completion";

const RootLayout = () => {
  return (
    <Stack.Navigator
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
        component={WelcomePage}
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
        component={LanguageSelection}
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
        component={EmergencyContactSetup}
        options={{
          title: t("emergencyContactScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="listening-screen"
        component={ListeningScreen}
        options={{
          title: t("listeningScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="contact-view"
        component={ContactsView}
        options={{
          title: t("contactViewScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="confirmation-screen"
        component={ConfirmationScreen}
        options={{
          title: t("confirmationScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="setup-completion"
        component={SetupCompletion}
        options={{
          title: t("setupCompleteScreen", { returnObjects: true }).title,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootLayout;
