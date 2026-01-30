"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerEventEmitter = exports.EmbeddedNativeModules = exports.BILoggerEmitter = void 0;
var _reactNative = require("react-native");
class BILoggerEmitter extends _reactNative.NativeEventEmitter {
  addListener(event, listener, context) {
    return super.addListener(event, listener, context);
  }
  removeListener(event) {
    return super.removeAllListeners(event);
  }
}
exports.BILoggerEmitter = BILoggerEmitter;
const LoggerEventEmitter = exports.LoggerEventEmitter = new BILoggerEmitter(_reactNative.NativeModules.BiSdkReactNative);
const LINKING_ERROR = `The package 'bi-sdk-react-native' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go managed workflow\n';
const EmbeddedNativeModules = exports.EmbeddedNativeModules = _reactNative.NativeModules.BiSdkReactNative ? _reactNative.NativeModules.BiSdkReactNative : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});

/// Types below represent models passed from Native layer to React.
/// These models do not contain optional values, as empty strings are passed instead.
/// The check for empty strings happens in index.tsx which will convert to an interface with optional values.
//# sourceMappingURL=EmbeddedNativeModules.js.map