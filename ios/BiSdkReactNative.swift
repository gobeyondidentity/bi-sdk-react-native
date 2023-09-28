import BeyondIdentityEmbedded
import Foundation
import React

private let EMBEDDED_REJECT_ERROR = "Embedded Failure: "
private let INITIALIZATION_ERROR = "Please call Embedded.initialize first"
private let SUCCESS = "success"
private let INVALID_URL = "doesn’t represent a valid URL."

enum Events: String, CaseIterable {
    case log = "BeyondIdentityLogger"
}

@objc(BiSdkReactNative)
class BiSdkReactNative: RCTEventEmitter {
    
    private var hasListeners = false
    private var isEmbeddedSdkInitialized = false
    
    override func startObserving() {
        hasListeners = true
    }
    
    override func stopObserving() {
        hasListeners = false
    }
    
    override func supportedEvents() -> [String]! {
        Events.allCases.map { $0.rawValue }
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc func authenticate(
        _ url: String,
        passkeyId: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ){
        guard checkInitialization(reject) else { return }
        
        guard let url = parseURL(url, reject) else { return }
        
        Embedded.shared.authenticate(
            url: url,
            id: Passkey.Id(passkeyId)
        ){ result in
            switch result {
            case let .success(authResponse):
                resolve(makeAuthenticateResponseDictionary(authResponse))
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func authenticateOtp(
        _ url: String,
        email: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ){
        guard checkInitialization(reject) else { return }
        
        guard let url = parseURL(url, reject) else { return }
        
        Embedded.shared.authenticateOtp(
            url: url,
            email: email
        ){ result in
            switch result {
            case let .success(otpChallengeResponse):
                resolve(makeOtpChallengeResponseDictionary(otpChallengeResponse))
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func bindPasskey(
        _ url: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ){
        guard checkInitialization(reject) else { return }
        
        guard let url = parseURL(url, reject) else { return }
        
        Embedded.shared.bindPasskey(url: url) { result in
            switch result {
            case let .success(bindResponse):
                let response: [String: Any] = [
                    "passkey": makePasskeyDictionary(bindResponse.passkey),
                    "postBindingRedirectUri": bindResponse.postBindingRedirectUri?.absoluteString ?? ""
                ]
                resolve(response)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func deletePasskey(
        _ id: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard checkInitialization(reject) else { return }
        
        Embedded.shared.deletePasskey(for: Passkey.Id(id)) { result in
            switch result {
            case .success:
                resolve(id)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func getAuthenticationContext(
        _ url: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard checkInitialization(reject) else { return }
        
        guard let url = parseURL(url, reject) else { return }
        
        Embedded.shared.getAuthenticationContext(url: url){ result in
            switch result {
            case let .success(authContext):
                let response: [String: Any] = [
                    "authUrl": authContext.authUrl.absoluteString,
                    "application": [
                        "id": authContext.application.id.value,
                        "displayName": authContext.application.displayName ?? "",
                    ],
                    "origin": [
                        "sourceIp": authContext.origin.sourceIp ?? "",
                        "userAgent": authContext.origin.userAgent ?? "",
                        "geolocation": authContext.origin.geolocation ?? "",
                        "referer": authContext.origin.referer ?? ""
                    ]
                ]
                resolve(response)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func getPasskeys(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard checkInitialization(reject) else { return }
        
        Embedded.shared.getPasskeys() { result in
            switch result {
            case let .success(passkeys):
                let passkeyDicts = passkeys.map(makePasskeyDictionary)
                resolve(passkeyDicts)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func initialize(
        _ allowedDomains: [String],
        biometricAskPrompt: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ){
        Embedded.initialize(
            allowedDomains: allowedDomains,
            biometricAskPrompt: biometricAskPrompt,
            logger: { [weak self] (_, message) in
                guard let self = self else { return }
                if (!self.hasListeners) { return }
                self.sendEvent(withName: Events.log.rawValue, body: message)
            },
            callback: { result in
                switch result {
                case .success():
                    resolve(SUCCESS)
                case let .failure(error):
                    reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
                }
            }
        )
        
        isEmbeddedSdkInitialized = true
    }
    
    @objc func isAuthenticateUrl(
        _ url: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ){
        guard checkInitialization(reject) else { return }
        
        guard let url = parseURL(url, reject) else { return }
        
        resolve(Embedded.shared.isAuthenticateUrl(url))
    }
    
    @objc func isBindPasskeyUrl(
        _ url: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ){
        guard checkInitialization(reject) else { return }
        
        guard let url = parseURL(url, reject) else { return }
        
        resolve(Embedded.shared.isBindPasskeyUrl(url))
    }
    
    @objc func redeemOtp(
        _ url: String,
        otp: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ){
        guard checkInitialization(reject) else { return }
        
        guard let url = parseURL(url, reject) else { return }
        
        Embedded.shared.redeemOtp(
            url: url,
            otp: otp
        ){ result in
            switch result {
            case let .success(response):
                switch response {
                case let .success(authResponse):
                    resolve(makeAuthenticateResponseDictionary(authResponse))
                case let .failedOtp(otpChallengeResponse):
                    resolve(makeOtpChallengeResponseDictionary(otpChallengeResponse))
                }
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    private func checkInitialization(_ reject: RCTPromiseRejectBlock) -> Bool {
        guard isEmbeddedSdkInitialized else {
            reject(EMBEDDED_REJECT_ERROR, INITIALIZATION_ERROR, nil)
            return false
        }
        return true
    }
    
    private func parseURL(_ url: String, _ reject: RCTPromiseRejectBlock) -> URL? {
        guard let parsedURL = URL(string: url) else {
            reject(EMBEDDED_REJECT_ERROR, "\(url) \(INVALID_URL)", nil)
            return nil
        }
        return parsedURL
    }
}

// MARK: HELPERS

private func makeAuthenticateResponseDictionary(_ authResponse: AuthenticateResponse) -> [String: Any] {
    return [
        "message": authResponse.message ?? "",
        "redirectUrl": authResponse.redirectUrl.absoluteString,
        "passkeyBindingToken": authResponse.passkeyBindingToken ?? "",
    ]
}

private func makeOtpChallengeResponseDictionary(_ otpChallengeResponse: OtpChallengeResponse) -> [String: Any]{
    return [
        "url": otpChallengeResponse.url.absoluteString,
    ]
}

private func makePasskeyDictionary(_ passkey: Passkey) -> [String: Any] {
    return [
        "id" : passkey.id.value,
        "localCreated" : passkey.localCreated.description,
        "localUpdated" : passkey.localUpdated.description,
        "apiBaseUrl" : passkey.apiBaseUrl.absoluteString,
        "keyHandle" : passkey.keyHandle.value,
        "state" : passkey.state.toPascalCase(),
        "created" : passkey.created.description,
        "updated" : passkey.updated.description,
        "realm": [
            "id": passkey.realm.id.value,
            "displayName": passkey.realm.displayName
        ],
        "identity": [
            "id": passkey.identity.id.value,
            "displayName": passkey.identity.displayName,
            "username": passkey.identity.username,
            "primaryEmailAddress": passkey.identity.primaryEmailAddress ?? ""
        ],
        "tenant": [
            "id": passkey.tenant.id.value,
            "displayName": passkey.tenant.displayName
        ],
        "theme": [
            "logoLightUrl": passkey.theme.logoLightUrl.absoluteString,
            "logoDarkUrl": passkey.theme.logoDarkUrl.absoluteString,
            "supportUrl": passkey.theme.supportUrl.absoluteString,
        ]
    ]
}

extension Passkey.State {
    func toPascalCase() -> String {
        switch self {
        case .active:
            return "Active"
        case .revoked:
            return "Revoked"
        }
    }
}

