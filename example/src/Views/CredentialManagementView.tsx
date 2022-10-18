import { ScrollView, View } from 'react-native';
import { Embedded } from '@beyondidentity/bi-sdk-react-native';
import ButtonCardView from './ButtonCardView';
import InputCardView from './InputCardView';
import s from './styles';

export default function CredentialManagementView() {
  return (
    <ScrollView>
      <View style={s.container}>
        <ButtonCardView
          title="View Credentials"
          detail="View details of your Credential, such as date created, identity and other information related to your device."
          buttonTitle="View Credentials"
          hideLabel={false}
          onPress={async (setResult) => {
            try {
              const credentials = await Embedded.getCredentials();
              if (credentials.length === 0) {
                return setResult(
                  'No credential found, bind a credential first'
                );
              }
              setResult(JSON.stringify(credentials, null, 2));
            } catch (e) {
              if (e instanceof Error) {
                setResult(e.message as string);
              }
            }
          }}
        />

        <InputCardView
          title="Delete Credential"
          detail="This is destructive and will remove the current Credential from this device. If no other device contains the Credential to extend it back to this device, then the Credential will be lost unless a recovery is done."
          buttonTitle="Delete Credential"
          placeholder="Credential ID"
          autoCompleteType="off"
          keyboardType="default"
          textContentType="none"
          onPress={async (input, setResult) => {
            try {
              const id = await Embedded.deleteCredential(input);
              setResult(`Deleted Credential: ${id}`);
            } catch (e) {
              if (e instanceof Error) {
                setResult(e.message as string);
              }
            }
          }}
        />
      </View>
    </ScrollView>
  );
}
