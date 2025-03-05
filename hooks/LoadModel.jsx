import {
  ObjectDetectionConfig,
  CustomObjectDetectorOptions,
  useObjectDetectionModels,
  useObjectDetectionProvider,
} from "@infinitered/react-native-mlkit-object-detection";
import ObjectResult from "../app/(Modes)/ObjectDetection/object-result";

// Define your custom models if needed (see "Using a Custom Model" for more details)
const MODELS = {
  objectDetector: {
    model: require("../assets/models/model.tflite"),
  },
};

// Export this type so we can use it with our hooks later
export const MyModelsConfig = MODELS;

function LoadModel({children}) {
  // Load the models
  const models = useObjectDetectionModels({
    assets: MODELS,
    loadDefaultModel: true, // whether to load the default model
    defaultModelOptions: {
      shouldEnableMultipleObjects: true,
      shouldEnableClassification: true,
      detectorMode: "singleImage",
    },
  });

  // Get the provider component
  const { ObjectDetectionModelProvider } = useObjectDetectionProvider(models);
  console.log("This is loading of od :\t", useObjectDetectionProvider(models))
  return <ObjectDetectionModelProvider>
    {children}
  </ObjectDetectionModelProvider>;
}

export default LoadModel;
