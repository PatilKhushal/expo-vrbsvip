import { View, Pressable, ImageBackground, Text } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Listening from "../../components/Listening";
import { clearAudioQueues } from "../../services/audioService";
import { useFocusEffect, useNavigation } from "expo-router";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import {
  setConfirmation,
  setIsError,
  setProceedDetected,
  setSRFinished,
  setSRResult,
  setSRStarted,
} from "../../reducers/voice";

const ModeSelectionScreen = () => {
  const dispatch = useDispatch();
  const isSRFinished = useSelector((state) => state.voice.isSRFinished);
  const isSRStarted = useSelector((state) => state.voice.isSRStarted);
  const router = useNavigation();
  const { t } = useTranslation();
  const intervalID = useSelector((state) => state.configurations.intervalID);
  const timeoutID = useSelector((state) => state.configurations.timeoutID);
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);

  const [mode, setMode] = useState();

  const [isOkay, setIsOkay] = useState(false);

  const onSpeechStart = () => {
    console.log("onSpeechStart: ");
    dispatch(setSRStarted(true));
    dispatch(setSRFinished(false));
  };

  const onSpeechEnd = () => {
    console.log("onSpeechEnd: ");
  };

  const onSpeechError = (e) => {
    console.log("onSpeechError: ", e);
    dispatch(setSRFinished(true));
    dispatch(setSRStarted(false));
    const payload = [];
    dispatch(setSRResult(payload));
    dispatch(setConfirmation("false"));
    dispatch(setIsError(true));
    dispatch(setMode("home"));
    dispatch(setProceedDetected(false));
  };

  const onSpeechResults = (e) => {
    console.log("onSpeechResults: ", e);
    dispatch(setSRFinished(true));
    dispatch(setSRStarted(false));
    const res = e.results[0]?.transcript.toLowerCase();

    if (res.includes("ob")) setMode("object");
    else if (res.includes("text")) setMode("text");
    else if (res.includes("navigation")) setMode("navigation");
    else setMode("home");
  };

  useSpeechRecognitionEvent("start", () => {
    onSpeechStart();
  });

  useSpeechRecognitionEvent("end", () => {
    onSpeechEnd();
  });

  useSpeechRecognitionEvent("error", (e) => {
    onSpeechError(e);
  });

  useSpeechRecognitionEvent("result", (e) => {
    onSpeechResults(e);
  });

  useEffect(() => {
    console.log("isSRStarted :\t", isSRStarted);
    console.log("isSRFinished :\t", isSRFinished);
    console.log("mode :\t", mode);

    if (isSRFinished) {
      switch (mode) {
        case "text":
          router.replace("TextRecognition/text-recognition");
          console.log("Mode text recognition got selected");
          break;

        case "home":
          router.replace("index");
          console.log("Mode home got selected");
          break;

        case "object":
          router.replace("ObjectDetection/object-image");
          console.log("Mode object recognition got selected");
          break;

        case "navigation":
          router.replace("Navigation/Navigation");
          console.log("Mode object recognition got selected");
          break;
      }
    }
  }, [isSRFinished, mode]);

  const handleListening = useCallback(() => {
    clearAudioQueues(intervalRef.current, timeoutRef.current);

    if (isSRFinished) {
      const startSpeechService = async () => {
        const result =
          await ExpoSpeechRecognitionModule.requestPermissionsAsync();

        if (!result.granted) {
          console.warn("Permissions not granted", result);
          setIsOkay(false);
          return;
        }

        setIsOkay(true);
        // Start speech recognition
        ExpoSpeechRecognitionModule.start({
          lang: "en-US",
          interimResults: true,
          maxAlternatives: 1,
          continuous: false,
          requiresOnDeviceRecognition: false,
          addsPunctuation: false,
          contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
        });
      };

      startSpeechService()
        .then(() => {
          console.log("Speech Service Good");
        })
        .catch((error) => {
          console.log("Error :\t", error);
        });
    }

    return () => {
      clearAudioQueues(intervalRef.current, timeoutRef.current);
    };
  }, [dispatch, t]);

  useFocusEffect(handleListening);

  return (
    <Pressable>
      <ImageBackground
        source={require("../../assets/images/initialSetup/welcomeBG.jpg")}
        blurRadius={12}
      >
        {isOkay ? (
          <View className="flex items-center px-2 gap-2 h-full">
            {isSRStarted && !isSRFinished && <Listening />}
          </View>
        ) : (
          <Text>Loading Voice Module</Text>
        )}
      </ImageBackground>
    </Pressable>
  );
};

export default ModeSelectionScreen;
