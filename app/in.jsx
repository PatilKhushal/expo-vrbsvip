import { View, Text, ImageBackground } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { useDispatch } from "react-redux";
import { setIsFirstTime } from "../reducers/configurations";
import LoaderKit from "react-native-loader-kit";

const index = () => {
  const router = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    /* (async () => {
      const isFirstTime = await AsyncStorage.getItem("isFirstTime");
      console.log("isFirstTime (index.jsx):", isFirstTime);
      if (isFirstTime == "true" || isFirstTime == null) {
        dispatch(setIsFirstTime(true));
        console.log("Redirecting to initial/index");
        router.replace("initial");
      } else {
        dispatch(setIsFirstTime(false));
        console.log("Redirecting to modes/index");
        router.replace("Modes");
      }
    })(); */

    router.replace("Modes");
  }, [dispatch]);
  return (
      <ImageBackground
        source={require("../assets/images/initialSetup/welcomeBG.jpg")}
        blurRadius={12}
        className="w-full h-full"
      >
        <View className="w-full h-full flex justify-center items-center">
        <LoaderKit
          style={{ width: 150, height: 150 }}
          name={'Pacman'} // Optional: see list of animations below
          color={"#CDE6F5"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
        />

        <Text className="text-3xl w-full text-center text-[#CDE6F5]">L o a d i n g</Text>
        </View>
      </ImageBackground>
  );
};

export default index;
