import {
  EmbeddedNativeModules,
  LoggerEventEmitter,
  BILoggerEmitter,
} from './EmbeddedNativeModules';

import type {
  AuthenticateResponse,
  BindPasskeyResponse,
  Passkey,
  PasskeyState,
  Success,
} from './EmbeddedTypes';

interface Embedded {
  /**
   * Authenticate a user and receive an `AuthenticateResponse`.
   * @param url the URL used to authenticate.
   * @param passkeyId the ID of the passkey with which to authenticate.
   */
  authenticate(url: string, passkeyId: string): Promise<AuthenticateResponse>;

  /**
   * Bind a passkey to a device.
   * @param url the URL used to bind a passkey to a device.
   */
  bindPasskey(url: string): Promise<BindPasskeyResponse>;

  /**
   * Delete a passkey by ID.
   * @warning deleting a passkey is destructive and will remove everything from the device. If no other device contains the passkey then the user will need to complete a recovery in order to log in again on this device.
   * @param id the the passkey id, uniquely identifying a `Passkey`.
   */
  deletePasskey(id: string): Promise<string>;

  /**
   * Get all current passkeys for this device.
   */
  getPasskeys(): Promise<Passkey[]>;

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
}

const Embedded: Embedded = {
  authenticate(url: string, passkeyId: string): Promise<AuthenticateResponse> {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.authenticate(url, passkeyId)
        .then((response) =>
          resolve({
            redirectUrl: response.redirectUrl,
            message: response.message || undefined, // checking for empty string from native bridge
          })
        )
        .catch(reject);
    });
  },
  bindPasskey: function (url: string): Promise<BindPasskeyResponse> {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.bindPasskey(url)
        .then((response) =>
          resolve({
            passkey: response.passkey,
            postBindingRedirectUri:
              response.postBindingRedirectUri || undefined, // checking for empty string from native bridge
          })
        )
        .catch(reject);
    });
  },
  deletePasskey: function (id: string): Promise<string> {
    return EmbeddedNativeModules.deletePasskey(id);
  },
  getPasskeys: function (): Promise<Passkey[]> {
    return EmbeddedNativeModules.getPasskeys();
  },
  initialize: function (
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
};

export { AuthenticateResponse, Passkey, PasskeyState, Embedded, Success };
