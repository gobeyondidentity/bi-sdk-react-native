import {
  AuthenticateResponse,
  Credential,
  Embedded,
} from '@beyondidentity/bi-sdk-react-native';
import { URL } from 'react-native-url-polyfill';

import React, { useState } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import ButtonCardView from './ButtonCardView';
import SelectCredentialModal from './SelectCredentialModal';
import ResponseLabelView from './ResponseLabelView';
import s from './styles';

// Values are hardcode for demo purposes only. Some of these values should be dynamically generated.
const BeyondIdentityAuthUrl = `https://auth-us.beyondidentity.com/v1/tenants/00012da391ea206d/realms/862e4b72cfdce072/applications/3d869893-08b1-46ca-99c7-3c12226edf1b/authorize?response_type=code&client_id=JvV5DbxFZbana_tMTAPTs-gY&redirect_uri=${encodeURIComponent(
  'acme://'
)}&scope=openid&state=random_state`;
const Auth0AuthUrl = `https://dev-pt10fbkg.us.auth0.com/authorize?connection=Example-App-Native&scope=openid&response_type=code&state=some_random_state&redirect_uri=${encodeURIComponent(
  'acme://dev'
)}&client_id=q1cubQfeZWnajq5YkeZVD3NauRqU4vNs&nonce=nonce&code_challenge_method=S256&code_challenge=d5VD805xzm8Zh42oS702e6brfBVFY0IwzbIac0CXHPI`;
const OktaAuthUrl = `https://dev-43409302.okta.com/oauth2/v1/authorize?idp=0oa5rswruxTaPUcgl5d7&scope=openid&response_type=code&state=some_random_state&redirect_uri=${encodeURIComponent(
  'acme://okta'
)}&client_id=0oa5kipb8rdo4WCkf5d7&code_challenge_method=S256&code_challenge=r6FkKNRMjQx5lYPWrLw6TLX8hSRYiA2gK1wSfIGxW9k`;

enum Flow {
  BeyondIdentity,
  Auth0,
  Okta,
  Unknown,
}

export default function AuthenticateView() {
  const [authFlow, setAuthFlow] = useState<Flow>(Flow.Unknown);
  const [modalVisible, setModalVisible] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);

  // set auth redirectUrl to use after user selects a credential
  const [authUrl, setAuthUrl] = useState('');

  const [beyondIdentityResult, setBeyondIdentityResult] = useState('');
  const [oktaResult, setOktaResult] = useState('');
  const [auth0Result, setAuth0Result] = useState('');

  return (
    <ScrollView>
      <View style={s.container}>
        <Text style={s.info}>
          Authenticate against a credential bound to this device.
        </Text>
        <SelectCredentialModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          credentials={credentials}
          onSelect={async (id) => {
            authenticate(
              authUrl,
              id,
              authFlow,
              setBeyondIdentityResult,
              setAuth0Result,
              setOktaResult
            );
          }}
        />
        <ButtonCardView
          title="Authenticate with Beyond Identity"
          detail="Try authenticating with Beyond Identity as the primary IdP."
          buttonTitle="Authenticate with Beyond Identity"
          hideLabel={true}
          onPress={async (_) => {
            beginAuth(
              Flow.BeyondIdentity,
              BeyondIdentityAuthUrl,
              true,
              setAuthUrl,
              setAuthFlow,
              setBeyondIdentityResult,
              setModalVisible,
              setCredentials
            );
          }}
        />
        <ResponseLabelView text={beyondIdentityResult} />
        <ButtonCardView
          title="Authenticate with Auth0"
          detail="Try authenticating with Auth0 using Beyond Identity as a secondary IdP."
          buttonTitle="Authenticate with Auth0"
          hideLabel={true}
          onPress={async (_) => {
            beginAuth(
              Flow.Auth0,
              Auth0AuthUrl,
              false,
              setAuthUrl,
              setAuthFlow,
              setAuth0Result,
              setModalVisible,
              setCredentials
            );
          }}
        />
        <ResponseLabelView text={auth0Result} />
        <ButtonCardView
          title="Authenticate with Okta"
          detail="Try authenticating with Okta using Beyond Identity as a secondary IdP.\nNote: You must recover the username 'difficult-coat@email.com' before authenticating. This user has been configured to authenticate with Okta."
          buttonTitle="Authenticate with Okta"
          hideLabel={true}
          onPress={async (_) => {
            beginAuth(
              Flow.Okta,
              OktaAuthUrl,
              true,
              setAuthUrl,
              setAuthFlow,
              setOktaResult,
              setModalVisible,
              setCredentials
            );
          }}
        />
        <ResponseLabelView text={oktaResult} />
      </View>
    </ScrollView>
  );
}

async function beginAuth(
  flow: Flow,
  authUrl: string,
  ephemeralWebSession: boolean,
  setAuthUrl: React.Dispatch<React.SetStateAction<string>>,
  setAuthFlow: React.Dispatch<React.SetStateAction<Flow>>,
  setResult: React.Dispatch<React.SetStateAction<string>>,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setCredentials: React.Dispatch<React.SetStateAction<Credential[]>>
) {
  setAuthFlow(flow);
  let url = await startWebSession(authUrl, ephemeralWebSession);
  if (url instanceof Error) {
    setResult(url.message as string);
  } else {
    setAuthUrl(url);
    const credentials = await Embedded.getCredentials();
    setCredentials(credentials);
    handleCredentials(flow, url, credentials, setResult, setModalVisible);
  }
}

async function handleCredentials(
  flow: Flow,
  url: string,
  credentials: Credential[],
  setResult: React.Dispatch<React.SetStateAction<string>>,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
) {
  try {
    // No credentials
    if (credentials.length === 0) {
      return setResult('No credential found, bind a credential first');
    }
    // Single credential
    if (credentials.length === 1) {
      authenticate(
        url,
        credentials[0].id,
        flow,
        setResult,
        setResult,
        setResult
      );
    }
    // Multiple credentials
    if (credentials.length > 1) {
      setTimeout(() => setModalVisible(true), 200);
    }
  } catch (e) {
    if (e instanceof Error) {
      setResult(e.message as string);
    }
  }
}

async function authenticate(
  url: string,
  id: string,
  flow: Flow,
  setBeyondIdentityResult: React.Dispatch<React.SetStateAction<string>>,
  setAuth0Result: React.Dispatch<React.SetStateAction<string>>,
  setOktaResult: React.Dispatch<React.SetStateAction<string>>
) {
  let isAuthUrl = await Embedded.isAuthenticateUrl(url);
  if (!isAuthUrl) {
    let result = await handleCachedResponse(url);
    // okta should be the only one with cache issues on Android
    setOktaResult(result);
  } else {
    let response = await authenticateWithID(url, id);
    handleAuthResponse(
      flow,
      response,
      setBeyondIdentityResult,
      setAuth0Result,
      setOktaResult
    );
  }
}

async function authenticateWithID(
  url: string,
  id: string
): Promise<AuthenticateResponse | Error> {
  try {
    const response = await Embedded.authenticate(url, id);
    return response;
  } catch (e) {
    if (e instanceof Error) {
      return e;
    }
  }
  return new Error('unable to call Embedded.authenticate');
}

async function handleAuthResponse(
  flow: Flow,
  response: AuthenticateResponse | Error,
  setBeyondIdentityResult: React.Dispatch<React.SetStateAction<string>>,
  setAuth0Result: React.Dispatch<React.SetStateAction<string>>,
  setOktaResult: React.Dispatch<React.SetStateAction<string>>
) {
  switch (flow) {
    case Flow.BeyondIdentity:
      if (response instanceof Error) {
        setBeyondIdentityResult(response.message as string);
      } else {
        setBeyondIdentityResult(JSON.stringify(response, null, 2));
      }
      return;
    case Flow.Auth0:
      if (response instanceof Error) {
        setAuth0Result(response.message as string);
      } else {
        let url = await startWebSession(response.redirectURL, false);
        if (url instanceof Error) {
          setAuth0Result(url.message as string);
        } else {
          let result = await makeTokenExchangeForAuth0(url);
          setAuth0Result(result);
        }
      }
      return;
    case Flow.Okta:
      if (response instanceof Error) {
        setOktaResult(response.message as string);
      } else {
        let url = await startWebSession(response.redirectURL, true);
        if (url instanceof Error) {
          setOktaResult(url.message as string);
        } else {
          let result = await makeTokenExchangeForOkta(url);
          setOktaResult(result);
        }
      }
      return;
    case Flow.Unknown:
      throw new Error(`Flow not set: ${flow}`);
    default:
      throw new Error(`Flow doesn't exisit: ${flow}`);
  }
}

async function startWebSession(
  url: string,
  ephemeralWebSession: boolean
): Promise<string | Error> {
  let responseUrl = '';
  try {
    if (await InAppBrowser.isAvailable()) {
      let response = await InAppBrowser.openAuth(url, 'acme://', {
        ephemeralWebSession: ephemeralWebSession,
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
      });
      if (response.type === 'success' && response.url) {
        responseUrl = response.url;
      } else {
        return new Error(
          `Response was unsuccessful: ${JSON.stringify(response)}`
        );
      }
    } else {
      return new Error('InAppBrowser is NOT Available');
    }
  } catch (e) {
    if (e instanceof Error) {
      return e;
    }
  }
  return responseUrl;
}

// This is a workaround for InAppBrowser not clearing cache in Android. The Okta request would need this.
// This is a downside to using the InAppBrowser library. After any successful response, another
// selected users would pass.
async function handleCachedResponse(url: string): Promise<string> {
  if (url.includes('acme://okta')) {
    return await makeTokenExchangeForOkta(url);
  } else if (url.includes('acme://dev')) {
    return await makeTokenExchangeForAuth0(url);
  } else {
    return `Url does not contain expected scheme: ${url}`;
  }
}

async function makeTokenExchangeForAuth0(url: string): Promise<string> {
  const parseableUrl = new URL(url);
  const code = parseableUrl.searchParams.get('code') ?? '';
  let response = await fetch('https://dev-pt10fbkg.us.auth0.com/oauth/token', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      code: code ?? '',
      code_verifier: 'niiSuW2PkdECSLQEKvw3kmGOpETP3GNIljZBH_UJc00',
      client_id: 'q1cubQfeZWnajq5YkeZVD3NauRqU4vNs',
      redirect_uri: 'acme://dev',
      grant_type: 'authorization_code',
    }),
  });
  const data = await response.json();
  return JSON.stringify(data, null, 2);
}

async function makeTokenExchangeForOkta(url: string): Promise<string> {
  const parseableUrl = new URL(url);

  const form = {
    code: parseableUrl.searchParams.get('code') ?? '',
    code_verifier: 'jNaFbX47DcGJoY20v13FUeGYEllQ0jOlzR7XfEpJAsY',
    grant_type: 'authorization_code',
  };

  let response = await fetch(
    `https://dev-43409302.okta.com/oauth2/v1/token?client_id=0oa5kipb8rdo4WCkf5d7&redirect_uri=${encodeURIComponent(
      'acme://okta'
    )}`,
    {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: makeFormBody(form),
    }
  );
  const data = await response.json();
  return JSON.stringify(data, null, 2);
}

function makeFormBody(form: Object): string {
  return Object.keys(form)
    .map(
      (key) =>
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent((form as Record<string, string>)[key])
    )
    .join('&');
}
