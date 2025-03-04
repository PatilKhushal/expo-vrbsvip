import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

const HomeLayout = () => {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <Stack.Screen
        name="home"
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
        name="text-recognition"
        options={{
          title: t("textRecognitionScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="read-text"
        options={{
          title: t("readTextScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="objectRecognition"
        options={{
          title: "Object Detection",
        }}
      />
      <Stack.Screen
        name="objectResult"
        options={{
          title: "Object Result",
        }}
      />
      {/* <Stack.Screen
        name="NavigationAssistance"
        options={{
          title: t("navigationAssistanceScreen", { returnObjects: true }).title,
        }}
      /> */}
    </Stack>
  );
};

export default HomeLayout;
