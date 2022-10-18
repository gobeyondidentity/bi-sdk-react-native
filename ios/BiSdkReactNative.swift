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
        credentialID: String,
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
            credentialID: CredentialID(credentialID)
        ){ result in
            switch result {
            case let .success(authResponse):
                let response: [String: Any] = [
                    "message": authResponse.message ?? "",
                    "redirectURL": authResponse.redirectURL.absoluteString
                ]
                resolve(response)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func bindCredential(
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
        
        Embedded.shared.bindCredential(url: url) { result in
            switch result {
            case let .success(bindResonse):
                let response: [String: Any] = [
                    "credential": makeCredentialDictionary(bindResonse.credential),
                    "postBindingRedirectUri": bindResonse.postBindingRedirectURI?.absoluteString ?? ""
                ]
                resolve(response)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func deleteCredential(
        _ id: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        Embedded.shared.deleteCredential(for: CredentialID(id)) { result in
            switch result {
            case .success:
                resolve(id)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func getCredentials(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        Embedded.shared.getCredentials() { result in
            switch result {
            case let .success(credentials):
                let credentialDicts = credentials.map(makeCredentialDictionary)
                resolve(credentialDicts)
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
    
    @objc func isBindCredentialUrl(
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
        
        resolve(Embedded.shared.isBindCredentialUrl(url))
    }
    
}

// MARK: HELPERS

private func makeCredentialDictionary(_ credential: Credential) -> [String: Any] {
    return [
        "id" : credential.id.value,
        "localCreated" : credential.localCreated.description,
        "localUpdated" : credential.localUpdated.description,
        "apiBaseUrl" : credential.apiBaseURL.absoluteString,
        "tenantId" : credential.tenantID.value,
        "realmId" : credential.realmID.value,
        "identityId" : credential.identityID.value,
        "keyHandle" : credential.keyHandle.value,
        "state" : credential.state.toPascalCase(),
        "created" : credential.created.description,
        "updated" : credential.updated.description,
        "realm": [
            "displayName": credential.realm.displayName
        ],
        "identity": [
            "displayName": credential.identity.displayName,
            "username": credential.identity.username,
            "primaryEmailAddress": credential.identity.primaryEmailAddress
        ],
        "tenant": [
            "displayName": credential.tenant.displayName
        ],
        "theme": [
            "logoLightUrl": credential.theme.logoLightURL.absoluteString,
            "logoDarkUrl": credential.theme.logoDarkURL.absoluteString,
            "supportUrl": credential.theme.supportURL.absoluteString,
        ]
    ]
}

extension CredentialState {
    func toPascalCase() -> String {
        switch self {
        case .active:
            return "Active"
        case .revoked:
            return "Revoked"
        }
    }
}
