/**
 * A response returned after successfully authenticating.
 */
interface AuthenticateResponse {
  /**
   * The redirect URL that originates from the /authorize call's `redirect_uri` parameter.
   * The OAuth2 authorization `code` and the `state` parameter of the /authorize call are attached with the "code" and "state" parameters to this URL.
   */
  redirectURL: string;
  /**
   * An optional displayable message defined by policy returned by the cloud on success.
   */
  message?: string;
}

/**
 * A response returned after successfully binding a credential to a device.
 */
interface BindCredentialResponse {
  /**
   * The credential bound to the device.
   */
  credential: Credential;
  /**
   * A Uri that can be redirected to once a credential is bound. This could be a uri that automatically logs the user in with the newly bound credential, or a success page indicating that a credential has been bound.
   */
  postBindingRedirectURI?: string;
}

/**
 * A user credential. Think of this as a wrapper around an X.509 Certificate.
 */
interface Credential {
  /**
   * The globally unique identifier of the credential.
   */
  id: string;
  /**
   * The time this credential was created.
   */
  created: string;
  /**
   * The last time this credential was updated.
   */
  updated: string;
  /**
   * The time when this credential was created locally.
   * This could be different from "created" which is the time when this credential was created on the server.
   */
  localCreated: string;
  /**
   * The last time when this credential was updated locally.
   * This could be different from "updated" which is the last time when this credential was updated on the server.
   */
  localUpdated: string;
  /**
   * The base url for all binding & auth requests
   */
  apiBaseUrl: string;
  /**
   * The Identity's Tenant.
   */
  tenantId: string;
  /**
   * The Identity's Realm.
   */
  realmId: string;
  /**
   * The Identity that owns this credential.
   */
  identityId: string;
  /**
   * Associated key handle.
   */
  keyHandle: string;
  /**
   * Current state of the credential.
   */
  state: CredentialState;
  /**
   * Realm information associated with this credential.
   */
  realm: Realm;
  /**
   * Identity information associated with this credential.
   */
  identity: Identity;
  /**
   * Tenant information associated with this credential.
   */
  tenant: Tenant;
  /**
   * Theme information associated with this credential.
   */
  theme: Theme;
}

/**
 * Realm information associated with a credential.
 */
interface Realm {
  /**
   * The display name of the realm.
   */
  displayName: string;
}

/**
 * Identity information associated with a credential.
 */
interface Identity {
  /**
   * The display name of the identity.
   */
  displayName: string;
  /**
   * The username of the identity.
   */
  username: string;
  /**
   * The primary email address of the identity.
   */
  primaryEmailAddress?: string;
}

/**
 * Tenant associated with a credential.
 */
interface Tenant {
  /**
   * The display name of the tenant.
   */
  displayName: string;
}

/**
 * Theme associated with a credential.
 */
interface Theme {
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

/**
 * The state of the Credential: either active or revoked
 */
type CredentialState = 'Active' | 'Revoked';

type Success = 'success';

export {
  AuthenticateResponse,
  BindCredentialResponse,
  Credential,
  CredentialState,
  Realm,
  Identity,
  Tenant,
  Theme,
  Success,
};
