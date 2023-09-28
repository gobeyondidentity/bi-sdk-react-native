import { BILoggerEmitter } from './EmbeddedNativeModules';
import type { AuthenticationContext, AuthenticateResponse, BindPasskeyResponse, OtpChallengeResponse, Passkey, Success } from './EmbeddedTypes';
interface Embedded {
    /**
     * Authenticate a user and receive an `AuthenticateResponse`.
     * @param url The authentication URL of the current transaction.
     * @param passkeyId the ID of the passkey with which to authenticate.
     */
    authenticate(url: string, passkeyId: string): Promise<AuthenticateResponse>;
    /**
     * Initiates authentication using an OTP, which will be sent to the provided email address.
     * @param url The authentication URL of the current transaction.
     * @param email The email address where the OTP will be sent.
     */
    authenticateOtp(url: string, email: string): Promise<OtpChallengeResponse>;
    /**
     * Bind a passkey to a device.
     * @param url the URL used to bind a passkey to a device.
     */
    bindPasskey(url: string): Promise<BindPasskeyResponse>;
    /**
     * Delete a passkey by ID.
     * @note it is possible to delete a passkey that does not exist.
     * @warning deleting a passkey is destructive and will remove everything from the device. If no other device contains the passkey then the user will need to complete a recovery in order to log in again on this device.
     * @param id the the passkey id, uniquely identifying a `Passkey`.
     */
    deletePasskey(id: string): Promise<string>;
    /**
     * Get all current passkeys for this device.
     */
    getPasskeys(): Promise<Passkey[]>;
    /**
     * Get the Authentication Context for the current transaction.
     *
     * The Authentication Context contains the Authenticator Config, Authentication Method Configuration, request origin, and the authenticating application.
     * This is used to retrieve authentication parameters for an ongoing transaction.
     * @param url The authentication URL of the current transaction.
     */
    getAuthenticationContext(url: string): Promise<AuthenticationContext>;
    /**
     * Initialize the SDK. This must be called before any other functions are called.
     * Note: Hot reloading will not call this function again. If changes have been made to calling this function, fully reload the app to see those changes.
     * @param biometricAskPrompt A prompt the user will see when asked for biometrics.
     * @param allowedDomains An optional array of whitelisted domains for network operations. This will default to Beyond Identity’s allowed domains when not provided or is empty.
     */
    initialize(biometricAskPrompt: string, allowedDomains?: string[]): Promise<Success>;
    /**
     * Returns whether a URL is a valid Authenticate URL or not.
     * @param url The URL in question.
     */
    isAuthenticateUrl(url: string): Promise<boolean>;
    /**
     * Returns whether a URL is a valid Bind Passkey URL or not.
     * @param url The URL in question.
     */
    isBindPasskeyUrl(url: string): Promise<boolean>;
    /**
     * A NativeEventEmitter to listen for `Logger` events after calling `Embedded.initialize`
     */
    logEventEmitter: BILoggerEmitter;
    /**
     * Redeems an OTP for a grant code.
     *
     * Returns a promise that resolves to an `AuthenticateResponse` on success
     * or an `OtpChallengeResponse` on failure to authenticate with the provided OTP code.
     * Use the url provided in `OtpChallengeResponse` for retry.
     * @param url The authentication URL of the current transaction.
     * @param otp The OTP to redeem.
     */
    redeemOtp(url: string, otp: string): Promise<AuthenticateResponse | OtpChallengeResponse>;
}
declare const Embedded: Embedded;
export { Embedded };
export * from './EmbeddedTypes';
