import { EmbeddedNativeModules, LoggerEventEmitter } from './EmbeddedNativeModules';
const Embedded = {
  authenticate(url, credentialID) {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.authenticate(url, credentialID).then(response => resolve({
        redirectURL: response.redirectURL,
        message: response.message || undefined // checking for empty string from native bridge

      })).catch(reject);
    });
  },

  bindCredential: function (url) {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.bindCredential(url).then(response => resolve({
        credential: response.credential,
        postBindingRedirectURI: response.postBindingRedirectURI || undefined // checking for empty string from native bridge

      })).catch(reject);
    });
  },
  deleteCredential: function (id) {
    return EmbeddedNativeModules.deleteCredential(id);
  },
  getCredentials: function () {
    return EmbeddedNativeModules.getCredentials();
  },
  initialize: function (biometricAskPrompt, allowedDomains = []) {
    return EmbeddedNativeModules.initialize(allowedDomains, biometricAskPrompt);
  },

  isAuthenticateUrl(url) {
    return EmbeddedNativeModules.isAuthenticateUrl(url);
  },

  isBindCredentialUrl(url) {
    return EmbeddedNativeModules.isBindCredentialUrl(url);
  },

  logEventEmitter: LoggerEventEmitter
};
export { Embedded };
//# sourceMappingURL=index.js.map