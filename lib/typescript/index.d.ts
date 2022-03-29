import { AuthorizationCode, BIEventEmitter, BILoggerEmitter, TokenResponse, Success, PKCE, ExtendCredentialsEvents, Credential, CredentialState } from './EmbeddedNativeModules';
/**
 * PKCE `codeChallenege` derived from a `codeVerifier`. Send this to the authorization request, to be verified against later.
 */
declare type PKCEChallenge = {
    challenge?: never;
    method?: never;
} | {
    challenge: string;
    method: string;
};
interface Embedded {
    /**
     * Used for OIDC confidential clients.
     * Authorize a user from a confidential client and receive an `AuthorizationCode` to be used by your backend for a token exchange.
     * This assumes the existing of a secure backend that can safely store the client secret and can exchange the authorization code for an access and id token.
     * Make sure you have configured your clientID to be a confidential client ID.
     * @param pkceCodeChallenge Optional PKCE challenge and method. Recommended to prevent authorization code injection.
     * @param scope string list (comma separated) of OIDC scopes used during authentication to authorize access to a user's specific details. Only "openid" is currently supported.
     */
    authorize(pkceCodeChallenge: PKCEChallenge, scopes: string): Promise<AuthorizationCode>;
    /**
     * Used for OIDC public clients.
     * Authentiate a user from a public client and receive a `TokenResponse`. The will contain the access and id token.
     * PKCE is handled internally to mitigate against an authorization code interception attack.
     * This assumes there is no backend and the client secret can't be safely stored.
     * Make sure you have configured your clientID to be a public client ID.
     */
    authenticate(): Promise<TokenResponse>;
    /**
     * Cancel an in progress `extendCredentials`.
     * This is called implicitly if an `extendCredentials` succeeds or fails.
     * Alternatively, this needs to be called if a user no longer needs to extend a Credential.
     */
    cancelExtendCredentials(): Promise<Success>;
    /**
     * Create a Proof Key for Code Exchange (PKCE, pronounced "pixy")
     * Used by public clients to mitigate authorization code interception attack.
     * {@link https://datatracker.ietf.org/doc/html/rfc7636}
     */
    createPKCE(): Promise<PKCE>;
    /**
     * Delete a Credential by handle.
     * @warning deleting a Credential is destructive and will remove everything from the device. If no other device contains the credential then the user will need to complete a recovery in order to log in again on this device.
     * @param handle string handle that uniquely identifies a `Credential`.
     */
    deleteCredential(handle: string): Promise<string>;
    /**
     * Extend a list of credentials. The user must be in an authenticated state to extend any credentials.
     * Use this function to extend credentials from one device to another.
     * Calling this function will emit `ExtendCredentialsEvents` that should be listened for through `extendCredentialsEventEmitter`.
     * Only one credential per device is currently supported.
     * @param handles list of Credential handles to be extended
     */
    extendCredentials(handles: string[]): void;
    /**
     * A NativeEventEmitter to listen for `ExtendCredentialsEvents` events after calling `Embedded.extendCredentials`
     */
    extendCredentialsEventEmitter: BIEventEmitter;
    /**
     * Get all current credentials.
     * Only one credential per device is currently supported.
     */
    getCredentials(): Promise<Credential[]>;
    /**
     * Register a Credential.
     * Use this function to register a Credential from one device to another.
     * @param token the 9 digit code that the user entered. This may represent one or more credentials, but only one credential per device is currently supported.
     */
    registerCredentialsWithToken(token: string): Promise<Credential[]>;
    /**
     * Initialize the SDK. This must be called before any other functions are called.
     * @param biometricAskPrompt A prompt the user will see when asked for biometrics while extending a credential to another device.
     * @param clientID The public or confidential client ID generated during the OIDC configuration.
     * @param redirectURI URI where the user will be redirected after the authorization has completed.
     * The redirect URI must be one of the URIs passed in the OIDC configuration.
     */
    initialize(biometricAskPrompt: string, clientID: string, redirectURI: string): void;
    /**
     * A NativeEventEmitter to listen for `Logger` events after calling `Embedded.initialize`
     */
    logEventEmitter: BILoggerEmitter;
    /**
     * Use this function to handle a universal link passed to the app during registration or recovery.
     * The url might be passed after a user taps a registration or recovery email.
     * @param url a universal link passed to the app during registration or recovery.
     */
    registerCredentialsWithUrl(url: string): Promise<Credential>;
}
declare const Embedded: Embedded;
export { AuthorizationCode, Credential, CredentialState, Embedded, ExtendCredentialsEvents, PKCE, PKCEChallenge, Success, TokenResponse, };
