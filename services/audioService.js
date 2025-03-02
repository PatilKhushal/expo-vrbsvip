import * as Speech from "expo-speech";

const speakWithPause = async (
  dispatch,
  setSpeechFinished,
  text,
  language,
  isLanguageSelection = "false"
) => {
  dispatch(setSpeechFinished(false));
  for (let index = 0; index < text.length; index++) {
    const value = text[index];
    console.log(`value before: ${value}`);

    await new Promise((resolve) => {
      Speech.speak(value, {
        language: isLanguageSelection
          ? index === 0
            ? language
            : index === 1
            ? "en-US"
            : index === 2
            ? "mr-IN"
            : "hi-IN"
          : language,
        pitch: 1,
        rate: 0.8,
        onDone:
          index == text.length - 1
            ? () => {
                dispatch(setSpeechFinished(true));
                resolve();
              }
            : resolve,
        onStart: () => console.log(`started in ${language} with ${value}`),
        onError: (error) => console.log(`audio error ----> ${error}`),
      });
    });

    // Adjust the pause duration (in milliseconds) as needed
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(`value after: ${value}`);
  }
};

const clearAudioQueues = (intervalID, timeoutID) => {
  Speech.stop();
  clearInterval(intervalID);
  clearTimeout(timeoutID);
};
export { speakWithPause, clearAudioQueues };
