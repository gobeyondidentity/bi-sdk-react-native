import { NativeEventEmitter } from 'react-native';
import type { Passkey, Success } from './EmbeddedTypes';
declare class BILoggerEmitter extends NativeEventEmitter {
    addListener(event: 'BeyondIdentityLogger', listener: (...args: any[]) => any, context?: any): import("react-native").EmitterSubscription;
    removeListener(event: 'BeyondIdentityLogger'): void;
}
declare const LoggerEventEmitter: BILoggerEmitter;
declare const EmbeddedNativeModules: EmbeddedNativeModules;
interface NativeAuthenticateResponse {
    redirectUrl: string;
    message: string;
}
interface NativeBindPasskeyResponse {
    passkey: Passkey;
    postBindingRedirectUri: string;
}
interface EmbeddedNativeModules {
    authenticate(url: string, passkeyId: string): Promise<NativeAuthenticateResponse>;
    bindPasskey(url: string): Promise<NativeBindPasskeyResponse>;
    deletePasskey(id: string): Promise<string>;
    getPasskeys(): Promise<Passkey[]>;
    initialize(allowedDomains: string[], biometricAskPrompt: string): Promise<Success>;
    isAuthenticateUrl(url: string): Promise<boolean>;
    isBindPasskeyUrl(url: string): Promise<boolean>;
}
export { EmbeddedNativeModules, LoggerEventEmitter, BILoggerEmitter };
