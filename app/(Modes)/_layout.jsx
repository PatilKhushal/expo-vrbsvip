import { Stack } from "expo-router";
import Home from ".";
import ModeSelectionScreen from "./mode-selection";
import TextRecognitionScreen from "./TextRecognition/text-recognition";
import ReadText from "./TextRecognition/read-text";
import ObjectImage from "./object-detection/object-image";
import ObjectResult from "./object-detection/object-result";

const HomeLayout = () => {
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
        component={Home}
        options={{
          title: t("homeScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="mode-selection"
        component={ModeSelectionScreen}
        options={{
          title: t("modeSelectionScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="text-recognition"
        component={TextRecognitionScreen}
        options={{
          title: t("textRecognitionScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="read-text"
        component={ReadText}
        options={{
          title: t("readTextScreen", { returnObjects: true }).title,
        }}
      />
      <Stack.Screen
        name="objectRecognition"
        component={ObjectImage}
        options={{
          title: "Object Detection",
        }}
      />
      <Stack.Screen
        name="objectResult"
        component={ObjectResult}
        options={{
          title: "Object Result",
        }}
      />
      {/* <Stack.Screen
        name="NavigationAssistance"
        component={NavigationAssistance}
        options={{
          title: t("navigationAssistanceScreen", { returnObjects: true }).title,
        }}
      /> */}
    </Stack.Navigator>
  );
};

export default HomeLayout;
