import {
  EmbeddedNativeModules,
  LoggerEventEmitter,
  BILoggerEmitter,
} from './EmbeddedNativeModules';

import type {
  AuthenticateResponse,
  BindCredentialResponse,
  Credential,
  CredentialState,
  Success,
} from './EmbeddedTypes';

interface Embedded {
  /**
   * Authenticate a user and receive an `AuthenticateResponse`.
   * @param url the url used to authenticate.
   * @param credentialID the `id` of the Credential with which to authenticate.
   */
  authenticate(
    url: string,
    credentialID: string
  ): Promise<AuthenticateResponse>;

  /**
   * Bind a credential to a device.
   * @param url the url used to bind a credential to a device.
   */
  bindCredential(url: string): Promise<BindCredentialResponse>;

  /**
   * Delete a Credential by ID.
   * @warning deleting a Credential is destructive and will remove everything from the device. If no other device contains the credential then the user will need to complete a recovery in order to log in again on this device.
   * @param id the unique identifier of the Credential.
   */
  deleteCredential(id: string): Promise<string>;

  /**
   * Get all current credentials.
   * Only one credential per device is currently supported.
   */
  getCredentials(): Promise<Credential[]>;

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
   * Determines if a URL is a valid Authenticate URL.
   * @param url The URL in question.
   */
  isAuthenticateUrl(url: string): Promise<boolean>;

  /**
   * Determines if a URL is a valid Bind Credentail URL.
   * @param url The URL in question.
   */
  isBindCredentialUrl(url: string): Promise<boolean>;

  /**
   * A NativeEventEmitter to listen for `Logger` events after calling `Embedded.initialize`
   */
  logEventEmitter: BILoggerEmitter;
}

const Embedded: Embedded = {
  authenticate(
    url: string,
    credentialID: string
  ): Promise<AuthenticateResponse> {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.authenticate(url, credentialID)
        .then((response) =>
          resolve({
            redirectURL: response.redirectURL,
            message: response.message || undefined, // checking for empty string from native bridge
          })
        )
        .catch(reject);
    });
  },
  bindCredential: function (url: string): Promise<BindCredentialResponse> {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.bindCredential(url)
        .then((response) =>
          resolve({
            credential: response.credential,
            postBindingRedirectURI:
              response.postBindingRedirectURI || undefined, // checking for empty string from native bridge
          })
        )
        .catch(reject);
    });
  },
  deleteCredential: function (id: string): Promise<string> {
    return EmbeddedNativeModules.deleteCredential(id);
  },
  getCredentials: function (): Promise<Credential[]> {
    return EmbeddedNativeModules.getCredentials();
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
  isBindCredentialUrl(url: string): Promise<boolean> {
    return EmbeddedNativeModules.isBindCredentialUrl(url);
  },
  logEventEmitter: LoggerEventEmitter,
};

export { AuthenticateResponse, Credential, CredentialState, Embedded, Success };
