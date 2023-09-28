import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

import type { OtpChallengeResponse, Passkey, Success } from './EmbeddedTypes';

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
/// These models do not contain optional values, as empty strings are passed instead.
/// The check for empty strings happens in index.tsx which will convert to an interface with optional values.
interface NativeAuthenticateResponse {
  redirectUrl: string;
  message: string;
  passkeyBindingToken: string;
}

interface NativeBindPasskeyResponse {
  passkey: Passkey;
  postBindingRedirectUri: string;
}

interface NativeAuthenticationContext {
  authUrl: string;
  application: {
    id: string;
    displayName: string;
  };
  origin: {
    sourceIp: string;
    userAgent: string;
    geolocation: string;
    referer: string;
  };
}

interface EmbeddedNativeModules {
  authenticate(
    url: string,
    passkeyId: string
  ): Promise<NativeAuthenticateResponse>;
  authenticateOtp(url: string, email: string): Promise<OtpChallengeResponse>;
  bindPasskey(url: string): Promise<NativeBindPasskeyResponse>;
  deletePasskey(id: string): Promise<string>;
  getAuthenticationContext(url: string): Promise<NativeAuthenticationContext>;
  getPasskeys(): Promise<Passkey[]>;
  initialize(
    allowedDomains: string[],
    biometricAskPrompt: string
  ): Promise<Success>;
  isAuthenticateUrl(url: string): Promise<boolean>;
  isBindPasskeyUrl(url: string): Promise<boolean>;
  redeemOtp(
    url: string,
    otp: string
  ): Promise<NativeAuthenticateResponse | OtpChallengeResponse>;
}

export {
  BILoggerEmitter,
  EmbeddedNativeModules,
  LoggerEventEmitter,
  NativeAuthenticateResponse,
  NativeAuthenticationContext,
  NativeBindPasskeyResponse,
};
