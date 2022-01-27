"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AuthorizationCode", {
  enumerable: true,
  get: function () {
    return _EmbeddedNativeModules.AuthorizationCode;
  }
});
Object.defineProperty(exports, "Credential", {
  enumerable: true,
  get: function () {
    return _EmbeddedNativeModules.Credential;
  }
});
exports.Embedded = void 0;
Object.defineProperty(exports, "ExtendCredentialsEvents", {
  enumerable: true,
  get: function () {
    return _EmbeddedNativeModules.ExtendCredentialsEvents;
  }
});
Object.defineProperty(exports, "PKCE", {
  enumerable: true,
  get: function () {
    return _EmbeddedNativeModules.PKCE;
  }
});
Object.defineProperty(exports, "Success", {
  enumerable: true,
  get: function () {
    return _EmbeddedNativeModules.Success;
  }
});
Object.defineProperty(exports, "TokenResponse", {
  enumerable: true,
  get: function () {
    return _EmbeddedNativeModules.TokenResponse;
  }
});

var _EmbeddedNativeModules = require("./EmbeddedNativeModules");

const Embedded = {
  authorize: function (pkceCodeChallenge, scope) {
    const challenge = pkceCodeChallenge.challenge == null ? '' : pkceCodeChallenge.challenge;
    const method = pkceCodeChallenge.method == null ? '' : pkceCodeChallenge.method;
    return _EmbeddedNativeModules.EmbeddedNativeModules.authorize(challenge, method, scope);
  },
  authenticate: function () {
    return _EmbeddedNativeModules.EmbeddedNativeModules.authenticate();
  },
  cancelExtendCredentials: function () {
    return _EmbeddedNativeModules.EmbeddedNativeModules.cancelExtendCredentials();
  },
  createPKCE: function () {
    return _EmbeddedNativeModules.EmbeddedNativeModules.createPKCE();
  },
  deleteCredential: function (handle) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.deleteCredential(handle);
  },
  extendCredentials: function (handles) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.extendCredentials(handles);
  },
  extendCredentialsEventEmitter: _EmbeddedNativeModules.ExtendCredentialsEventEmitter,
  getCredentials: function () {
    return _EmbeddedNativeModules.EmbeddedNativeModules.getCredentials();
  },
  initialize: function (biometricAskPrompt, clientID, redirectURI) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.initialize(biometricAskPrompt, clientID, redirectURI);
  },
  logEventEmitter: _EmbeddedNativeModules.LoggerEventEmitter,
  registerCredentialsWithToken: function (token) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.registerCredentialsWithToken(token);
  },
  registerCredentialsWithUrl: function (url) {
    return _EmbeddedNativeModules.EmbeddedNativeModules.registerCredentialsWithUrl(url);
  }
};
exports.Embedded = Embedded;
//# sourceMappingURL=index.js.map