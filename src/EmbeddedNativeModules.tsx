import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

import type { Passkey, Success } from './EmbeddedTypes';

class BILoggerEmitter extends NativeEventEmitter {
  addListener(
    event: 'BeyondIdentityLogger',
    listener: (...args: any[]) => any,
    context?: any
  ) {
    return super.addListener(event, listener, context);
  }
  removeListener(event: 'BeyondIdentityLogger') {
    return super.removeAllListeners(event);
  }
}

const LoggerEventEmitter = new BILoggerEmitter(NativeModules.BiSdkReactNative);

const LINKING_ERROR =
  `The package 'bi-sdk-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go managed workflow\n';

const EmbeddedNativeModules: EmbeddedNativeModules =
  NativeModules.BiSdkReactNative
    ? NativeModules.BiSdkReactNative
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        }
      );

/// Types below represent models passed from Native layer to React.
/// These modesl do no contain optional values, as empty strings would be passed instead.
interface NativeAuthenticateResponse {
  redirectUrl: string;
  message: string;
}

interface NativeBindPasskeyResponse {
  passkey: Passkey;
  postBindingRedirectUri: string;
}

interface EmbeddedNativeModules {
  authenticate(
    url: string,
    passkeyId: string
  ): Promise<NativeAuthenticateResponse>;
  bindPasskey(url: string): Promise<NativeBindPasskeyResponse>;
  deletePasskey(id: string): Promise<string>;
  getPasskeys(): Promise<Passkey[]>;
  initialize(
    allowedDomains: string[],
    biometricAskPrompt: string
  ): Promise<Success>;
  isAuthenticateUrl(url: string): Promise<boolean>;
  isBindPasskeyUrl(url: string): Promise<boolean>;
}

export { EmbeddedNativeModules, LoggerEventEmitter, BILoggerEmitter };
