import { Pressable, able, Text } from "react-native";
import React from "react";
import {
  useObjectDetection,
  SSDLITE_320_MOBILENET_V3_LARGE,
} from "react-native-executorch";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Image } from "react-native";

const ObjectImage = () => {
  const route = useRoute();
  const router = useNavigation();
  const image = route.params?.image; // Access the 'image' parameter

  const ssdlite = useObjectDetection({
    modelSource: SSDLITE_320_MOBILENET_V3_LARGE, // alternatively, you can use require(...)
  });

  const handle = async () => {
    console.log("inside handle :\t", ssdlite);
    console.log("inside handle :\t", image);
    const predictions = await ssdlite.forward(image);

    console.log(predictions);
    if (predictions.length != 0)
      for (const detection of predictions) {
        console.log("Bounding box: ", detection.bbox);
        console.log("Bounding label: ", detection.label);
        console.log("Bounding score: ", detection.score);
      }
    else console.log("No results");
  };

  if (!ssdlite.isReady) {
    return <Text className="text-green-500">Loading</Text>;
  }

  const handleNavigation = () => {
    router.replace("index");
  };

  return (
    <Pressable
      onPress={handle}
      className="bg-black w-full h-full"
      onLongPress={handleNavigation}
    >
      <Image
        source={{
          uri: image,
        }}
        className="h-full w-full"
      />
    </Pressable>
  );
};

export default ObjectImage;
