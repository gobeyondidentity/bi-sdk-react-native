import { EmbeddedNativeModules, AuthorizationCode, TokenResponse, Success, PKCE, ExtendCredentialsEvents, ExtendCredentialsEventEmitter, LoggerEventEmitter, Credential } from './EmbeddedNativeModules';
/**
 * PKCE `codeChallenege` derived from a `codeVerifier`. Send this to the authorization request, to be verified against later.
 */

const Embedded = {
  authorize: function (pkceCodeChallenge, scope) {
    const challenge = pkceCodeChallenge.challenge == null ? '' : pkceCodeChallenge.challenge;
    const method = pkceCodeChallenge.method == null ? '' : pkceCodeChallenge.method;
    return EmbeddedNativeModules.authorize(challenge, method, scope);
  },
  authenticate: function () {
    return EmbeddedNativeModules.authenticate();
  },
  cancelExtendCredentials: function () {
    return EmbeddedNativeModules.cancelExtendCredentials();
  },
  createPKCE: function () {
    return EmbeddedNativeModules.createPKCE();
  },
  deleteCredential: function (handle) {
    return EmbeddedNativeModules.deleteCredential(handle);
  },
  extendCredentials: function (handles) {
    return EmbeddedNativeModules.extendCredentials(handles);
  },
  extendCredentialsEventEmitter: ExtendCredentialsEventEmitter,
  getCredentials: function () {
    return EmbeddedNativeModules.getCredentials();
  },
  initialize: function (biometricAskPrompt, clientID, redirectURI) {
    return EmbeddedNativeModules.initialize(biometricAskPrompt, clientID, redirectURI);
  },
  logEventEmitter: LoggerEventEmitter,
  registerCredentialsWithToken: function (token) {
    return EmbeddedNativeModules.registerCredentialsWithToken(token);
  },
  registerCredentialsWithUrl: function (url) {
    return EmbeddedNativeModules.registerCredentialsWithUrl(url);
  }
};
export { AuthorizationCode, Credential, Embedded, ExtendCredentialsEvents, PKCE, Success, TokenResponse };
//# sourceMappingURL=index.js.map