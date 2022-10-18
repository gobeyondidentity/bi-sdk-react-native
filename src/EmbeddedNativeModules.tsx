import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

import type { Credential, Success } from './EmbeddedTypes';

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
  '- You are not using Expo managed workflow\n';

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
  redirectURL: string;
  message: string;
}

interface NativeBindCredentialResponse {
  credential: Credential;
  postBindingRedirectURI: string;
}

interface EmbeddedNativeModules {
  authenticate(
    url: string,
    credentialID: string
  ): Promise<NativeAuthenticateResponse>;
  bindCredential(url: string): Promise<NativeBindCredentialResponse>;
  deleteCredential(id: string): Promise<string>;
  getCredentials(): Promise<Credential[]>;
  initialize(
    allowedDomains: string[],
    biometricAskPrompt: string
  ): Promise<Success>;
  isAuthenticateUrl(url: string): Promise<boolean>;
  isBindCredentialUrl(url: string): Promise<boolean>;
}

export { EmbeddedNativeModules, LoggerEventEmitter, BILoggerEmitter };
