import React, { useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import {
  AuthorizationCode,
  Embedded,
  PKCE,
} from '@beyondidentity/embedded-react-native';
import { Buffer } from 'buffer';
import s from './styles';
import Config from '../Config';

export default function AuthenticationView() {
  const [authorizationCode, setAuthorizationCode] =
    useState<AuthorizationCode | null>(null);
  const [authorizationCodeError, setAuthorizationCodeError] = useState('');
  const [pkceError, setPKCEError] = useState('');
  const [pkce, setPKCE] = useState<PKCE | null>(null);
  const [tokenResponse, setTokenResponse] = useState('');
  const [unsafeTokenResponse, setUnSafeTokenResponse] = useState('');

  return (
    <View style={s.container}>
      <Text style={s.header}>Authentication</Text>

      <Button
        onPress={async () => {
          createPKCE(setPKCE, setPKCEError);
        }}
        title="Generate PKCE Params"
      />
      <Text style={s.info}>
        {pkce !== null ? JSON.stringify(pkce) : pkceError}
      </Text>

      <Button
        onPress={async () => {
          const pkce = await createPKCE(setPKCE, setPKCEError);
          if (pkce !== null) {
            authorize(pkce, setAuthorizationCode, setAuthorizationCodeError);
          }
        }}
        title="Authorize"
      />
      <Text style={s.info}>
        {authorizationCode !== null
          ? authorizationCode.authorizationCode
          : authorizationCodeError}
      </Text>

      <Button
        onPress={async () => {
          if (authorizationCode === null || pkce === null) {
            return setUnSafeTokenResponse(
              'First register a user and then complete "Authorize". This unsafe function will simulate your backend making the token exchange with the provided Authentication Code returned from "Authorize".'
            );
          }
          unsafeAuthentication(
            authorizationCode,
            pkce as PKCE,
            setUnSafeTokenResponse
          );
        }}
        title="Unsafe Authentication"
      />
      <Text style={s.info}>{unsafeTokenResponse}</Text>

      <Button
        onPress={async () => {
          try {
            Embedded.initialize(
              Config.biometricAskPrompt,
              Config.publicClientID,
              Config.redirectURI
            );
            const response = await Embedded.authenticate();
            setTokenResponse(JSON.stringify(response));
          } catch (e) {
            if (e instanceof Error) {
              setTokenResponse(e.message as string);
            }
          }
        }}
        title="Authenticate"
      />
      <Text style={s.info}>{tokenResponse}</Text>
    </View>
  );
}

async function authorize(
  pkce: PKCE,
  setAuthorizationCode: React.Dispatch<
    React.SetStateAction<AuthorizationCode | null>
  >,
  setAuthorizationCodeError: React.Dispatch<React.SetStateAction<string>>
) {
  try {
    await Embedded.initialize(
      Config.biometricAskPrompt,
      Config.confidentialClientID,
      Config.redirectURI
    );
    const code = await Embedded.authorize(
      {
        challenge: pkce.codeChallenge,
        method: pkce.codeChallengeMethod,
      },
      'openid'
    );
    setAuthorizationCode(code);
  } catch (e) {
    if (e instanceof Error) {
      setAuthorizationCodeError(e.message as string);
    }
  }
}

async function createPKCE(
  setPKCE: (value: React.SetStateAction<PKCE | null>) => void,
  setPKCEError: (value: React.SetStateAction<string>) => void
): Promise<PKCE | null> {
  try {
    const pkce = await Embedded.createPKCE();
    setPKCE(pkce);
    return pkce;
  } catch (e) {
    if (e instanceof Error) {
      setPKCEError(e.message);
    }
  }
  return null;
}

async function unsafeAuthentication(
  authorizationCode: AuthorizationCode,
  pkce: PKCE,
  setUnSafeTokenResponse: (value: React.SetStateAction<string>) => void
) {
  try {
    const clientSecretBasic = `Basic ${Buffer.from(
      `${Config.confidentialClientID}:${Config.confidentialClientSecret}`
    ).toString('base64')}`;

    const form = {
      code: authorizationCode.authorizationCode,
      code_verifier: (pkce as PKCE).codeVerifier,
      redirect_uri: Config.redirectURI,
      grant_type: 'authorization_code',
    };

    const formBody = Object.keys(form)
      .map(
        (key) =>
          encodeURIComponent(key) +
          '=' +
          encodeURIComponent((form as Record<string, string>)[key])
      )
      .join('&');

    const response = await fetch(Config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': clientSecretBasic,
      },
      body: formBody,
    });

    if (!response.ok) {
      return Alert.alert(`Got response error: ${response.status}`, '', [
        { text: 'OK', onPress: () => {} },
      ]);
    }

    const tokenResponse = await response.json();

    if ('error' in tokenResponse) {
      return Alert.alert('Token Response Error', tokenResponse.error, [
        { text: 'OK', onPress: () => {} },
      ]);
    }
    setUnSafeTokenResponse(JSON.stringify(tokenResponse));
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert('Error', e.message, [{ text: 'OK', onPress: () => {} }]);
    }
  }
}
