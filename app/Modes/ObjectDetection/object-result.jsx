import { Pressable, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import {
  useObjectDetection,
  SSDLITE_320_MOBILENET_V3_LARGE,
} from "react-native-executorch";
import { useRoute } from "@react-navigation/native";
import { Dimensions } from 'react-native';
import { useRouter } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
console.log("Screen Dimensions:", screenWidth, screenHeight);

const ObjectImage = () => {
  const route = useRoute();
    const router = useRouter();
  const image = route.params?.image;
  const imageWidth = route.params?.width;
  const imageHeight = route.params?.height;
  const [predictions, setPredictions] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });

  const ssdlite = useObjectDetection({
    modelSource: SSDLITE_320_MOBILENET_V3_LARGE,
  });

  useEffect(() => {
    const detectObjects = async () => {
      if (ssdlite.isReady) {
        console.log("Detecting objects...");
        const results = await ssdlite.forward(image);
        console.log(results);
        if (results.length !== 0) {
          setPredictions(results);
        } else {
          console.log("No results");
          setPredictions([]);
        }
      }
    };

    detectObjects();
  }, [ssdlite.isReady, image]);

  if (!ssdlite.isReady) {
    return <Text className="text-green-500">Loading</Text>;
  }

  const handleNavigation = () => {
    router.replace("ObjectDetection/object-image");
  };

  return (
    <Pressable
      onLongPress={handleNavigation}
      className="bg-black w-full h-full"
    >
      <Image
        source={{ uri: image }}
        className="h-full w-full"
      />

      {predictions.map((prediction, index) => {
        const { bbox, label, score } = prediction;

        // Scale bbox according to actual image size
        const scaleX = screenWidth / imageWidth; // Assuming model input size is 320x320
        const scaleY = screenHeight / imageHeight; // Assuming model input size is 320x320

        const left = bbox.x1 * scaleX;
        const top = bbox.y1 * scaleY;
        const width = (bbox.x2 - bbox.x1) * scaleX;
        const height = (bbox.y2 - bbox.y1) * scaleY;

        console.log("left :\t", left)
        console.log("top :\t", top)
        console.log("width :\t", width)
        console.log("height :\t", height)
        return (
          <View
            key={index}
            style={{
              position: "absolute",
              left,
              top,
              width,
              height,
              borderWidth: 2,
              borderColor: "red",
            }}
          >
            <Text
              style={{
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                color: "white",
                fontSize: 12,
                position: "absolute",
                top: -15,
              }}
            >
              {label} {score.toFixed(2)}
            </Text>
          </View>
        );
      })}

    </Pressable>
  );
};

export default ObjectImage;