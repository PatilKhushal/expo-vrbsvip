import { View, Pressable, ImageBackground, Text } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Listening from "../../components/Listening";
import { clearAudioQueues } from "../../services/audioService";
import { setEmergencyContacts } from "../../reducers/configurations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { setSRFinished, setSRStarted } from "../../reducers/voice";

const ConfirmationScreen = () => {
  const dispatch = useDispatch();
  const isSRFinished = useSelector((state) => state.voice.isSRFinished);
  const isSRStarted = useSelector((state) => state.voice.isSRStarted);

  const SR_Result = useSelector((state) => state.voice.SR_Result);
  const emergencyContacts = useSelector(
    (state) => state.configurations.emergencyContacts
  );

    const router = useRouter();
  const { t } = useTranslation();
  const intervalID = useSelector((state) => state.configurations.intervalID);
  const timeoutID = useSelector((state) => state.configurations.timeoutID);
  const isFirstTime = useSelector((state) => state.configurations.isFirstTime);
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);

  const [isOkay, setIsOkay] = useState(false);
  const [isConfirmation, setConfirmation] = useState(null);
  const [isError, setIsError] = useState(false);

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
    setIsError(true)
  };

  const onSpeechResults = (e) => {
    console.log("onSpeechResults: ", e);
    dispatch(setSRFinished(true));
    dispatch(setSRStarted(false));
    const res = e.results[0]?.transcript.toLowerCase();

    if (res.includes("proceed")) setConfirmation(true);
    else setConfirmation(false);
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
    console.log("isConfirmation :\t", isConfirmation);
    console.log("emergencyContacts :\t", emergencyContacts);

    if (isFirstTime && isSRFinished && isError == true) {
      router.replace("emergency-contact-setup", {
        isError : true
      });
      console.log("Issue adding Contact");
    }
    else if (isFirstTime && isSRFinished && (isConfirmation == false || isError)) {
      router.replace("emergency-contact-setup", {
        isConfirmation : false
      });
      console.log("Contact not added to emergency contacts");
    } else if (isFirstTime && isSRFinished && isConfirmation == true) {
      const updatedEmergencyContacts = [...emergencyContacts, SR_Result];
      AsyncStorage.setItem(
        "emergencyContacts",
        updatedEmergencyContacts.toLocaleString()
      )
        .then(() => {
          dispatch(setEmergencyContacts(updatedEmergencyContacts));
          router.replace("emergency-contact-setup", {
            isConfirmation : true
          });
          console.log("Contact added to emergency contacts");
        })
        .catch((error) => console.log(error));
    }
  }, [isConfirmation]);

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

export default ConfirmationScreen;
