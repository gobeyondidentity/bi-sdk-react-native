import {
  BILoggerEmitter,
  EmbeddedNativeModules,
  LoggerEventEmitter,
  NativeAuthenticationContext,
  NativeAuthenticateResponse,
  NativeBindPasskeyResponse,
} from './EmbeddedNativeModules';

import type {
  AuthenticationContext,
  AuthenticateResponse,
  BindPasskeyResponse,
  OtpChallengeResponse,
  Passkey,
  Success,
} from './EmbeddedTypes';

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
  initialize(
    biometricAskPrompt: string,
    allowedDomains?: string[]
  ): Promise<Success>;

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
  redeemOtp(
    url: string,
    otp: string
  ): Promise<AuthenticateResponse | OtpChallengeResponse>;
}

const Embedded: Embedded = {
  authenticate(url: string, passkeyId: string): Promise<AuthenticateResponse> {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.authenticate(url, passkeyId)
        .then((response) => resolve(toAuthenticateResponse(response)))
        .catch(reject);
    });
  },
  authenticateOtp(url, email): Promise<OtpChallengeResponse> {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.authenticateOtp(url, email)
        .then(resolve)
        .catch(reject);
    });
  },
  bindPasskey(url: string): Promise<BindPasskeyResponse> {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.bindPasskey(url)
        .then((response) => resolve(toBindPasskeyResponse(response)))
        .catch(reject);
    });
  },
  deletePasskey(id: string): Promise<string> {
    return EmbeddedNativeModules.deletePasskey(id);
  },
  getAuthenticationContext(url: string): Promise<AuthenticationContext> {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.getAuthenticationContext(url)
        .then((response) => resolve(toAuthenticationContext(response)))
        .catch(reject);
    });
  },
  getPasskeys(): Promise<Passkey[]> {
    return EmbeddedNativeModules.getPasskeys();
  },
  initialize(
    biometricAskPrompt: string,
    allowedDomains: string[] = []
  ): Promise<Success> {
    return EmbeddedNativeModules.initialize(allowedDomains, biometricAskPrompt);
  },
  isAuthenticateUrl(url: string): Promise<boolean> {
    return EmbeddedNativeModules.isAuthenticateUrl(url);
  },
  isBindPasskeyUrl(url: string): Promise<boolean> {
    return EmbeddedNativeModules.isBindPasskeyUrl(url);
  },
  logEventEmitter: LoggerEventEmitter,
  redeemOtp(
    url: string,
    otp: string
  ): Promise<AuthenticateResponse | OtpChallengeResponse> {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.redeemOtp(url, otp)
        .then((response) => {
          if ('redirectUrl' in response) {
            resolve(toAuthenticateResponse(response));
          }
          if ('url' in response) {
            resolve(response);
          }
        })
        .catch(reject);
    });
  },
};

function toAuthenticationContext(
  response: NativeAuthenticationContext
): AuthenticationContext {
  return {
    authUrl: response.authUrl,
    application: {
      id: response.application.id,
      displayName: response.application.displayName || undefined, // checking for empty string from native bridge
    },
    origin: {
      sourceIp: response.origin.sourceIp || undefined, // checking for empty string from native bridge
      userAgent: response.origin.userAgent || undefined, // checking for empty string from native bridge
      geolocation: response.origin.geolocation || undefined, // checking for empty string from native bridge
      referer: response.origin.referer || undefined, // checking for empty string from native bridge
    },
  };
}

function toAuthenticateResponse(
  response: NativeAuthenticateResponse
): AuthenticateResponse {
  return {
    redirectUrl: response.redirectUrl,
    message: response.message || undefined, // checking for empty string from native bridge
    passkeyBindingToken: response.passkeyBindingToken || undefined, // checking for empty string from native bridge
  };
}

function toBindPasskeyResponse(
  response: NativeBindPasskeyResponse
): BindPasskeyResponse {
  return {
    passkey: response.passkey,
    postBindingRedirectUri: response.postBindingRedirectUri || undefined, // checking for empty string from native bridge
  };
}

export { Embedded };
export * from './EmbeddedTypes';
