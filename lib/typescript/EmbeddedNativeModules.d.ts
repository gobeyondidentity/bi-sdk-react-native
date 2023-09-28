import { NativeEventEmitter } from 'react-native';
import type { OtpChallengeResponse, Passkey, Success } from './EmbeddedTypes';
declare class BILoggerEmitter extends NativeEventEmitter {
    addListener(event: 'BeyondIdentityLogger', listener: (...args: any[]) => any, context?: any): import("react-native").EmitterSubscription;
    removeListener(event: 'BeyondIdentityLogger'): void;
}
declare const LoggerEventEmitter: BILoggerEmitter;
declare const EmbeddedNativeModules: EmbeddedNativeModules;
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
    authenticate(url: string, passkeyId: string): Promise<NativeAuthenticateResponse>;
    authenticateOtp(url: string, email: string): Promise<OtpChallengeResponse>;
    bindPasskey(url: string): Promise<NativeBindPasskeyResponse>;
    deletePasskey(id: string): Promise<string>;
    getAuthenticationContext(url: string): Promise<NativeAuthenticationContext>;
    getPasskeys(): Promise<Passkey[]>;
    initialize(allowedDomains: string[], biometricAskPrompt: string): Promise<Success>;
    isAuthenticateUrl(url: string): Promise<boolean>;
    isBindPasskeyUrl(url: string): Promise<boolean>;
    redeemOtp(url: string, otp: string): Promise<NativeAuthenticateResponse | OtpChallengeResponse>;
}
export { BILoggerEmitter, EmbeddedNativeModules, LoggerEventEmitter, NativeAuthenticateResponse, NativeAuthenticationContext, NativeBindPasskeyResponse, };
