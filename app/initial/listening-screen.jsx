import { View, Pressable, ImageBackground, Text } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Listening from "../../components/Listening";
import { setSRFinished, setSRResult, setSRStarted } from "../../reducers/voice";
import { clearAudioQueues } from "../../services/audioService";
import { useFocusEffect, useNavigation } from "expo-router";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import * as Contacts from "expo-contacts";

const ListeningScreen = () => {
  const dispatch = useDispatch();
  const isSRFinished = useSelector((state) => state.voice.isSRFinished);
  const isSRStarted = useSelector((state) => state.voice.isSRStarted);
  const isFirstTime = useSelector((state) => state.configurations.isFirstTime);
  const SR_Result = useSelector((state) => state.voice.SR_Result);

  const [isProceedDetected, setProceedDetected] = useState(false);
  const router = useNavigation();
  const { t } = useTranslation();
  const intervalID = useSelector((state) => state.configurations.intervalID);
  const timeoutID = useSelector((state) => state.configurations.timeoutID);
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);
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
    const payload = {
      error : true
    };
    dispatch(setSRResult(payload));
  };

  const onSpeechResults = (e) => {
    console.log("onSpeechResults: ", e);
    dispatch(setSRFinished(true));
    dispatch(setSRStarted(false));
    const res = e.results[0]?.transcript.toLowerCase()
    ;
    console.log("res listening screen :\t", res)
    if (res.includes("next")) setProceedDetected(true);
    else dispatch(processRecognition(res));
  };

  const processRecognition = (result) => async (dispatch) => {
    console.log("Contacts in proces Reecognition:\t");
    const contacts = await Contacts.getContactsAsync({
      name: result,
    });
    console.log("Contacts in voice recognition :\t", contacts);
    dispatch(setSRResult(contacts));
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
    console.log("SR_Result :\t", SR_Result);
    console.log("\n\n\n");
    console.log("isProceedDetected :\t", isProceedDetected);

    if (isProceedDetected && isFirstTime) router.navigate("setup-completion");
    else if (
      isFirstTime &&
      isSRFinished &&
      SR_Result != null &&
      (SR_Result.data?.length === 0 || SR_Result?.error)
    )
      router.replace("emergency-contact-setup");
    else if (
      isFirstTime &&
      isSRFinished &&
      SR_Result != null &&
      SR_Result.data?.length > 0
    )
      router.replace("contact-view");
  }, [SR_Result, isProceedDetected]);

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

export default ListeningScreen;
