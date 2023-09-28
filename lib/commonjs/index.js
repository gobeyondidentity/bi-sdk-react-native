"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Embedded: true
};
exports.Embedded = void 0;
var _EmbeddedNativeModules = require("./EmbeddedNativeModules");
var _EmbeddedTypes = require("./EmbeddedTypes");
Object.keys(_EmbeddedTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _EmbeddedTypes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _EmbeddedTypes[key];
    }
  });
});
const Embedded = {
  authenticate(url, passkeyId) {
    return new Promise(function (resolve, reject) {
      _EmbeddedNativeModules.EmbeddedNativeModules.authenticate(url, passkeyId).then(response => resolve(toAuthenticateResponse(response))).catch(reject);
    });
  },
  authenticateOtp(url, email) {
    return new Promise(function (resolve, reject) {
      _EmbeddedNativeModules.EmbeddedNativeModules.authenticateOtp(url, email).then(resolve).catch(reject);
    });
  },
  bindPasskey(url) {
    return new Promise(function (resolve, reject) {
      _EmbeddedNativeModules.EmbeddedNativeModules.bindPasskey(url).then(response => resolve(toBindPasskeyResponse(response))).catch(reject);
    });
  },
  deletePasskey(id) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.deletePasskey(id);
  },
  getAuthenticationContext(url) {
    return new Promise(function (resolve, reject) {
      _EmbeddedNativeModules.EmbeddedNativeModules.getAuthenticationContext(url).then(response => resolve(toAuthenticationContext(response))).catch(reject);
    });
  },
  getPasskeys() {
    return _EmbeddedNativeModules.EmbeddedNativeModules.getPasskeys();
  },
  initialize(biometricAskPrompt) {
    let allowedDomains = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return _EmbeddedNativeModules.EmbeddedNativeModules.initialize(allowedDomains, biometricAskPrompt);
  },
  isAuthenticateUrl(url) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.isAuthenticateUrl(url);
  },
  isBindPasskeyUrl(url) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.isBindPasskeyUrl(url);
  },
  logEventEmitter: _EmbeddedNativeModules.LoggerEventEmitter,
  redeemOtp(url, otp) {
    return new Promise(function (resolve, reject) {
      _EmbeddedNativeModules.EmbeddedNativeModules.redeemOtp(url, otp).then(response => {
        if ('redirectUrl' in response) {
          resolve(toAuthenticateResponse(response));
        }
        if ('url' in response) {
          resolve(response);
        }
      }).catch(reject);
    });
  }
};
exports.Embedded = Embedded;
function toAuthenticationContext(response) {
  return {
    authUrl: response.authUrl,
    application: {
      id: response.application.id,
      displayName: response.application.displayName || undefined // checking for empty string from native bridge
    },

    origin: {
      sourceIp: response.origin.sourceIp || undefined,
      // checking for empty string from native bridge
      userAgent: response.origin.userAgent || undefined,
      // checking for empty string from native bridge
      geolocation: response.origin.geolocation || undefined,
      // checking for empty string from native bridge
      referer: response.origin.referer || undefined // checking for empty string from native bridge
    }
  };
}

function toAuthenticateResponse(response) {
  return {
    redirectUrl: response.redirectUrl,
    message: response.message || undefined,
    // checking for empty string from native bridge
    passkeyBindingToken: response.passkeyBindingToken || undefined // checking for empty string from native bridge
  };
}

function toBindPasskeyResponse(response) {
  return {
    passkey: response.passkey,
    postBindingRedirectUri: response.postBindingRedirectUri || undefined // checking for empty string from native bridge
  };
}
//# sourceMappingURL=index.js.map