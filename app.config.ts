import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "scout-tool",
  name: process.env.APP_NAME || "Scouting-Tool",
  plugins: [
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow Scout-Tool to access your location",
      },
    ],
    ["expo-router"],
    [
      "expo-camera",
      {
        cameraPermission: "Allow ${APP_NAME} to use your camera",
      },
    ],
  ],
});
