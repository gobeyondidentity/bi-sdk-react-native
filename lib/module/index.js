import { EmbeddedNativeModules, LoggerEventEmitter } from './EmbeddedNativeModules';
const Embedded = {
  authenticate(url, passkeyId) {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.authenticate(url, passkeyId).then(response => resolve(toAuthenticateResponse(response))).catch(reject);
    });
  },
  authenticateOtp(url, email) {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.authenticateOtp(url, email).then(resolve).catch(reject);
    });
  },
  bindPasskey(url) {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.bindPasskey(url).then(response => resolve(toBindPasskeyResponse(response))).catch(reject);
    });
  },
  deletePasskey(id) {
    return EmbeddedNativeModules.deletePasskey(id);
  },
  getAuthenticationContext(url) {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.getAuthenticationContext(url).then(response => resolve(toAuthenticationContext(response))).catch(reject);
    });
  },
  getPasskeys() {
    return EmbeddedNativeModules.getPasskeys();
  },
  initialize(biometricAskPrompt) {
    let allowedDomains = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return EmbeddedNativeModules.initialize(allowedDomains, biometricAskPrompt);
  },
  isAuthenticateUrl(url) {
    return EmbeddedNativeModules.isAuthenticateUrl(url);
  },
  isBindPasskeyUrl(url) {
    return EmbeddedNativeModules.isBindPasskeyUrl(url);
  },
  logEventEmitter: LoggerEventEmitter,
  redeemOtp(url, otp) {
    return new Promise(function (resolve, reject) {
      EmbeddedNativeModules.redeemOtp(url, otp).then(response => {
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

export { Embedded };
export * from './EmbeddedTypes';
//# sourceMappingURL=index.js.map