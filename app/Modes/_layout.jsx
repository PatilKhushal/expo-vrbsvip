import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

const HomeLayout = () => {
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
          title: t("homeScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="mode-selection"
        options={{
          title: t("modeSelectionScreen", { returnObjects: true }).title,
        }}
      />

      <Stack.Screen
        name="TextRecognition/text-recognition"
        options={{
          title: t("textRecognitionScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="TextRecognition/read-text"
        options={{
          title: t("readTextScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="ObjectDetection/object-image"
        options={{
          title: t("objectDetectionScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="ObjectDetection/object-result"
        options={{
          title: t("objectDetectionResultScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="Navigation/Navigation"
        options={{
          title: t("navigationAssistanceScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="Navigation/NavigationResult"
        options={{
          title: t("navigationAssistanceResultScreen", { returnObjects: true }).title,
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
