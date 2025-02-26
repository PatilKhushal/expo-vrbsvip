import { View, Text, Pressable, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  setIntervalID,
  setSpeechFinished,
  setTimeoutID,
} from "../../reducers/configurations";
import { useDispatch, useSelector } from "react-redux";
import * as Speech from "expo-speech";
import { clearAudioQueues, speakWithPause } from "../../services/audioService";
import { useTranslation } from "react-i18next";

const SetupCompletion = () => {
  const router = useRouter();
  const isSpeechFinished = useSelector(
    (state) => state.configurations.isSpeechFinished
  );
  const intervalID = useSelector((state) => state.configurations.intervalID);
  const timeoutID = useSelector((state) => state.configurations.timeoutID);
  const language = useSelector((state) => state.configurations.language);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);

  const playAudio = () => {
    const text = t("setupCompleteScreen", { returnObjects: true }).audio;

    speakWithPause(dispatch, setSpeechFinished, text, language);

    intervalRef.current = setInterval(() => {
      speakWithPause(dispatch, setSpeechFinished, text, language);
    }, 25000); // Repeat every 10 seconds + speech delay = 15 sec

    dispatch(setIntervalID(intervalRef.current));
  };

  const handleAudioFeedback = useCallback(() => {
    clearAudioQueues(intervalRef.current, timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      playAudio();
    }, 500);

    dispatch(setTimeoutID(timeoutRef.current));

    return () => {
      clearAudioQueues(intervalRef.current, timeoutRef.current);
    };
  }, [dispatch, t]);

  useFocusEffect(handleAudioFeedback);

  const handleNavigation = () => {
    if (isSpeechFinished) {
      clearAudioQueues(intervalID, timeoutID);
      router.navigate("/language-selection"); // Navigate to the next screen
    }
  };

  return (
    <Pressable onPress={handleNavigation}>
      <ImageBackground
        source={require("../../assets/images/initialSetup/welcomeBG.jpg")}
        blurRadius={12}
      >
        <View className="flex items-center px-2 gap-2 h-full">
          <Text
            className="w-full text-center"
            style={{
              fontFamily: "Pacifico_400Regular",
              fontSize: 60,
            }}
          >
            Setup Completion
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default SetupCompletion;
