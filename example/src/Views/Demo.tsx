import {
  SafeAreaView,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Embedded } from '@beyondidentity/bi-sdk-react-native';
import BindCredentialView from './BindCredentialView';
import Config from '../Config';
import InputCardView from './InputCardView';
import NavRow from './NavRow';
import styles from './styles';

export default function Demo({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Embedded SDK Demo</Text>
          <Text style={styles.version}>Version: {Config.sdkVersion}</Text>
          <Text style={styles.title}>Get Started With A Credential</Text>
          <BindCredentialView
            title="Bind Credential"
            detail="To get started using the Embedded SDK sample app, enter any username to bind a credential to this device. Note: This requires a username for which an identity has NOT been created before. It will fail if the username is taken."
            buttonTitle="Bind Credential"
            endpoint={Config.bindEndpoint}
            placeholder="Unique Username"
          />
          <BindCredentialView
            title="Recover Credential"
            detail="If you have an account with a credential you can't access anymore, enter your username to recover your account and bind a credential to this device. Note: This requires a username for which an identity HAS been created before. It will fail if no identity exists for that username."
            buttonTitle="Recover Credential"
            endpoint={Config.recoverEndpoint}
            placeholder="Username"
          />
          <InputCardView
            title="Bind Custom Credential"
            detail="If you have your own Realm you would like to test, paste the Bind Credential URL you generated through the API in order to bind a credential."
            buttonTitle="Bind Custom Credential"
            placeholder="Bind Credential URL"
            autoCompleteType="off"
            keyboardType="url"
            textContentType="none"
            onPress={async (url, setResult) => {
              try {
                const result = await Embedded.bindCredential(url);
                setResult(JSON.stringify(result, null, 2));
              } catch (e) {
                if (e instanceof Error) {
                  setResult(e.message as string);
                }
              }
            }}
          />
          <Text style={styles.title}>SDK Functionality</Text>
          <Text style={styles.detail}>
            Explore the various functions available when a Credential exists on
            the device.
          </Text>
          <NavRow
            title="Manage Credentials"
            onPress={() => navigation.navigate('CredentialManagement')}
          />
          <NavRow
            title="Authenticate"
            onPress={() => navigation.navigate('Authenticate')}
          />
          <NavRow
            title="URL Validatation"
            onPress={() => navigation.navigate('URLValidatation')}
          />
          <Text style={styles.title}>Questions or Issues?</Text>
          <Text style={styles.detail}>
            Read through our developer docs for more details on our Embedded SDK
            or reach out to support.
          </Text>
          <NavRow
            title="View Developer Docs"
            onPress={() => navigation.navigate('DevDocs')}
          />
          <NavRow
            title="Visit Support"
            onPress={() => navigation.navigate('Support')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
