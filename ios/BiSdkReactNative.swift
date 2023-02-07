import BeyondIdentityEmbedded
import Foundation
import React

private let EMBEDDED_REJECT_ERROR = "Embedded Failure: "
private let INITALIZATION_ERROR = "Please call Embedded.initialize first"
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
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        guard let url = URL(string: url) else {
            return reject(EMBEDDED_REJECT_ERROR, "\(url) doesn’t represent a valid URL.", nil)
        }
        
        Embedded.shared.authenticate(
            url: url,
            id: Passkey.Id(passkeyId)
        ){ result in
            switch result {
            case let .success(authResponse):
                let response: [String: Any] = [
                    "message": authResponse.message ?? "",
                    "redirectUrl": authResponse.redirectUrl.absoluteString
                ]
                resolve(response)
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
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        guard let url = URL(string: url) else {
            reject(EMBEDDED_REJECT_ERROR, "\(url) doesn’t represent a valid URL.", nil)
            return
        }
        
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
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        Embedded.shared.deletePasskey(for: Passkey.Id(id)) { result in
            switch result {
            case .success:
                resolve(id)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func getPasskeys(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
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
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        guard let url = URL(string: url) else {
            reject(EMBEDDED_REJECT_ERROR, "\(url) \(INVALID_URL)", nil)
            return
        }
        
        resolve(Embedded.shared.isAuthenticateUrl(url))
    }
    
    @objc func isBindPasskeyUrl(
        _ url: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ){
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        guard let url = URL(string: url) else {
            reject(EMBEDDED_REJECT_ERROR, "\(url) \(INVALID_URL)", nil)
            return
        }
        
        resolve(Embedded.shared.isBindPasskeyUrl(url))
    }
    
}

// MARK: HELPERS

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
