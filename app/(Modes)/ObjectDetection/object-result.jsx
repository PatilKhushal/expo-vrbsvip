import {
  useObjectDetection,
  ObjectDetectionObject,
} from "@infinitered/react-native-mlkit-object-detection";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import LoadModel, { MyModelsConfig } from "../../../hooks/LoadModel";

function ObjectResult({ imagePath }) {
  const detector = useObjectDetection(MyModelsConfig, "objectDetector");

  const [detectedObjects, setDetectedObjects] = useState([]);

  useEffect(() => {
    async function detectObjects(imagePath) {
      if (!detector) return;

      try {
        const detectionResults = await detector.detectObjects(imagePath);
        setDetectedObjects(detectionResults);
      } catch (error) {
        console.error("Error detecting objects:", error);
      }
    }

    if (imagePath) {
      detectObjects(imagePath);
    }
  }, [detector, imagePath]);

  return (
    <LoadModel>
      <View>
        {detectedObjects.map((detectedObject, index) => (
          <View key={index}>
            {/* Render your detection results */}
            {JSON.stringify(detectedObject)}
          </View>
        ))}
      </View>
    </LoadModel>
  );
}

export default ObjectResult;
