"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerEventEmitter = exports.ExtendCredentialsEventEmitter = exports.EmbeddedNativeModules = exports.BILoggerEmitter = exports.BIEventEmitter = void 0;

var _reactNative = require("react-native");

class BIEventEmitter extends _reactNative.NativeEventEmitter {
  addListener(event, listener, context) {
    return super.addListener(event, listener, context);
  }

  removeListener(event, listener) {
    return super.removeListener(event, listener);
  }

}

exports.BIEventEmitter = BIEventEmitter;

class BILoggerEmitter extends _reactNative.NativeEventEmitter {
  addListener(event, listener, context) {
    return super.addListener(event, listener, context);
  }

  removeListener(event, listener) {
    return super.removeListener(event, listener);
  }

}

exports.BILoggerEmitter = BILoggerEmitter;
const ExtendCredentialsEventEmitter = new BIEventEmitter(_reactNative.NativeModules.BiSdkReactNative);
exports.ExtendCredentialsEventEmitter = ExtendCredentialsEventEmitter;
const LoggerEventEmitter = new BILoggerEmitter(_reactNative.NativeModules.BiSdkReactNative);
exports.LoggerEventEmitter = LoggerEventEmitter;
const LINKING_ERROR = `The package 'bi-sdk-react-native' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const EmbeddedNativeModules = _reactNative.NativeModules.BiSdkReactNative ? _reactNative.NativeModules.BiSdkReactNative : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }

});
exports.EmbeddedNativeModules = EmbeddedNativeModules;
//# sourceMappingURL=EmbeddedNativeModules.js.map