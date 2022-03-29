import BeyondIdentityEmbedded
import Foundation
import React

private let EMBEDDED_REJECT_ERROR = "Embedded Failure: "
private let INITALIZATION_ERROR = "Please call Embedded.initialize first"

enum Events: String, CaseIterable {
    case aborted = "ExtendCredentialAborted"
    case tokenRecieved = "ExtendTokenReceived"
    case completed = "ExtendCredentialCompleted"
    case error = "ExtendError"
    case log = "Logger"
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
    
    @objc func authorize(
        _ challenge: String,
        pkceCodeChallengeMethod method: String,
        scope: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ){
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        Embedded.shared.authorize(
            pkceChallenge: maybeCreatePKCECodeChallenge(
                challenge,
                method
            ),
            scope: scope
        ) { result in
            switch result {
            case let .success(authorizationCode):
                resolve(["authorizationCode": authorizationCode.value])
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func authenticate(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ){
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        Embedded.shared.authenticate { result in
            switch result {
            case let .success(tokenResponse):
                let response: [String: Any] = [
                    "accessToken": tokenResponse.accessToken.value,
                    "idToken": tokenResponse.idToken,
                    "tokenType": tokenResponse.accessToken.type,
                    "expiresIn": tokenResponse.accessToken.expiresIn
                ]
                resolve(response)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func cancelExtendCredentials(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        Embedded.shared.cancelExtendCredentials() { result in
            switch result {
            case .success():
                resolve("success")
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func createPKCE(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        Embedded.shared.createPKCE { result in
            switch result {
            case let .success(pkce):
                let pkceDict = [
                    "codeVerifier": pkce.codeVerifier,
                    "codeChallenge": pkce.codeChallenge.challenge,
                    "codeChallengeMethod": pkce.codeChallenge.method
                ]
                resolve(pkceDict)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func deleteCredential(
        _ handle: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        Embedded.shared.deleteCredential(for: Credential.Handle.init(handle)) { result in
            switch result {
            case let .success(handle):
                resolve(handle.value)
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func extendCredentials(
        _ handles: [String]
    ) {
        guard isEmbeddedSdkInitialized else {
            return sendEvent(withName: Events.error.rawValue, body: INITALIZATION_ERROR)
        }
        
        Embedded.shared.extendCredentials(handles: handles.map(Credential.Handle.init)) { [weak self] result in
            guard self?.hasListeners == true else { return }
            
            switch result {
            case let .success(extendCredentialsStatus):
                switch extendCredentialsStatus {
                case .aborted:
                    self?.sendEvent(withName: Events.aborted.rawValue, body: "aborted")
                case let .started(token, _), let .tokenUpdated(token, _):
                    self?.sendEvent(withName: Events.tokenRecieved.rawValue, body: token.value)
                case .done:
                    self?.sendEvent(withName: Events.completed.rawValue, body: "completed")
                }
                
            case let .failure(error):
                self?.sendEvent(withName: Events.error.rawValue, body: error.localizedDescription)
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
        _ biometricAskPrompt: String,
        clientID: String,
        redirectURI: String
    ){
        Embedded.initialize(
            biometricAskPrompt: biometricAskPrompt,
            clientID: clientID,
            redirectURI: redirectURI,
            logger: { [weak self] (_, message) in
                self?.sendEvent(withName: Events.log.rawValue, body: message)
            })
        
        isEmbeddedSdkInitialized = true
    }
    
    @objc func registerCredentialsWithToken(
        _ token: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard isEmbeddedSdkInitialized else {
            return reject(EMBEDDED_REJECT_ERROR, INITALIZATION_ERROR, nil)
        }
        
        Embedded.shared.registerCredentials(token: CredentialToken.init(value: token)) { result in
            switch result {
            case let .success(credentials):
                resolve(credentials.map(makeCredentialDictionary))
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
    @objc func registerCredentialsWithUrl(
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
        
        Embedded.shared.registerCredentials(url) { result in
            switch result {
            case let .success(credential):
                resolve(makeCredentialDictionary(credential))
            case let .failure(error):
                reject(EMBEDDED_REJECT_ERROR, error.localizedDescription, error)
            }
        }
    }
    
}

// MARK: HELPERS

private func makeCredentialDictionary(_ credential: Credential) -> [String: Any] {
    return [
        "created": credential.created ?? "",
        "handle": credential.handle?.value ?? "",
        "keyHandle": credential.keyHandle ?? "",
        "name": credential.name,
        "logoURL": credential.logoURL,
        "loginURI": credential.loginURI ?? "",
        "enrollURI": credential.enrollURI ?? "",
        "chain": credential.chain,
        "rootFingerprint": credential.rootFingerprint ?? "",
        "state": credential.state.toPascalCase()
    ]
}

private func maybeCreatePKCECodeChallenge(
    _ challenge: String,
    _ method: String
) -> PKCE.CodeChallenge? {
    guard !challenge.isEmpty && !method.isEmpty else {
        return nil
    }
    
    return PKCE.CodeChallenge.init(challenge: challenge, method: method)
}

extension CredentialState {
    func toPascalCase() -> String {
        switch self {
        case .active:
            return "Active"
        case .userSuspended:
            return "UserSuspended"
        case .userDeleted:
            return "UserDeleted"
        case .deviceDeleted:
            return "DeviceDeleted"
        case .invalid:
            return "Invalid"
        }
    }
}
