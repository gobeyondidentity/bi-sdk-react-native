package com.bisdkreactnative

import android.app.Activity
import android.app.Activity.RESULT_CANCELED
import android.app.Activity.RESULT_OK
import android.app.Application
import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.util.Log
import com.beyondidentity.embedded.sdk.EmbeddedSdk
import com.beyondidentity.embedded.sdk.models.Credential
import com.beyondidentity.embedded.sdk.models.CredentialState
import com.beyondidentity.embedded.sdk.models.CredentialState.ACTIVE
import com.beyondidentity.embedded.sdk.models.CredentialState.REVOKED
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter


private const val EMBEDDED_KEYGUARD_REQUEST = 2314
private const val INITIALIZE_ERROR = "Please call Embedded.initializeBiSdk first"
private const val SUCCESS = "success"

private object Events {
  const val LOG = "BeyondIdentityLogger"
}

class BiSdkReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ActivityEventListener {
  init {
    reactContext.addActivityEventListener(this)
  }

  private var isEmbeddedSdkInitialized = false
  private var isLockSet = true

  override fun getName(): String {
    return "BiSdkReactNative"
  }

  override fun onActivityResult(
    activity: Activity?,
    requestCode: Int,
    resultCode: Int,
    data: Intent?
  ) {
    if (requestCode == EMBEDDED_KEYGUARD_REQUEST) {
      when (resultCode) {
        RESULT_OK -> EmbeddedSdk.answer(true)
        RESULT_CANCELED -> EmbeddedSdk.answer(false)
      }
    }
  }

  override fun onNewIntent(intent: Intent?) {
  }

  @Suppress("DEPRECATION")
  private val keyguardPrompt: ((Boolean, Exception) -> Unit) -> Unit = { answer ->
    (reactApplicationContext.getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager)
      ?.createConfirmDeviceCredentialIntent("Check", "Enter your pin or password")
      ?.let { intent ->
        currentActivity?.startActivityForResult(intent, EMBEDDED_KEYGUARD_REQUEST)
      } ?: run {
      isLockSet = false
      answer(false, IllegalStateException("Can not authenticate with KeyGuard!"))
    }
  }

  @ReactMethod
  fun authenticate(
    url: String,
    credentialID: String,
    promise: Promise
  ) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.authenticate(url, credentialID) { authResult ->
      authResult.onSuccess { authResponse ->
        val n = WritableNativeMap()
        n.putString("redirectURL", authResponse.redirectUrl ?: "")
        n.putString("message", authResponse.message ?: "")
        promise.resolve(n)
      }
      authResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun bindCredential(url: String, promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.bindCredential(url) { bindResult ->
      bindResult.onSuccess { bindResponse ->
        val n = WritableNativeMap()
        n.putMap("credential", makeCredentialMap(bindResponse.credential))
        n.putString("postBindingRedirectUri", bindResponse.postBindingRedirectUri ?: "")
        promise.resolve(n)
      }
      bindResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun deleteCredential(id: String, promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.deleteCredential(id) { deleteCredResult ->
      deleteCredResult.onSuccess {
        promise.resolve(id)
      }
      deleteCredResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun getCredentials(promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }
    EmbeddedSdk.getCredentials { credResult ->
      credResult.onSuccess { credentials ->
        val credentialsArray = WritableNativeArray()
        credentials.map { makeCredentialMap(it) }.forEach { credentialsArray.pushMap(it) }
        promise.resolve(credentialsArray)
      }
      credResult.onFailure { t ->
        promise.reject(t)
      }
    }
  }

  @ReactMethod
  fun initialize(
    allowedDomains: ReadableArray,
    biometricAskPrompt: String,
    promise: Promise
  ) {
    if (isEmbeddedSdkInitialized) {
      return
    }

    EmbeddedSdk.init(
      reactApplicationContext.applicationContext as Application,
      keyguardPrompt,
      { message -> sendEvent(Events.LOG, message) },
      biometricAskPrompt,
      allowedDomains.toArrayList().toList() as List<String>
    )
    isEmbeddedSdkInitialized = true

    promise.resolve(SUCCESS)
  }

  @ReactMethod
  fun isAuthenticateUrl(
    url: String,
    promise: Promise
  ) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }
    promise.resolve(EmbeddedSdk.isAuthenticateUrl(url))
  }

  @ReactMethod
  fun isBindCredentialUrl(
    url: String,
    promise: Promise
  ) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }
    promise.resolve(EmbeddedSdk.isBindCredentialUrl(url))
  }

  @ReactMethod
  fun addListener(eventName: String?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  private fun sendEvent(
    eventName: String,
    params: String
  ) {
    try {
      reactApplicationContext
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    } catch (e: Exception) {
      Log.e("ReactNative", "Caught Exception: " + e.message)
    }
  }

  private fun sendEventMap(
    eventName: String,
    params: WritableNativeMap
  ) {
    try {
      reactApplicationContext
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    } catch (e: Exception) {
      Log.e("ReactNative", "Caught Exception: " + e.message)
    }
  }

  private fun makeCredentialMap(credential: Credential): WritableNativeMap {
    val map = WritableNativeMap()
    map.putString("id", credential.id)
    map.putString("localCreated", credential.localCreated.toString())
    map.putString("localUpdated", credential.localUpdated.toString())
    map.putString("apiBaseUrl", credential.apiBaseURL.toString())
    map.putString("tenantId", credential.tenantId)
    map.putString("realmId", credential.realmId)
    map.putString("identityId", credential.identityId)
    map.putString("keyHandle", credential.keyHandle)
    map.putString("state", credentialStateToPascalCase(credential.state))
    map.putString("created", credential.created.toString())
    map.putString("updated", credential.updated.toString())

    val realmMap = WritableNativeMap()
    realmMap.putString("displayName", credential.realm.displayName)
    map.putMap("realm", realmMap)

    val identityMap = WritableNativeMap()
    identityMap.putString("displayName", credential.identity.displayName)
    identityMap.putString("username", credential.identity.username)
    identityMap.putString("primaryEmailAddress", credential.identity.primaryEmailAddress)
    map.putMap("identity", identityMap)

    val tenantMap = WritableNativeMap()
    tenantMap.putString("displayName", credential.tenant.displayName)
    map.putMap("tenant", tenantMap)

    val themeMap = WritableNativeMap()
    themeMap.putString("logoLightUrl", credential.theme.logoUrlLight.toString())
    themeMap.putString("logoDarkUrl", credential.theme.logoUrlDark.toString())
    themeMap.putString("supportUrl", credential.theme.supportUrl.toString())
    map.putMap("theme", themeMap)

    return map
  }

  private fun credentialStateToPascalCase(state: CredentialState) =
    when (state) {
      ACTIVE -> "Active"
      REVOKED -> "Revoked"
    }
}
