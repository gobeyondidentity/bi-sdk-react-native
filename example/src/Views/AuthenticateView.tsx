import {
  AuthenticateResponse,
  Passkey,
  Embedded,
} from '@beyondidentity/bi-sdk-react-native';
import { URL } from 'react-native-url-polyfill';
import React, { useState } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import ButtonCardView from './ButtonCardView';
import SelectPasskeyModal from './SelectPasskeyModal';
import ResponseLabelView from './ResponseLabelView';
import s from './styles';

// Values are hardcode for demo purposes only. Some of these values should be dynamically generated.
const BeyondIdentityAuthUrl = `https://auth-us.beyondidentity.com/v1/tenants/00012da391ea206d/realms/862e4b72cfdce072/applications/a8c0aa60-38e4-42b6-bd52-ef64aba5478b/authorize?response_type=code&client_id=KhSWSmfhZ6xCMz9yw7DpJcv5&redirect_uri=${encodeURIComponent(
  'acme://'
)}&scope=openid&state=random_state&code_challenge_method=S256&code_challenge=KmWGRa8zO-BtoyZZnct4kCxjCiM6xhZxtQBMrww6F5w`;
const Auth0AuthUrl = `https://dev-pt10fbkg.us.auth0.com/authorize?connection=Example-App-Native&scope=openid&response_type=code&state=some_random_state&redirect_uri=${encodeURIComponent(
  'acme://auth0'
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
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);

  // set auth redirectUrl to use after user selects a passkey
  const [authUrl, setAuthUrl] = useState('');

  const [beyondIdentityResult, _setBeyondIdentityResult] = useState('');
  const [oktaResult, _setOktaResult] = useState('');
  const [auth0Result, _setAuth0Result] = useState('');

  const [auth0Loading, setAuth0Loading] = useState(false);
  const [beyondIdentityLoading, setBeyondIdentityLoading] = useState(false);
  const [oktaLoading, setOktaLoading] = useState(false);

  function setAuth0Result(result: string) {
    setAuth0Loading(false);
    _setAuth0Result(result);
  }

  function setBeyondIdentityResult(result: string) {
    setBeyondIdentityLoading(false);
    _setBeyondIdentityResult(result);
  }

  function setOktaResult(result: string) {
    setOktaLoading(false);
    _setOktaResult(result);
  }

  return (
    <ScrollView>
      <View style={s.container}>
        <Text style={s.info}>
          Authenticate against a passkey bound to this device.
        </Text>
        <SelectPasskeyModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          passkeys={passkeys}
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
            setBeyondIdentityLoading(true);
            beginAuth(
              Flow.BeyondIdentity,
              BeyondIdentityAuthUrl,
              true,
              setAuthUrl,
              setAuthFlow,
              setBeyondIdentityResult,
              setModalVisible,
              setPasskeys
            );
          }}
        />
        <ResponseLabelView
          text={beyondIdentityResult}
          isLoading={beyondIdentityLoading}
        />
        <ButtonCardView
          title="Authenticate with Auth0"
          detail="Try authenticating with Auth0 using Beyond Identity as a secondary IdP."
          buttonTitle="Authenticate with Auth0"
          hideLabel={true}
          onPress={async (_) => {
            setAuth0Loading(true);
            beginAuth(
              Flow.Auth0,
              Auth0AuthUrl,
              false,
              setAuthUrl,
              setAuthFlow,
              setAuth0Result,
              setModalVisible,
              setPasskeys
            );
          }}
        />
        <ResponseLabelView text={auth0Result} isLoading={auth0Loading} />
        <ButtonCardView
          title="Authenticate with Okta"
          detail="Try authenticating with Okta using Beyond Identity as a secondary IdP.\nNote: You must recover the username 'difficult-coat@email.com' before authenticating. This user has been configured to authenticate with Okta."
          buttonTitle="Authenticate with Okta"
          hideLabel={true}
          onPress={async (_) => {
            setOktaLoading(true);
            beginAuth(
              Flow.Okta,
              OktaAuthUrl,
              true,
              setAuthUrl,
              setAuthFlow,
              setOktaResult,
              setModalVisible,
              setPasskeys
            );
          }}
        />
        <ResponseLabelView text={oktaResult} isLoading={oktaLoading} />
      </View>
    </ScrollView>
  );
}

async function authenticateBeyondIdentityAsPrimaryIdp(
  url: string,
  setResult: (result: string) => void
) {
  let response = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  const data = await response.json();
  if (data.authenticate_url) {
    return data.authenticate_url;
  } else {
    setResult(`authenticate_url not found in response: ${data}`);
  }
}

async function beginAuth(
  flow: Flow,
  authUrl: string,
  ephemeralWebSession: boolean,
  setAuthUrl: React.Dispatch<React.SetStateAction<string>>,
  setAuthFlow: React.Dispatch<React.SetStateAction<Flow>>,
  setResult: (result: string) => void,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setPasskeys: React.Dispatch<React.SetStateAction<Passkey[]>>
) {
  setAuthFlow(flow);
  let url = await getRedirectUrl(flow, authUrl, ephemeralWebSession, setResult);

  if (url instanceof Error) {
    setResult(url.message as string);
  } else {
    setAuthUrl(url);
    const passkeys = await Embedded.getPasskeys();
    setPasskeys(passkeys);
    handlePasskeys(flow, url, passkeys, setResult, setModalVisible);
  }
}

async function getRedirectUrl(
  flow: Flow,
  authUrl: string,
  ephemeralWebSession: boolean,
  setResult: (result: string) => void
) {
  switch (flow) {
    case Flow.BeyondIdentity:
      return await authenticateBeyondIdentityAsPrimaryIdp(authUrl, setResult);
    case Flow.Auth0:
      return await startWebSession(authUrl, ephemeralWebSession);
    case Flow.Okta:
      return await startWebSession(authUrl, ephemeralWebSession);
  }
}

async function handlePasskeys(
  flow: Flow,
  url: string,
  passkeys: Passkey[],
  setResult: (result: string) => void,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
) {
  try {
    // No passkeys
    if (passkeys.length === 0) {
      return setResult('No passkey found, bind a passkey first');
    }
    // Single passkey
    if (passkeys.length === 1) {
      authenticate(url, passkeys[0].id, flow, setResult, setResult, setResult);
    }
    // Multiple passkeys
    if (passkeys.length > 1) {
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
  setBeyondIdentityResult: (result: string) => void,
  setAuth0Result: (result: string) => void,
  setOktaResult: (result: string) => void
) {
  let isAuthUrl = await Embedded.isAuthenticateUrl(url);
  if (!isAuthUrl) {
    switch (flow) {
      case Flow.BeyondIdentity:
        setBeyondIdentityResult(
          `The following is not an authenticateUrl ${url}`
        );
        return;
      case Flow.Auth0:
        setAuth0Result(`The following is not an authenticateUrl ${url}`);
        return;
      case Flow.Okta:
        let result = await handleCachedResponse(url);
        // okta should be the only one with cache issues on Android
        setOktaResult(result);
        return;
    }
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
  setBeyondIdentityResult: (result: string) => void,
  setAuth0Result: (result: string) => void,
  setOktaResult: (result: string) => void
) {
  switch (flow) {
    case Flow.BeyondIdentity:
      if (response instanceof Error) {
        setBeyondIdentityResult(response.message as string);
      } else {
        console.log('RESPONSE', response);
        if (response.redirectUrl) {
          let result = await makeTokenExchangeForBeyondIdentity(
            response.redirectUrl
          );
          setBeyondIdentityResult(result);
        } else {
          setBeyondIdentityResult(
            `No redirectUrl found in ${JSON.stringify(response)}`
          );
        }
      }
      return;
    case Flow.Auth0:
      if (response instanceof Error) {
        setAuth0Result(response.message as string);
      } else {
        let url = await startWebSession(response.redirectUrl, false);
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
        if (response.redirectUrl) {
          let url = await startWebSession(response.redirectUrl, true);
          if (url instanceof Error) {
            setOktaResult(url.message as string);
          } else {
            let result = await makeTokenExchangeForOkta(url);
            setOktaResult(result);
          }
        } else {
          setOktaResult(`No redirectUrl found in ${JSON.stringify(response)}`);
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
  } else if (url.includes('acme://auth0')) {
    return await makeTokenExchangeForAuth0(url);
  } else {
    return `Url does not contain expected scheme: ${url}`;
  }
}

async function makeTokenExchangeForBeyondIdentity(
  url: string
): Promise<string> {
  const parseableUrl = new URL(url);

  const form = {
    code: parseableUrl.searchParams.get('code') ?? '',
    code_verifier:
      'zkoPKpKiiqZWYu6YNjojYbLIVaVmOIEKWgWHWpogtMpuFS3Sot7UmV5k_W5Y1y3JQN4K7si9sOdQXhilNPIbDL87IEeg8qeesrTGNpKrUVu5RoIQzcpC8mn4kdbOwHvn',
    grant_type: 'authorization_code',
    client_id: 'KhSWSmfhZ6xCMz9yw7DpJcv5',
    redirect_uri: 'acme://',
  };

  let response = await fetch(
    'https://auth-us.beyondidentity.com/v1/tenants/00012da391ea206d/realms/862e4b72cfdce072/applications/a8c0aa60-38e4-42b6-bd52-ef64aba5478b/token',
    {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: makeFormBody(form),
    }
  );
  const data = await response.json();
  return JSON.stringify(data, null, 2);
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
      redirect_uri: 'acme://auth0',
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
