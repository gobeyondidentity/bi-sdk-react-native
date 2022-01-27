import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

class BIEventEmitter extends NativeEventEmitter {
  addListener(event, listener, context) {
    return super.addListener(event, listener, context);
  }

  removeListener(event, listener) {
    return super.removeListener(event, listener);
  }

}

class BILoggerEmitter extends NativeEventEmitter {
  addListener(event, listener, context) {
    return super.addListener(event, listener, context);
  }

  removeListener(event, listener) {
    return super.removeListener(event, listener);
  }

}

const ExtendCredentialsEventEmitter = new BIEventEmitter(NativeModules.BiSdkReactNative);
const LoggerEventEmitter = new BILoggerEmitter(NativeModules.BiSdkReactNative);
const LINKING_ERROR = `The package 'bi-sdk-react-native' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const EmbeddedNativeModules = NativeModules.BiSdkReactNative ? NativeModules.BiSdkReactNative : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }

});
export { EmbeddedNativeModules, BIEventEmitter, BILoggerEmitter, ExtendCredentialsEventEmitter, LoggerEventEmitter };
//# sourceMappingURL=EmbeddedNativeModules.js.map