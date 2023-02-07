<p align="center">
   <br/>
   <a href="https://developers.beyondidentity.com" target="_blank"><img src="https://user-images.githubusercontent.com/238738/178780350-489309c5-8fae-4121-a20b-562e8025c0ee.png" width="150px" ></a>
   <h3 align="center">Beyond Identity</h3>
   <p align="center">Universal Passkeys for Developers</p>
   <p align="center">
   All devices. Any protocol. Zero shared secrets.
   </p>
</p>

# Beyond Identity React Native SDK

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

### Embedded SDK

Goodbye, passwords! The Beyond Identity SDK for React Native is a wrapper around our Native Embedded SDKs ([Android](https://github.com/gobeyondidentity/bi-sdk-android) and [iOS](https://github.com/gobeyondidentity/bi-sdk-swift)), which allows you to embed the Passwordless experience into your product. Users will not need to download the Beyond Identity Authenticator. This SDK supports OIDC and OAuth2.

## Installation

### Using a [bare expo](https://docs.expo.dev/bare/hello-world/) or [react-native init](https://reactnative.dev/docs/environment-setup) app.

1. Install the SDK:
```
yarn add @beyondidentity/bi-sdk-react-native
```
or
```
npm install @beyondidentity/bi-sdk-react-native
```
2. Update Native Requirements in your ios/android folders:

Please make sure your iOS project supports "minimum deployment target" 13.0 or later.

In your `ios/Podfile` set:

```sh
platform :ios, '13.0'
```

Go to your ios folder and run:

```sh
 pod install
```

Make sure your `android/build.gradle` supports minSdkVersion 26 or later

```
buildscript {
  ext {
    minSdkVersion = 26
  }
}
```

Add the following maven url to your repositories in your `android/build.gradle`

```
allprojects {
  repositories {
    maven {
      url "https://packages.beyondidentity.com/public/bi-sdk-android/maven/"
    }
  }
}
```

### Using `expo`
> :warning: This package cannot be used in "Expo Go" because [it requires custom native code](https://docs.expo.io/workflow/customizing/). However you can leverage this library with a [development build](https://docs.expo.dev/development/introduction/) or [prebuild](https://docs.expo.dev/workflow/prebuild/).  

1. Install the SDK:
```
expo install @beyondidentity/bi-sdk-react-native
```

2. Add the SDK [config plugin](https://docs.expo.dev/guides/config-plugins/) to the [plugins array](https://docs.expo.dev/versions/latest/config/app/#plugins) of your app.{json,config.js,config.ts}:
```
{
  "expo": {
    "plugins": [
      ["@beyondidentity/bi-sdk-react-native"],
    ]
  }
}
```

3. Set native requirments either with [expo-build-properties](https://docs.expo.dev/versions/latest/sdk/build-properties/) or modify project [static files](https://docs.expo.dev/guides/config-plugins/#static-modification)

A. Modify the following static files

android/gradle.properties
```
android.minSdkVersion=26
```
ios/Podfile.properties.json
```
"ios.deploymentTarget": "13.0"
```

*or* 

B. Add [expo-build-properties](https://docs.expo.dev/versions/latest/sdk/build-properties/) to your app.{json,config.js,config.ts}:


```
expo install expo-build-properties
```

```
{
  "expo": {
    "plugins": [
      ["@beyondidentity/bi-sdk-react-native"],
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 26
          },
          "ios": {
            "deploymentTarget": "13.0"
          }
        }
      ]
    ]
  }
}
```

4.  Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.dev/workflow/customizing/) guide.

## Usage

Check out the [Developer Documentation](https://developer.beyondidentity.com) and the [SDK API Documentation](https://gobeyondidentity.github.io/bi-sdk-react-native/) for more information.

### Setup

First, before calling the Embedded functions, make sure to initialize the SDK. This can be done where you register your root component.

```javascript
import { Embedded } from '@beyondidentity/bi-sdk-react-native';

Embedded.initialize(
  biometricAskPrompt: string,
  allowedDomains?: string[]
): Promise<Success>;
```

You may also add a listener to log native events with `Embedded.logEventEmitter` after initializing.

## Example App

Clone the following repo and use the available comands to see the SDK in action!

To set up (run this first):

```sh
yarn bootstrap
```

To run the example app on Android:

```sh
yarn example android
```

To run the example app on iOS:

```sh
yarn example ios
```

To start the packager:

```sh
yarn example start
```
