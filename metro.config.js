const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

let config = getDefaultConfig(__dirname);

// Custom asset extensions
config.resolver.assetExts.push("tflite");
config.resolver.assetExts.push("pte");
config.resolver.assetExts.push("bin");

// Wrap with Reanimated config first
config = wrapWithReanimatedMetroConfig(config);

// Wrap with NativeWind config
module.exports = withNativeWind(config, { input: "./global.css" });
