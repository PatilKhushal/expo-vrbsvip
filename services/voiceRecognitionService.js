import { PermissionsAndroid } from "react-native";
import {
  setEnd,
  setError,
  setPartialResults,
  setPitch,
  setRecognized,
  setResults,
  setStarted,
} from "../reducers/voice";

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

const initVoice = () => {
  Voice.onSpeechStart = onSpeechStart;
  Voice.onSpeechRecognized = onSpeechRecognized;
  Voice.onSpeechEnd = onSpeechEnd;
  Voice.onSpeechError = onSpeechError;
  Voice.onSpeechResults = onSpeechResults;
  Voice.onSpeechPartialResults = onSpeechPartialResults;
  Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

  return () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };
};

export default initVoice;
export { requestMicrophonePermission };
