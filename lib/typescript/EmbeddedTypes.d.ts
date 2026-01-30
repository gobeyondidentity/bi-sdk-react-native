/**
 * Information associated with the current authentication request.
 *
 * Note that the `authUrl` field may differ from the URL passed into
 * `getAuthenticationContext`. In this event, the new `authUrl` must be
 * passed into `authenticate` or `authenticateOtp`, rather than the
 * original URL.
 */
interface AuthenticationContext {
    /**
     * A URL containing the state of the current authentication transaction.
     */
    authUrl: string;
    /**
     * The authenticating application information
     */
    application: {
        id: string;
        displayName?: string;
    };
    /**
     * The authenticating request origin information
     */
    origin: {
        sourceIp?: string;
        userAgent?: string;
        geolocation?: string;
        referer?: string;
    };
}
/**
 * A response returned after successfully authenticating.
 */
interface AuthenticateResponse {
    /**
     * The redirect URL that originates from the /authorize call's `redirect_uri` parameter.
     * The OAuth2 authorization `code` and the `state` parameter of the /authorize call are attached with the "code" and "state" parameters to this URL.
     */
    redirectUrl: string;
    /**
     * An optional displayable message defined by policy returned by the cloud on success.
     */
    message?: string;
    /**
     * An optional one-time-token returned from successful `redeemOtp` that may be redeemed for a credential_binding_link from the /credential-binding-jobs endpoint.
     */
    passkeyBindingToken?: string;
}
/**
 * A response returned after successfully binding a passkey to a device.
 */
interface BindPasskeyResponse {
    /**
     * The passkey bound to the device.
     */
    passkey: Passkey;
    /**
     * A URI that can be redirected to once a passkey is bound. This could be a URI that automatically logs the user in with the newly bound passkey, or a success page indicating that a passkey has been bound.
     */
    postBindingRedirectUri?: string;
}
/**
 * A response returned if the SDK requires an OTP.
 */
interface OtpChallengeResponse {
    /**
     * A URL containing the state of the current authentication transaction.
     * This should be used in the next `redeemOtp` or `authenticateOtp` function.
     */
    url: string;
}
/**
 * A Universal Passkey is a public and private key pair. The private key is generated, stored, and never leaves the user’s devices’ hardware root of trust (i.e. Secure Enclave).
 * The public key is sent to the Beyond Identity cloud. The private key cannot be tampered with, viewed, or removed from the device in which it is created unless the user explicitly indicates that the trusted device be removed.
 * Passkeys are cryptographically linked to devices and an Identity. A single device can store multiple passkeys for different users and a single Identity can have multiple passkeys.
 */
interface Passkey {
    /**
     * The globally unique identifier of the passkey.
     */
    id: string;
    passkeyId: string;
    /**
     * The time this passkey was created.
     */
    created: string;
    /**
     * The last time this passkey was updated.
     */
    updated: string;
    /**
     * The time when this passkey was created locally.
     * This could be different from "created" which is the time when this passkey was created on the server.
     */
    localCreated: string;
    /**
     * The last time when this passkey was updated locally.
     * This could be different from "updated" which is the last time when this passkey was updated on the server.
     */
    localUpdated: string;
    /**
     * The base URL for all binding & auth requests
     */
    apiBaseUrl: string;
    /**
     * Associated key handle.
     */
    keyHandle: string;
    /**
     * Current state of the passkey.
     */
    state: 'Active' | 'Revoked';
    /**
     * Realm information associated with this passkey.
     */
    realm: PasskeyRealm;
    /**
     * Identity information associated with this passkey.
     */
    identity: PasskeyIdentity;
    /**
     * Tenant information associated with this passkey.
     */
    tenant: PasskeyTenant;
    /**
     * Theme information associated with this passkey.
     */
    theme: PasskeyTheme;
}
/**
 * Realm information associated with a `Passkey`.
 * A Realm is a unique administrative domain within a `Tenant`.
 * Some Tenants will only need the use of a single Realm, in this case a Realm and a Tenant may seem synonymous.
 * Each Realm contains a unique set of Directory, Policy, Event, Application, and Branding objects.
 */
interface PasskeyRealm {
    /**
     * The unique identifier of the realm.
     */
    id: string;
    /**
     * The display name of the realm.
     */
    displayName: string;
}
/**
 * Identity information associated with a `Passkey`.
 * An Identity is a unique identifier that may be used by an end-user to gain access governed by Beyond Identity.
 * An Identity is created at the Realm level.
 * An end-user may have multiple identities. A Realm can have many Identities.
 */
interface PasskeyIdentity {
    /**
     * The unique identifier of the identity..
     */
    id: string;
    /**
     * The username of the identity.
     */
    username: string;
    /**
     * The display name of the identity.
     */
    displayName?: string;
    /**
     * The primary email address of the identity.
     */
    emailAddress?: string;
    /**
     * The external Id address of the identity.
     */
    externalId?: string;
}
/**
 * Tenant information associated with a `Passkey`.
 * A Tenant represents an organization in the Beyond Identity Cloud and serves as a root container for all other cloud components in your configuration.
 */
interface PasskeyTenant {
    /**
     * The unique identifier of the tenant.
     */
    id: string;
    /**
     * The display name of the tenant.
     */
    displayName: string;
}
/**
 * Theme associated with a `Passkey`.
 */
interface PasskeyTheme {
    /**
     * URL resolving the logo in light mode.
     */
    logoLightUrl: string;
    /**
     * URL resolving the logo in dark mode.
     */
    logoDarkUrl: string;
    /**
     * URL for customer support.
     */
    supportUrl: string;
}
type Success = 'success';
export { AuthenticationContext, AuthenticateResponse, BindPasskeyResponse, OtpChallengeResponse, Passkey, PasskeyRealm, PasskeyIdentity, PasskeyTenant, PasskeyTheme, Success, };
