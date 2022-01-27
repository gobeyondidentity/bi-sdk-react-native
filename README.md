![Beyond-Identity-768x268](https://user-images.githubusercontent.com/6456218/111526630-5c826d00-8735-11eb-84ae-809af105b626.jpeg)

# Beyond Identity React Native SDK

Goodbye, passwords! The Beyond Identity SDK for React Native is a wrapper around our Native Embedded SDKs ([iOS](https://github.com/gobeyondidentity/bi-sdk-swift) and [Android](https://github.com/gobeyondidentity/bi-sdk-android)), which allows you to embed the Passwordless experience into your product. This SDK supports OIDC and OAuth2.

## Installation

### Install the library:

```sh
yarn add @beyondidentity/embedded-react-native
```

or

```
npm i --save @beyondidentity/embedded-react-native
```

> Note that this library is not compatible with Expo projects. This is because Expo's “managed” workflow does not allow usage of React Native libraries that introduce their own native code beyond the React Native APIs and components that are available in the Expo client app. If you have an Expo app and wish to use this project, you must `eject`.

### Update Native:

Make sure your `ios/Podfile` supports iOS 12 or later

```sh
platform :ios, '12.0'
```

Go to your ios folder and run:

```sh
 pod install
```

Make sure your `android/build.gradle` supports minSdkVersion 28 or later

```
buildscript {
  ext {
    minSdkVersion = 28
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

## Usage

```js
import { Embedded } from '@beyondidentity/embedded-react-native';
```

A set of functions are provided to you in this SDK. For more info, visit the [Developer Docs](https://developer.beyondidentity.com)

## Run Examples

To set up:

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
