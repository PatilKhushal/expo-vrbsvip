import {View, Pressable, ImageBackground} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import initVoice from '../../services/voiceRecognitionService';
import Voice from '@react-native-voice/voice';
import {useTranslation} from 'react-i18next';
import Listening from '../../components/Listening';
import {clearAudioQueues} from '../../services/audioService';
import { useFocusEffect, useNavigation } from 'expo-router';

const ModeSelectionScreen = () => {
  const dispatch = useDispatch();
  const isSRFinished = useSelector(state => state.voice.isSRFinished);
  const isSRStarted = useSelector(state => state.voice.isSRStarted);
  const router = useNavigation();
  const {t} = useTranslation();
  const intervalID = useSelector(state => state.configurations.intervalID);
  const timeoutID = useSelector(state => state.configurations.timeoutID);
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);
  const mode = useSelector(state => state.voice.mode);
  useEffect(() => {
    initVoice(dispatch);
  }, [dispatch]);

  useEffect(() => {
    console.log('isSRStarted :\t', isSRStarted);
    console.log('isSRFinished :\t', isSRFinished);
    console.log('mode :\t', mode);
     
    if(isSRFinished)
    {
        switch(mode)
        {
            case "text" : router.replace('TextRecognition/text-recognition');
            console.log("Mode text recognition got selected")
            break;

            case "home" : router.replace('index');
            console.log("Mode home got selected")
            break;

            case "object" : router.replace('ObjectDetection/object-image');
            break;
        }
    }
  }, [isSRFinished, mode]);

  const handleListening = useCallback(() => {
    clearAudioQueues(intervalRef.current, timeoutRef.current);

    if (isSRFinished) {
      Voice.isAvailable()
        .then(() => {
          Voice.start('en-US')
            .then(console.log('Speech recognition started '))
            .catch(error => {
              console.error('Error starting speech recognition:', error);
            });
        })
        .catch(error => console.log('Voice module is not yet ready.', error));
    }

    return () => {
      clearAudioQueues(intervalRef.current, timeoutRef.current);
    };
  }, [dispatch, t]);

  useFocusEffect(handleListening);

  return (
    <Pressable>
      <ImageBackground
        source={require('../../assets/images/initialSetup/welcomeBG.jpg')}
        blurRadius={12}>
        <View className="flex items-center px-2 gap-2 h-full">
          {isSRStarted && !isSRFinished && <Listening />}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default ModeSelectionScreen;
