import { NativeEventEmitter } from 'react-native';
declare class BIEventEmitter extends NativeEventEmitter {
    addListener(event: ExtendCredentialsEvents, listener: (...args: any[]) => any, context?: any): import("react-native").EmitterSubscription;
    removeListener(event: ExtendCredentialsEvents, listener: (...args: any[]) => any): void;
}
declare class BILoggerEmitter extends NativeEventEmitter {
    addListener(event: 'Logger', listener: (...args: any[]) => any, context?: any): import("react-native").EmitterSubscription;
    removeListener(event: 'Logger', listener: (...args: any[]) => any): void;
}
declare const ExtendCredentialsEventEmitter: BIEventEmitter;
declare const LoggerEventEmitter: BILoggerEmitter;
declare const EmbeddedNativeModules: EmbeddedNativeModules;
interface AuthorizationCode {
    /**
     * An authorization code grant used to exchange for an access token.
     */
    authorizationCode: string;
}
/**
 * A User Credential. Think of this as a wrapper around an X.509 Certificate.
 */
interface Credential {
    /**
     * The human-readable display name of the Credential.
     */
    name: string;
    /**
     * The certificate chain of the Credential in PEM-guarded X509 format.
     */
    chain: string[];
    /**
     * The date the Credential was created.
     */
    create: string;
    /**
     * The uri of your app's sign up screen. This is where the user would register with your service.
     */
    enrollURI?: string;
    /**
     * The handle for the `Credential`. This is identical to your `tenant_id`.
     */
    handle: string;
    /**
     * The enclave key handle. This handle is used to identify a private key in the T2 enclave or keychain.
     */
    keyHandle: string;
    /**
     * The uri of your company or app's logo.
     */
    logoURL: string;
    /**
     * The uri of your app's sign in screen. This is where the user would authenticate into your app.
     */
    loginURI?: string;
    /**
     * The SHA256 hash of the root certificate as a base64 encoded string.
     */
    rootFingerprint: string;
}
/**
 * Possible extend events to listen for on the `Embedded.extendCredentialsEventEmitter` after calling `Embedded.extendCredentials`
 */
declare type ExtendCredentialsEvents = 'ExtendCredentialAborted' | 'ExtendTokenReceived' | 'ExtendCredentialCompleted' | 'ExtendError';
/**
 * Proof Key for Code Exchange (PKCE, pronounced "pixy") used by public clients to mitigate authorization code interception attack.
 */
interface PKCE {
    /**
     * A one-time high-entropy cryptographic random String used to correlate the authorization request to the token request
     */
    codeVerifier: string;
    /**
     * Derived from the `codeVerifier`. Send to the authorization request, to be verified against later.
     */
    codeChallenge: string;
    /**
     * A method that was used to derive the `codeChallenge` suchs as S256.
     */
    codeChallengeMethod: string;
}
declare type Success = 'success';
interface TokenResponse {
    /**
     * OAuth token grant
     */
    accessToken: string;
    /**
     * OIDC JWT token grant
     */
    idToken: string;
    /**
     * AccessToken type such as "Bearer"
     */
    tokenType: string;
    /**
     * AccessToken expiration
     */
    expiresIn: number;
}
interface EmbeddedNativeModules {
    authorize(pkceCodeChallenge: string, pkceCodeChallengeMethod: string, scope: string): Promise<AuthorizationCode>;
    authenticate(): Promise<TokenResponse>;
    cancelExtendCredentials(): Promise<Success>;
    createPKCE(): Promise<PKCE>;
    deleteCredential(handle: string): Promise<string>;
    extendCredentials(handles: string[]): void;
    getCredentials(): Promise<Credential[]>;
    initialize(biometricAskPrompt: string, clientID: string, redirectURI: string): void;
    registerCredentialsWithToken(token: string): Promise<Credential[]>;
    registerCredentialsWithUrl(url: string): Promise<Credential>;
}
export { EmbeddedNativeModules, AuthorizationCode, BIEventEmitter, BILoggerEmitter, TokenResponse, Success, PKCE, ExtendCredentialsEvents, ExtendCredentialsEventEmitter, LoggerEventEmitter, Credential, };
