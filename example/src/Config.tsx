// THIS FILE IS GENERATED. DO NOT EDIT.

export default {
    /// Prompt the user will see when exporting a credential from one device to another
    biometricAskPrompt: "Please verify it's really you before you can set up this credential on another device.",

    /// SDK version
    sdkVersion: "0.1.0",
        
    /// Client ID for the confidential client flow
    confidentialClientID: "597c0a3c510b2afae53dc155d18933b5",

    /// Client ID for the public client flow
    publicClientID: "9a1d484d3f00ed26e972127e05e42c43",

    /// This would ideally be a Universal Link
    redirectURI: "acme://",

    /// This would be your backend endpoint to recover an exisiting user.
    recoverUserEndpoint: "https://acme-cloud.byndid.com/recover-user",

    /// This would be your backend endpoint to register a new user.
    registrationEndpoint: "https://acme-cloud.byndid.com/users", 
    
    /// This is the endpoint your server would call to make the token exchange.
    tokenEndpoint: "https://auth.byndid.com/v2/token",

    /// WARNING: This is only to demo what your server should do. Never store a client secret in your app.
    confidentialClientSecret: "201866a137f9d3567f86dccdb3105764"
}