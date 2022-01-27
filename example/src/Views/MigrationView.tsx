import React, { useState } from 'react';

import { Button, Text, TextInput, View } from 'react-native';
import { Embedded } from '@beyondidentity/embedded-react-native';
import s from './styles';

export default function MigrationView() {
  const [exportedToken, setCredentialToken] = useState<string | null>(null);
  const [extendCredentialsStatus, setExtendCredentialsStatus] =
    useState<string>('');
  const [importLabel, setImportLabel] = useState<string>('');
  const [tokenToImport, setTokenToImport] = useState<string>('');

  return (
    <View style={s.container}>
      <Text style={s.header}>Migration</Text>

      <Button
        onPress={async () => {
          try {
            const credentials = await Embedded.getCredentials();
            if (credentials.length === 0) {
              return setCredentialToken(
                'No Credential found, create a user first'
              );
            }
            Embedded.extendCredentials([credentials[0].handle]);
            subscribeToExportListeners((result) => {
              setCredentialToken(result);
            });
          } catch (e) {
            if (e instanceof Error) {
              setCredentialToken(e.message as string);
            }
          }
        }}
        title="Extend Credentials"
      />
      <Text style={s.info}>{exportedToken}</Text>

      <Button
        onPress={async () => {
          try {
            await Embedded.cancelExtendCredentials();
            unsubscribeFromExportListeners();
            setExtendCredentialsStatus('canceled');
          } catch (e) {
            if (e instanceof Error) {
              setExtendCredentialsStatus(e.message as string);
            }
          }
        }}
        title="Cancel Extend Credentials"
      />
      <Text style={s.info}>{extendCredentialsStatus}</Text>
      <TextInput
        style={s.input}
        autoCapitalize="none"
        onChangeText={setTokenToImport}
        value={tokenToImport}
        placeholder="Enter token to register"
      />
      <Button
        onPress={async () => {
          if (tokenToImport === '') {
            return setImportLabel(
              'Extend a credential from another device and then enter a token to register that credential on this device.'
            );
          }
          try {
            const credentials = await Embedded.registerCredentialsWithToken(
              tokenToImport
            );
            setImportLabel(JSON.stringify(credentials));
          } catch (e) {
            if (e instanceof Error) {
              setImportLabel(e.message as string);
            }
          }
        }}
        title="Register Credentials"
      />
      <Text style={s.info}>{importLabel}</Text>
    </View>
  );
}

function subscribeToExportListeners(callback: (result: string) => void) {
  Embedded.extendCredentialsEventEmitter.addListener(
    'ExtendCredentialAborted',
    callback
  );
  Embedded.extendCredentialsEventEmitter.addListener(
    'ExtendTokenReceived',
    callback
  );
  Embedded.extendCredentialsEventEmitter.addListener(
    'ExtendCredentialCompleted',
    callback
  );
  Embedded.extendCredentialsEventEmitter.addListener('ExtendError', callback);
}

function unsubscribeFromExportListeners() {
  Embedded.extendCredentialsEventEmitter.removeListener(
    'ExtendCredentialAborted',
    (message) => {
      console.log(message);
    }
  );
  Embedded.extendCredentialsEventEmitter.removeListener(
    'ExtendTokenReceived',
    (message) => {
      console.log(message);
    }
  );
  Embedded.extendCredentialsEventEmitter.removeListener(
    'ExtendCredentialCompleted',
    (message) => {
      console.log(message);
    }
  );
  Embedded.extendCredentialsEventEmitter.removeListener(
    'ExtendError',
    (message) => {
      console.log(message);
    }
  );
}
