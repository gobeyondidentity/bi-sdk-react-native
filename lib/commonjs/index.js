"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Embedded = void 0;
var _EmbeddedNativeModules = require("./EmbeddedNativeModules");
const Embedded = {
  authenticate(url, passkeyId) {
    return new Promise(function (resolve, reject) {
      _EmbeddedNativeModules.EmbeddedNativeModules.authenticate(url, passkeyId).then(response => resolve({
        redirectUrl: response.redirectUrl,
        message: response.message || undefined // checking for empty string from native bridge
      })).catch(reject);
    });
  },
  bindPasskey: function (url) {
    return new Promise(function (resolve, reject) {
      _EmbeddedNativeModules.EmbeddedNativeModules.bindPasskey(url).then(response => resolve({
        passkey: response.passkey,
        postBindingRedirectUri: response.postBindingRedirectUri || undefined // checking for empty string from native bridge
      })).catch(reject);
    });
  },
  deletePasskey: function (id) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.deletePasskey(id);
  },
  getPasskeys: function () {
    return _EmbeddedNativeModules.EmbeddedNativeModules.getPasskeys();
  },
  initialize: function (biometricAskPrompt) {
    let allowedDomains = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return _EmbeddedNativeModules.EmbeddedNativeModules.initialize(allowedDomains, biometricAskPrompt);
  },
  isAuthenticateUrl(url) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.isAuthenticateUrl(url);
  },
  isBindPasskeyUrl(url) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.isBindPasskeyUrl(url);
  },
  logEventEmitter: _EmbeddedNativeModules.LoggerEventEmitter
};
exports.Embedded = Embedded;
//# sourceMappingURL=index.js.map