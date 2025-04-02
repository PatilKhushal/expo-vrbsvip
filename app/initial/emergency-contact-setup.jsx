import { View, Text, Pressable, ImageBackground, Image } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  setIntervalID,
  setSpeechFinished,
  setTimeoutID,
} from "../../reducers/configurations";
import { useDispatch, useSelector } from "react-redux";
import { clearAudioQueues, speakWithPause } from "../../services/audioService";
import { useTranslation } from "react-i18next";
import { setConfirmation, setSRResult } from "../../reducers/voice";
import * as Contacts from "expo-contacts";
import { useFocusEffect, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";

const EmergencyContactSetup = () => {
    const router = useRouter();
  
  const isSpeechFinished = useSelector(
    (state) => state.configurations.isSpeechFinished
  );
  const intervalID = useSelector((state) => state.configurations.intervalID);
  const timeoutID = useSelector((state) => state.configurations.timeoutID);
  const language = useSelector((state) => state.configurations.language);
  
  const { isConfirmation, isError } = useLocalSearchParams();
  const isErrorRef = useRef(isError);
  const isConfirmationRef = useRef(isConfirmation);

  const isFirstTime = useSelector((state) => state.configurations.isFirstTime);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    Contacts.requestPermissionsAsync()
      .then((result) => {
        console.log("Contacts Permission Status:", result.status);
        setHasPermission(result.status);
      })
      .catch((error) => console.log("Permission Error:", error));
  }, []);

  const playAudio = () => {
    let temp = t("emergencyContactScreen", { returnObjects: true }).audio;
    let text = [];
    if (isErrorRef.current == "true") {
      const issue = t("emergencyContactScreen", { returnObjects: true }).issue;
      text = temp.map((value, index) => {
        if (index == 0) return issue;

        return value;
      });
    } else if (isConfirmationRef.current == "true") {
      const yes = t("emergencyContactScreen", { returnObjects: true }).yes;
      text = temp.map((value, index) => {
        if (index == 0) return yes;

        return value;
      });
    } else if (isConfirmationRef.current == "false") {
      const no = t("emergencyContactScreen", { returnObjects: true }).no;
      text = temp.map((value, index) => {
        if (index == 0) return no;

        return value;
      });
    } else text = temp;

    speakWithPause(dispatch, setSpeechFinished, text, language);

    intervalRef.current = setInterval(() => {
      speakWithPause(dispatch, setSpeechFinished, text, language);
    }, 25000); // Repeat every 10 seconds + speech delay = 15 sec

    dispatch(setIntervalID(intervalRef.current));
    dispatch(setConfirmation(null));
  };

  const handleAudioFeedback = useCallback(() => {
    dispatch(setSRResult(null));
    clearAudioQueues(intervalRef.current, timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      playAudio();
    }, 500);

    dispatch(setTimeoutID(timeoutRef.current));

    return () => {
      clearAudioQueues(intervalRef.current, timeoutRef.current);
    };
  }, [dispatch, t, isConfirmation, isError]);

  useFocusEffect(handleAudioFeedback);

  const handleNavigation = () => {
    if (isSpeechFinished && isFirstTime) {
      clearAudioQueues(intervalID, timeoutID);
      router.replace("listening-screen");
    }
  };

  return (
    <>
      {hasPermission === "granted" ? (
        <Pressable onLongPress={handleNavigation}>
          <ImageBackground
            source={require("../../assets/images/initialSetup/welcomeBG.jpg")}
            blurRadius={12}
          >
            <View className="flex items-center px-2 gap-2 h-full">
              <View className="h-1/4 w-full mt-4">
                <Image
                  className="w-full h-full "
                  source={require("../../assets/images/initialSetup/languageSelection.png")}
                  resizeMode="contain"
                />
              </View>

              <View className="bg-white/[0.2] rounded-lg p-8 backdrop-blur-lg border">
                <Text className="text-2xl text-center text-black">
                  {
                    t("emergencyContactScreen", { returnObjects: true })
                      .message[0]
                  }
                </Text>
              </View>
            </View>
          </ImageBackground>
        </Pressable>
      ) : (
        <Text>Grant the permission please</Text>
      )}
    </>
  );
};

export default EmergencyContactSetup;
