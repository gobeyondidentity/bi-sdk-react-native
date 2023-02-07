import { EmbeddedNativeModules, LoggerEventEmitter } from './EmbeddedNativeModules';
const Embedded = {
  authenticate(url, passkeyId) {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.authenticate(url, passkeyId).then(response => resolve({
        redirectUrl: response.redirectUrl,
        message: response.message || undefined // checking for empty string from native bridge
      })).catch(reject);
    });
  },
  bindPasskey: function (url) {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.bindPasskey(url).then(response => resolve({
        passkey: response.passkey,
        postBindingRedirectUri: response.postBindingRedirectUri || undefined // checking for empty string from native bridge
      })).catch(reject);
    });
  },
  deletePasskey: function (id) {
    return EmbeddedNativeModules.deletePasskey(id);
  },
  getPasskeys: function () {
    return EmbeddedNativeModules.getPasskeys();
  },
  initialize: function (biometricAskPrompt) {
    let allowedDomains = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return EmbeddedNativeModules.initialize(allowedDomains, biometricAskPrompt);
  },
  isAuthenticateUrl(url) {
    return EmbeddedNativeModules.isAuthenticateUrl(url);
  },
  isBindPasskeyUrl(url) {
    return EmbeddedNativeModules.isBindPasskeyUrl(url);
  },
  logEventEmitter: LoggerEventEmitter
};
export { Embedded };
//# sourceMappingURL=index.js.map