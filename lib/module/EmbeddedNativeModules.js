import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
class BILoggerEmitter extends NativeEventEmitter {
  addListener(event, listener, context) {
    return super.addListener(event, listener, context);
  }
  removeListener(event) {
    return super.removeAllListeners(event);
  }
}
const LoggerEventEmitter = new BILoggerEmitter(NativeModules.BiSdkReactNative);
const LINKING_ERROR = `The package 'bi-sdk-react-native' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go managed workflow\n';
const EmbeddedNativeModules = NativeModules.BiSdkReactNative ? NativeModules.BiSdkReactNative : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});

/// Types below represent models passed from Native layer to React.
/// These modesl do no contain optional values, as empty strings would be passed instead.

export { EmbeddedNativeModules, LoggerEventEmitter, BILoggerEmitter };
//# sourceMappingURL=EmbeddedNativeModules.js.map