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
import com.beyondidentity.embedded.sdk.extend.ExtendCredentialListener
import com.beyondidentity.embedded.sdk.models.CredentialState
import com.beyondidentity.embedded.sdk.models.CredentialState.ACTIVE
import com.beyondidentity.embedded.sdk.models.CredentialState.DEVICE_DELETED
import com.beyondidentity.embedded.sdk.models.CredentialState.INVALID
import com.beyondidentity.embedded.sdk.models.CredentialState.UNKNOWN
import com.beyondidentity.embedded.sdk.models.CredentialState.USER_DELETED
import com.beyondidentity.embedded.sdk.models.CredentialState.USER_SUSPENDED
import com.beyondidentity.embedded.sdk.models.ExtendResponse
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import java.lang.Exception

private const val EMBEDDED_KEYGUARD_REQUEST = 2314
private const val INITIALIZE_ERROR = "Please call Embedded.initializeBiSdk first"

private object Events {
  const val ABORTED = "ExtendCredentialAborted"
  const val TOKEN_RECEIVED = "ExtendTokenReceived"
  const val COMPLETED = "ExtendCredentialCompleted"
  const val ERROR = "ExtendError"
  const val LOG = "Logger"
}

class BiSdkReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), ActivityEventListener {
  init {
    reactContext.addActivityEventListener(this)
  }

  private var isEmbeddedSdkInitialized = false
  private var isLockSet = true

  private var clientID = ""
  private var redirectURI = ""

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
  fun authorize(
    pkceCodeChallenge: String,
    pkceCodeChallengeMethod: String,
    scope: String,
    promise: Promise
  ) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    val codeChallenge = if (pkceCodeChallenge.isNotEmpty()) pkceCodeChallenge else null

    EmbeddedSdk.authorize(
      clientId = this.clientID,
      redirectUri = this.redirectURI,
      pkceS256CodeChallenge = codeChallenge,
      scope = scope,
    ) { credResult ->
      credResult.onSuccess { code ->
        val n = WritableNativeMap()
        n.putString("authorizationCode", code)
        promise.resolve(n)
      }
      credResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun authenticate(
    promise: Promise
  ) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }
    EmbeddedSdk.authenticate(
      clientId = this.clientID,
      redirectUri = this.redirectURI,
    ) { credResult ->
      credResult.onSuccess { tokenResponse ->
        val n = WritableNativeMap()
        n.putString("accessToken", tokenResponse.accessToken)
        n.putString("idToken", tokenResponse.idToken)
        n.putString("tokenType", tokenResponse.tokenType)
        n.putDouble("expiresIn", tokenResponse.expiresIn.toDouble())
        promise.resolve(n)
      }
      credResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun cancelExtendCredentials(promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }
    EmbeddedSdk.cancelExtendCredentials { result ->
      result.onSuccess { promise.resolve("success") }
      result.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun createPKCE(promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.createPkce { resultPkce ->
      resultPkce.onSuccess { pkce ->
        val n = WritableNativeMap()
        n.putString("codeVerifier", pkce.codeVerifier)
        n.putString("codeChallenge", pkce.codeChallenge)
        n.putString("codeChallengeMethod", pkce.codeChallengeMethod)
        promise.resolve(n)
      }
      resultPkce.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun deleteCredential(handle: String, promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.deleteCredential(handle) { deleteCredResult ->
      deleteCredResult.onSuccess {
        promise.resolve(handle)
      }
      deleteCredResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun extendCredentials(handles: ReadableArray) {
    if (!isEmbeddedSdkInitialized) {
      sendEvent(Events.ERROR, INITIALIZE_ERROR)
      return
    }

    val handleList: List<String> = handles
      .toArrayList()
      .toList()
      .filterIsInstance<String>()
      .apply {
        if (size != handles.size()) {
          sendEvent(Events.ERROR, "handles must be an array of strings")
          return
        }
      }

    EmbeddedSdk.extendCredentials(
      handleList,
      object : ExtendCredentialListener {

        override fun onUpdate(token: ExtendResponse?) {
          token?.let { t ->
            sendEvent(Events.TOKEN_RECEIVED, t.rendezvousToken)
          }
        }

        override fun onFinish() {
          sendEvent(Events.COMPLETED, "completed")
        }

        override fun onError(throwable: Throwable) {
          if (!isLockSet) {
            sendEvent(Events.ERROR, "Screen lock not set")
          } else {
            throwable.message?.let { m ->
              if (m.contains("most likely user canceled") || m.contains("aborted")) {
                sendEvent(Events.ABORTED, m)
              } else {
                sendEvent(Events.ERROR, m)
              }
            }
          }
        }
      }
    )
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
    biometricAskPrompt: String,
    clientID: String,
    redirectURI: String
  ) {
    this.clientID = clientID
    this.redirectURI = redirectURI
    if (isEmbeddedSdkInitialized) {
      return
    }
    EmbeddedSdk.init(
      reactApplicationContext.applicationContext as Application,
      clientID,
      keyguardPrompt,
      { message -> sendEvent(Events.LOG, message) },
      biometricAskPrompt
    )
    isEmbeddedSdkInitialized = true
  }

  @ReactMethod
  fun registerCredentialsWithToken(token: String, promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }
    EmbeddedSdk.registerCredentialsWithToken(token) { importResult ->
      importResult.onSuccess { credentials ->
        val credentialsArray = WritableNativeArray()
        credentials.map { makeCredentialMap(it) }.forEach { credentialsArray.pushMap(it) }
        promise.resolve(credentialsArray)
      }
      importResult.onFailure { t -> promise.reject(t) }
    }
  }

  @ReactMethod
  fun registerCredentialsWithUrl(url: String, promise: Promise) {
    if (!isEmbeddedSdkInitialized) {
      promise.reject(Throwable(INITIALIZE_ERROR))
      return
    }

    EmbeddedSdk.registerCredentialsWithUrl(url) { credResult ->
      credResult.onSuccess { credential ->
        promise.resolve(makeCredentialMap(credential))
      }
      credResult.onFailure { t -> promise.reject(t) }
    }
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

  private fun makeCredentialMap(credential: Credential): WritableNativeMap {
    val map = WritableNativeMap()

    map.putString("created", credential.created)
    map.putString("handle", credential.handle)
    map.putString("keyHandle", credential.keyHandle)
    map.putString("name", credential.name)
    map.putString("logoURL", credential.imageUrl)
    map.putString("loginURI", credential.loginUri ?: "")
    map.putString("enrollURI", credential.enrollUri ?: "")
    map.putString("rootFingerprint", credential.rootFingerprint)
    map.putString("state", credentialStateToPascalCase(credential.state))

    val chainArray = WritableNativeArray()
    credential.chain.forEach { chainArray.pushString(it) }
    map.putArray("chain", chainArray)

    return map
  }

  private fun credentialStateToPascalCase(state: CredentialState) =
    when(state){
      ACTIVE -> "Active"
      DEVICE_DELETED -> "DeviceDeleted"
      INVALID -> "Invalid"
      USER_DELETED -> "UserDeleted"
      USER_SUSPENDED -> "UserSuspended"
      UNKNOWN -> "Unknown"
    }
}

