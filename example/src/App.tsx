import React, { useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Embedded } from '@beyondidentity/embedded-react-native';
import AuthenticationView from './Views/AuthenticationView';
import CredentialsView from './Views/CredentialsView';
import CreateUserView from './Views/CreateUserView';
import Config from './Config';
import MigrationView from './Views/MigrationView';
import useDeepLinkURL from './Linking';

export default function App() {
  const { linkedURL } = useDeepLinkURL();

  useEffect(() => {
    async function register() {
      if (linkedURL !== null) {
        try {
          const credential = await Embedded.registerCredentialsWithUrl(
            linkedURL
          );
          Alert.alert('Registered Credential', `${credential.name}`, [
            { text: 'OK', onPress: () => {} },
          ]);
        } catch (e) {
          if (e instanceof Error) {
            Alert.alert('Error', e.message, [
              { text: 'OK', onPress: () => {} },
            ]);
          }
        }
      }
    }

    register();
  }, [linkedURL]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}> 
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          The following functions are available in the Embedded SDK.
        </Text>
        <CredentialsView />
        <CreateUserView
          title="Registration"
          buttonTitle="Create User"
          endpoint={Config.registrationEndpoint}
          placeholder="Enter email to create a user"
          makeBody={(email: string) => {
            return JSON.stringify({
              binding_token_delivery_method: 'email',
              external_id: email,
              email: email,
              user_name: email,
              display_name: email,
            });
          }}
        />
        <CreateUserView
          title="Recovery"
          buttonTitle="Recover User"
          endpoint={Config.recoverUserEndpoint}
          placeholder="Enter email to recover a user"
          makeBody={(email: string) => {
            return JSON.stringify({
              binding_token_delivery_method: 'email',
              external_id: email,
              internal_id: email,
            });
          }}
        />
        <AuthenticationView />
        <MigrationView />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});
