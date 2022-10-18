import { NativeEventEmitter } from 'react-native';
import type { Credential, Success } from './EmbeddedTypes';
declare class BILoggerEmitter extends NativeEventEmitter {
    addListener(event: 'BeyondIdentityLogger', listener: (...args: any[]) => any, context?: any): import("react-native").EmitterSubscription;
    removeListener(event: 'BeyondIdentityLogger'): void;
}
declare const LoggerEventEmitter: BILoggerEmitter;
declare const EmbeddedNativeModules: EmbeddedNativeModules;
interface NativeAuthenticateResponse {
    redirectURL: string;
    message: string;
}
interface NativeBindCredentialResponse {
    credential: Credential;
    postBindingRedirectURI: string;
}
interface EmbeddedNativeModules {
    authenticate(url: string, credentialID: string): Promise<NativeAuthenticateResponse>;
    bindCredential(url: string): Promise<NativeBindCredentialResponse>;
    deleteCredential(id: string): Promise<string>;
    getCredentials(): Promise<Credential[]>;
    initialize(allowedDomains: string[], biometricAskPrompt: string): Promise<Success>;
    isAuthenticateUrl(url: string): Promise<boolean>;
    isBindCredentialUrl(url: string): Promise<boolean>;
}
export { EmbeddedNativeModules, LoggerEventEmitter, BILoggerEmitter };
