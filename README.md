# EXPO PROJECT

- Refer to docs for running an expo project. Listed below are some notes that I have for the running project

## Starting Development Build

Android `eas build --profile development --platform android`

## Using a development Build

Android `npx expo run:android`
ios `npx expo run:ios`

## Adding in @rnmapbox/maps

- Add in plugins
- Prebuild???

## Map decision

- Deciding to go with react-native-maps over @rnmapbox/maps for now because it is supported by expo go, and trying to get mapbox up and running is proving to be too confusing for the time being.
- this is something I will have to circle back to in the future if we want the map experience to be a lot better
