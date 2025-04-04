import {View, Text, Pressable, ImageBackground} from 'react-native';
import React, {useCallback, useRef} from 'react';
import {
  setIntervalID,
  setIsFirstTime,
  setSpeechFinished,
  setTimeoutID,
} from '../../reducers/configurations';
import {useDispatch, useSelector} from 'react-redux';
import {clearAudioQueues, speakWithPause} from '../../services/audioService';
import {useTranslation} from 'react-i18next';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SetupCompletion = () => {
  const router = useRouter();
  const isSpeechFinished = useSelector(
    state => state.configurations.isSpeechFinished,
  );
  const intervalID = useSelector(state => state.configurations.intervalID);
  const timeoutID = useSelector(state => state.configurations.timeoutID);
  const language = useSelector(state => state.configurations.language);
    const isFirstTime = useSelector(state => state.configurations.isFirstTime);
  
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);
  const message = t("setupCompleteScreen", { returnObjects: true }).message

  const playAudio = () => {
    const text = t('setupCompleteScreen', {returnObjects: true}).audio;

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

  const handleNavigation = async () => {
    try
    {
      if (isSpeechFinished && isFirstTime) {
        clearAudioQueues(intervalID, timeoutID);
        console.log("inside setup completion")
        await AsyncStorage.setItem("isFirstTime", "false")
        dispatch(setIsFirstTime(false));
        router.dismissTo('Modes'); // Navigate to the next screen
      }
    }
    catch(error){
      console.log("Error :\t", error)
      await AsyncStorage.setItem("isFirstTime", "true")
      dispatch(setIsFirstTime(true));
    }
  };

  return (
    <Pressable onLongPress={handleNavigation}>
      <ImageBackground
        source={require('../../assets/images/initialSetup/welcomeBG.jpg')}
        blurRadius={12}>
        <View className="flex items-center px-2 gap-2 h-full justify-center">
        <View className="bg-white/[0.2] rounded-lg p-8 backdrop-blur-lg border">
            <Text className="text-2xl text-center text-black">
              {message[0] + "\n" + message[1] + "\n" + message[2]}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default SetupCompletion;
