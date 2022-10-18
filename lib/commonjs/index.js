"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Embedded = void 0;

var _EmbeddedNativeModules = require("./EmbeddedNativeModules");

const Embedded = {
  authenticate(url, credentialID) {
    return new Promise(function (resolve, reject) {
      _EmbeddedNativeModules.EmbeddedNativeModules.authenticate(url, credentialID).then(response => resolve({
        redirectURL: response.redirectURL,
        message: response.message || undefined // checking for empty string from native bridge

      })).catch(reject);
    });
  },

  bindCredential: function (url) {
    return new Promise(function (resolve, reject) {
      _EmbeddedNativeModules.EmbeddedNativeModules.bindCredential(url).then(response => resolve({
        credential: response.credential,
        postBindingRedirectURI: response.postBindingRedirectURI || undefined // checking for empty string from native bridge

      })).catch(reject);
    });
  },
  deleteCredential: function (id) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.deleteCredential(id);
  },
  getCredentials: function () {
    return _EmbeddedNativeModules.EmbeddedNativeModules.getCredentials();
  },
  initialize: function (biometricAskPrompt, allowedDomains = []) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.initialize(allowedDomains, biometricAskPrompt);
  },

  isAuthenticateUrl(url) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.isAuthenticateUrl(url);
  },

  isBindCredentialUrl(url) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.isBindCredentialUrl(url);
  },

  logEventEmitter: _EmbeddedNativeModules.LoggerEventEmitter
};
exports.Embedded = Embedded;
//# sourceMappingURL=index.js.map