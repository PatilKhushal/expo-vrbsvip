import React, { useEffect, useRef, useCallback } from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import {
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setPhoto, setRecognizedText } from "../../../reducers/textMode";
import {
  clearAudioQueues,
  speakWithPause,
} from "../../../services/audioService";
import {
  setSpeechFinished,
  setTimeoutID,
} from "../../../reducers/configurations";
import { useTranslation } from "react-i18next";
import { setMode } from "../../../reducers/voice";
import { CameraView, useCameraPermissions } from "expo-camera";

const ObjectImage = () => {
  const router = useNavigation();
  const { t } = useTranslation();
  const [hasPermission, requestPermission] = useCameraPermissions();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.configurations.language);
  const intervalID = useSelector((state) => state.configurations.intervalID);
  const timeoutID = useSelector((state) => state.configurations.timeoutID);
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);

  useEffect(() => {
    if (!hasPermission) {
      console.log("Get the camera permission");
      requestPermission();
    }
  }, []);

  const camera = useRef();

  const handleClickPhoto = async () => {
    const photo = await camera.current.takePictureAsync();
    console.log("photo :\t", photo);
    dispatch(setPhoto(photo));

    console.log("Photo Path :\t", `file://${photo.uri}`);

    router.dispatch(StackActions.replace("ObjectDetection/object-result",{
      image : `file://${photo.uri}`,
      width : photo.width,
      height : photo.height
    }));
  };

  const playAudio = () => {
    const text = t("ObjectImage", { returnObjects: true }).audio;
    speakWithPause(dispatch, setSpeechFinished, text, language);
    intervalRef.current = setInterval(() => {
      speakWithPause(dispatch, setSpeechFinished, text, language);
    }, 15000); // Repeat every 10 seconds + speech delay = 15 sec
  };

  const handleAudioFeedback = useCallback(() => {
    clearAudioQueues(intervalRef.current, timeoutRef.current);
    dispatch(setMode(null));
    timeoutRef.current = setTimeout(() => {
      playAudio();
    }, 500);

    dispatch(setTimeoutID(timeoutRef.current));

    return () => {
      clearAudioQueues(intervalRef.current, timeoutRef.current);
    };
  }, [dispatch, t]);

  //useFocusEffect(handleAudioFeedback);

  const handleNavigation = () => {
    router.dispatch(StackActions.replace("index"));
  };

  return (
    <>
      {hasPermission ? (
        <Pressable
          onPress={handleClickPhoto}
          className="w-full h-full"
          onLongPress={handleNavigation}
        >
          <CameraView
            ref={camera}
            style={StyleSheet.absoluteFill}
            facing="back"
          />
        </Pressable>
      ) : (
        <Text>Give Camera Permission to access</Text>
      )}
    </>
  );
};

export default ObjectImage;
