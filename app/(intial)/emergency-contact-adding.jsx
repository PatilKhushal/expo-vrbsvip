import { View, Text, Pressable, ImageBackground } from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    setEnd,
    setError,
    setPartialResults,
    setPitch,
    setRecognized,
    setResults,
    setStarted
} from "../../reducers/voice"
import Voice from "@react-native-voice/voice"

const EmergencyContactSetup = () => {
  const dispatch = useDispatch();

  /* useEffect(() => {
    requestMicrophonePermission().then(() => {
        Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    })

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [dispatch]); */

  const handlePress = () => {
    Voice.start("en-US")
      .then(console.log("Speech recognition started")) // This is where you handle the Promise
      .catch((error) => {
        console.error("Error starting speech recognition:", error);
      });
  };

  const onSpeechStart = (e) => {
    console.log("onSpeechStart: ", e);
    dispatch(setStarted("√"));
  };
  
  const onSpeechRecognized = (e) => {
    console.log("onSpeechRecognized: ", e);
    dispatch(setRecognized("√"));
  };
  
  const onSpeechEnd = (e) => {
    console.log("onSpeechEnd: ", e);
    dispatch(setEnd("√"));
  };
  
  const onSpeechError = (e) => {
    console.log("onSpeechError: ", e);
    dispatch(setError(JSON.stringify(e.error)));
  };
  
  const onSpeechResults = (e) => {
    console.log("onSpeechResults: ", e);
    dispatch(setResults(e.value));
  };
  
  const onSpeechPartialResults = (e) => {
    console.log("onSpeechPartialResults: ", e);
    dispatch(setPartialResults(e.value));
  };
  
  const onSpeechVolumeChanged = (e) => {
    console.log("onSpeechVolumeChanged: ", e);
    dispatch(setPitch(e.value));
  };

  return (
    <Pressable onPress={handlePress}>
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
            {`Emergency Contact Adding Page`}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default EmergencyContactSetup;
