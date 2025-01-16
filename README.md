# EXPO PROJECT

- Refer to docs for running an expo project. Listed below are some notes that I have for the running project

## Starting Development Build

Android `eas build --profile development --platform android`

## Creating an Android APK for download ( not on app store )

- `npm run android:apk:build`

## Using a development Build

Android `npx expo run:android`
ios `npx expo run:ios`

For connecting to an iOS local device https://github.com/expo/expo/pull/28802
Look around for the switch statement, and the files linked in that pull request
--> This will make the device show up in the list of devices in the next command
Make sure to run `npx expo run:ios --device`

## Deploying for Web

We need to have a .env.production file with proper environment variables
In app.json, change

```
{
  "expo": {
    ...,
    "web": {
      ...,
      "output": "static"
    }
  }
}
```

Then run `npm run web:predeploy`
Then run `npm run web:deploy`

Done :)
