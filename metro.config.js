//metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const ALIASES = {
  "react-native-maps": "@teovilla/react-native-web-maps",
};

// Add polyfills
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'buffer': require.resolve('buffer/'),
};
config.transformer.getTransformOptions = () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && ALIASES[moduleName]) {
    // The alias will only be used when bundling for the web.
    return context.resolveRequest(
      context,
      ALIASES[moduleName] ?? moduleName,
      platform
    );
  }
  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

config.resetCache = true;
config.cacheVersion = process.env.APP_ENV;

module.exports = config;
