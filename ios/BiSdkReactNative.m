#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BiSdkReactNative, NSObject)

RCT_EXTERN_METHOD(authenticate: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(authorize: (NSString)challenge
                  pkceCodeChallengeMethod:(NSString)method
                  scope:(NSString)scope
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(cancelExtendCredentials: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createPKCE: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deleteCredential: (NSString)handle
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(extendCredentials: (NSArray)handles)

RCT_EXTERN_METHOD(getCredentials: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(initialize: (NSString)biometricAskPrompt
                  clientID: (NSString)clientID
                  redirectURI: (NSString)redirectURI)

RCT_EXTERN_METHOD(registerCredentialsWithToken: (NSString)token
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerCredentialsWithUrl: (NSString)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
