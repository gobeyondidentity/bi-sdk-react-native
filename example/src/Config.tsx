// THIS FILE IS GENERATED. DO NOT EDIT.

export default {
    /// Prompt the user will see when exporting a credential from one device to another
    biometricAskPrompt: "Please verify it's really you before you can set up this credential on another device.",

    /// This would be your backend endpoint to bind a credential to device.
    bindEndpoint: "https://acme-cloud.byndid.com/credential-binding-link",

    /// This would be your backend endpoint to recover a credential by username already bound to device.
    recoverEndpoint: "https://acme-cloud.byndid.com/recover-credential-binding-link",
    
    /// SDK version
    sdkVersion: "1.0.0",
        
    /// Client ID for the confidential client flow
    confidentialClientID: "597c0a3c510b2afae53dc155d18933b5",

    /// Client ID for the public client flow
    publicClientID: "9a1d484d3f00ed26e972127e05e42c43",
    
    /// This is the endpoint your server would call to make the token exchange.
    tokenEndpoint: "https://auth.byndid.com/v2/token",

    /// WARNING: This is only to demo what your server should do. Never store a client secret in your app.
    confidentialClientSecret: "201866a137f9d3567f86dccdb3105764"
}