import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import {
  Camera,
  useCameraDevice,
  useSkiaFrameProcessor,
} from "react-native-vision-camera";
import {
  useObjectDetection,
  SSDLITE_320_MOBILENET_V3_LARGE,
} from "react-native-executorch";
import { Skia } from "@shopify/react-native-skia";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
console.log("Screen Dimensions:", screenWidth, screenHeight);

const ObjectDetectionScreen = () => {
  const [predictions, setPredictions] = useState([]);
  const [imageWidth, setImageWidth] = useState(1);
  const [imageHeight, setImageHeight] = useState(1);
  const [data, setData] = useState();
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });

  console.log("Outside Predictions :\t", predictions);
  const device = useCameraDevice("back");
  const cameraRef = useRef(null);

  const ssdlite = useObjectDetection({
    modelSource: SSDLITE_320_MOBILENET_V3_LARGE,
  });

  const handleClick = useCallback(() => {
    console.log("VClicked");
    setInterval(() => {
      cameraRef.current.takePhoto().then((photo) => {
        console.log("photo :\t", photo);
        ssdlite
          .forward(`file://${photo.path}`)
          .then((results) => {
            console.log("Results :\t", results);
            results.map((prediction, index) => {
              const { bbox, label, score } = prediction;

              // Scale bbox according to actual image size
              const scaleX = screenWidth / imageWidth; // Assuming model input size is 320x320
              const scaleY = screenHeight / imageHeight; // Assuming model input size is 320x320

              const left = (bbox.x1 * scaleX) / 5850;
              const top = (bbox.y1 * scaleY)  / 2300;
              const width = ((bbox.x2 - bbox.x1) * scaleX) / 5210;
              const height = ((bbox.y2 - bbox.y1) * scaleY) / 4776;

              console.log("left :\t", left);
              console.log("top :\t", top);
              console.log("width :\t", width);
              console.log("height :\t", height);

              setData({
                left,
                top,
                width,
                height,
                label,
                score
              });
            });
            setPredictions(results);
            setImageWidth(photo.width);
            setImageWidth(photo.height);
          })
          .catch((error) => {
            console.log("Error :\t", error);
          });
      });
    }, 10000);
  });

  const frameProcessor = useSkiaFrameProcessor(
    (frame) => {
      "worklet";
      frame.render();
      if (data != null) {
        const centerX = data.top;
        const centerY = data.left;
        const rect = Skia.XYWHRect(centerY, centerX, data.height, data.width);
        const paint = Skia.Paint();
        paint.setColor(Skia.Color("red"));
        paint.setStyle(1)
        frame.drawRect(rect, paint);
        // frame.drawText(`${data.label} ${data.score.toFixed(2)}`, centerY, centerX, paint)
      }
    },
    [predictions, imageHeight, imageWidth]
  );

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      if (cameraPermission !== "granted") {
        console.error("Camera permission not granted");
      }
    })();
  }, []);

  if (!device) {
    return <Text style={styles.errorText}>No Camera Device Found</Text>;
  }

  return (
    <Pressable style={styles.container} onPress={handleClick}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        pixelFormat="rgb"
        photo={true}
        frameProcessor={frameProcessor}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  label: {
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    color: "white",
    fontSize: 12,
    position: "absolute",
    top: -15,
    paddingHorizontal: 5,
    borderRadius: 3,
  },
});

export default ObjectDetectionScreen;
