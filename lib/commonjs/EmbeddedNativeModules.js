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
const LoggerEventEmitter = new BILoggerEmitter(_reactNative.NativeModules.BiSdkReactNative);
exports.LoggerEventEmitter = LoggerEventEmitter;
const LINKING_ERROR = `The package 'bi-sdk-react-native' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go managed workflow\n';
const EmbeddedNativeModules = _reactNative.NativeModules.BiSdkReactNative ? _reactNative.NativeModules.BiSdkReactNative : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});

/// Types below represent models passed from Native layer to React.
/// These modesl do no contain optional values, as empty strings would be passed instead.
exports.EmbeddedNativeModules = EmbeddedNativeModules;
//# sourceMappingURL=EmbeddedNativeModules.js.map