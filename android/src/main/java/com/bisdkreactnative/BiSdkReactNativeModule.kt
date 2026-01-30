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
import com.beyondidentity.embedded.sdk.models.AuthenticateResponse
import com.beyondidentity.embedded.sdk.models.AuthenticationContext
import com.beyondidentity.embedded.sdk.models.Passkey
import com.beyondidentity.embedded.sdk.models.OtpChallengeResponse
import com.beyondidentity.embedded.sdk.models.RedeemOtpResponse
import com.beyondidentity.embedded.sdk.models.State
import com.beyondidentity.embedded.sdk.models.State.ACTIVE
import com.beyondidentity.embedded.sdk.models.State.REVOKED
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
    activity: Activity,
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

  override fun onNewIntent(intent: Intent) {
  }

  @Suppress("DEPRECATION")
  private val keyguardPrompt: ((Boolean, Exception) -> Unit) -> Unit = { answer ->
    (reactApplicationContext.getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager)
      ?.createConfirmDeviceCredentialIntent("Check", "Enter your pin or password")
      ?.let { intent ->
        reactApplicationContext.currentActivity?.startActivityForResult(intent, EMBEDDED_KEYGUARD_REQUEST)
      } ?: run {
      isLockSet = false
      answer(false, IllegalStateException("Can not authenticate with KeyGuard!"))
    }
  }

  @ReactMethod
  fun authenticate(
    url: String,
    passkeyId: String,
    promise: Promise
  ) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.authenticate(url, passkeyId) { authResult ->
      authResult.onSuccess { authResponse ->
        promise.resolve(makeAuthenticationResponseMap(authResponse))
      }
      authResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun authenticateOtp(
    url: String,
    email: String,
    promise: Promise
  ) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.authenticateOtp(url, email) { authResult ->
      authResult.onSuccess { otpChallengeResponse ->
        promise.resolve(makeOtpChallengeResponseMap(otpChallengeResponse))
      }
      authResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun bindPasskey(url: String, promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.bindPasskey(url) { bindResult ->
      bindResult.onSuccess { bindResponse ->
        val n = WritableNativeMap()
        n.putMap("passkey", makePasskeyMap(bindResponse.passkey))
        n.putString("postBindingRedirectUri", bindResponse.postBindingRedirectUri ?: "")
        promise.resolve(n)
      }
      bindResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun deletePasskey(id: String, promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.deletePasskey(id) { deleteResult ->
      deleteResult.onSuccess {
        promise.resolve(id)
      }
      deleteResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun getAuthenticationContext(url: String, promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.getAuthenticationContext(url) { authContextResult ->
      authContextResult.onSuccess { authContextResponse ->
        promise.resolve(makeAuthenticationContextResponseMap(authContextResponse))
      }
      authContextResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun getPasskeys(promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }
    EmbeddedSdk.getPasskeys { getResult ->
      getResult.onSuccess { passkeys ->
        val passkeysArray = WritableNativeArray()
        passkeys.map { makePasskeyMap(it) }.forEach { passkeysArray.pushMap(it) }
        promise.resolve(passkeysArray)
      }
      getResult.onFailure { t ->
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
  fun isBindPasskeyUrl(
    url: String,
    promise: Promise
  ) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }
    promise.resolve(EmbeddedSdk.isBindPasskeyUrl(url))
  }

  @ReactMethod
  fun redeemOtp(url: String, otp: String, promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.redeemOtp(url, otp) { redeemResult ->
      redeemResult.onSuccess { redeemOtpResponse ->
        when (redeemOtpResponse) {
          is RedeemOtpResponse.Success -> {
            val authResponse = redeemOtpResponse.authenticateResponse
            promise.resolve(makeAuthenticationResponseMap(authResponse))
          }
          is RedeemOtpResponse.FailedOtp -> {
            val otpChallengeResponse = redeemOtpResponse.otpChallengeResponse
            promise.resolve(makeOtpChallengeResponseMap(otpChallengeResponse))
          }
        }
      }
      redeemResult.onFailure { t -> promise.reject(t) }
    }
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

  private fun makeAuthenticationContextResponseMap(authContextResponse: AuthenticationContext): WritableNativeMap {
    val map = WritableNativeMap()
    map.putString("authUrl", authContextResponse.authUrl)

    val applicationMap = WritableNativeMap()
    applicationMap.putString("id", authContextResponse.application.id)
    applicationMap.putString("displayName", authContextResponse.application.displayName ?: "")
    map.putMap("application", applicationMap)

    val originMap = WritableNativeMap()
    originMap.putString("sourceIp", authContextResponse.origin.sourceIp ?: "")
    originMap.putString("userAgent", authContextResponse.origin.userAgent ?: "")
    originMap.putString("geolocation", authContextResponse.origin.geolocation ?: "")
    originMap.putString("referer", authContextResponse.origin.referer ?: "")
    map.putMap("origin", originMap)

    return map
  }

  private fun makeAuthenticationResponseMap(authResponse: AuthenticateResponse): WritableNativeMap {
    val map = WritableNativeMap()
    map.putString("redirectUrl", authResponse.redirectUrl ?: "")
    map.putString("message", authResponse.message ?: "")
    map.putString("passkeyBindingToken", authResponse.passkeyBindingToken ?: "")

    return map
  }

  private fun makeOtpChallengeResponseMap(otpChallengeResponse: OtpChallengeResponse): WritableNativeMap {
    val map = WritableNativeMap()
    map.putString("url", otpChallengeResponse.url)
    return map
  }

  private fun makePasskeyMap(passkey: Passkey): WritableNativeMap {
    val map = WritableNativeMap()
    map.putString("id", passkey.id)
    map.putString("passkeyId", passkey.passkeyId)
    map.putString("localCreated", passkey.localCreated.toString())
    map.putString("localUpdated", passkey.localUpdated.toString())
    map.putString("apiBaseUrl", passkey.apiBaseUrl.toString())
    map.putString("keyHandle", passkey.keyHandle)
    map.putString("state", passkeyStateToPascalCase(passkey.state))
    map.putString("created", passkey.created.toString())
    map.putString("updated", passkey.updated.toString())

    val realmMap = WritableNativeMap()
    realmMap.putString("id", passkey.realm.id)
    realmMap.putString("displayName", passkey.realm.displayName)
    map.putMap("realm", realmMap)

    val identityMap = WritableNativeMap()
    identityMap.putString("id", passkey.identity.id)
    identityMap.putString("displayName", passkey.identity.displayName)
    identityMap.putString("username", passkey.identity.username)
    identityMap.putString("primaryEmailAddress", passkey.identity.primaryEmailAddress)
    map.putMap("identity", identityMap)

    val tenantMap = WritableNativeMap()
    tenantMap.putString("id", passkey.tenant.id)
    tenantMap.putString("displayName", passkey.tenant.displayName)
    map.putMap("tenant", tenantMap)

    val themeMap = WritableNativeMap()
    themeMap.putString("logoLightUrl", passkey.theme.logoLightUrl.toString())
    themeMap.putString("logoDarkUrl", passkey.theme.logoDarkUrl.toString())
    themeMap.putString("supportUrl", passkey.theme.supportUrl.toString())
    map.putMap("theme", themeMap)

    return map
  }

  private fun passkeyStateToPascalCase(state: State) =
    when (state) {
      ACTIVE -> "Active"
      REVOKED -> "Revoked"
    }
}
