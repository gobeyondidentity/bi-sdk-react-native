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

Goodbye, passwords! The Beyond Identity SDK for React Native is a wrapper around our Native Embedded SDKs ([iOS](https://github.com/gobeyondidentity/bi-sdk-swift) and [Android](https://github.com/gobeyondidentity/bi-sdk-android)), which allows you to embed the Passwordless experience into your product. This SDK supports OIDC and OAuth2.

## Installation

### Install the library:

```sh
yarn add @beyondidentity/bi-sdk-react-native
```

or

```
npm i --save @beyondidentity/bi-sdk-react-native
```

> Note that this library is not compatible with Expo projects. This is because Expo's “managed” workflow does not allow usage of React Native libraries that introduce their own native code beyond the React Native APIs and components that are available in the Expo client app. If you have an Expo app and wish to use this project, you must `eject`.

### Update Native:

Make sure your `ios/Podfile` supports iOS 13 or later

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

## Usage

```js
import { Embedded } from '@beyondidentity/bi-sdk-react-native';
```

A set of functions are provided to you in this SDK. Check out the [documentation](https://developer.beyondidentity.com) for more information.

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
