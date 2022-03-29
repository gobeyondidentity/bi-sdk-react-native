import React, { useState } from 'react';

import { View, Button, Text } from 'react-native';
import { Embedded } from '@beyondidentity/embedded-react-native';
import s from './styles';

export default function CredentialsView() {
  const [getCredentialsText, setGetCredentials] = useState('');
  const [deleteCredentialsText, setDeleteCredentials] = useState('');

  return (
    <View style={s.container}>
      <Text style={s.header}>Credentials</Text>

      <Button
        onPress={async () => {
          try {
            const credentials = await Embedded.getCredentials();
            if (credentials.length === 0) {
              return setGetCredentials(
                'No Credential found, create a user first'
              );
            }
            setGetCredentials(JSON.stringify(credentials));
          } catch (e) {
            if (e instanceof Error) {
              setGetCredentials(e.message as string);
            }
          }
        }}
        title="Get All Credentials"
      />
      <Text style={s.info}>{getCredentialsText}</Text>

      <Button
        onPress={async () => {
          try {
            const credentials = await Embedded.getCredentials();
            if (credentials.length === 0) {
              return setDeleteCredentials(
                'No Credential found, create a user first'
              );
            }
            try {
              const handle = await Embedded.deleteCredential(
                credentials[0].handle
              );
              setDeleteCredentials(`Deleted Credential: ${handle}`);
            } catch (e) {
              if (e instanceof Error) {
                setDeleteCredentials(e.message as string);
              }
            }
          } catch (e) {
            if (e instanceof Error) {
              setDeleteCredentials(e.message as string);
            }
          }
        }}
        title="Delete A Credential"
      />
      <Text style={s.info}>{deleteCredentialsText}</Text>
    </View>
  );
}
