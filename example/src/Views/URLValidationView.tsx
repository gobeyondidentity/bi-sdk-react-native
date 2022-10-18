import { ScrollView, View } from 'react-native';
import { Embedded } from '@beyondidentity/bi-sdk-react-native';
import InputCardView from './InputCardView';
import s from './styles';

export default function CredentialManagementView() {
  return (
    <ScrollView>
      <View style={s.container}>
        <InputCardView
          title="Authenticate URL"
          detail="Paste a URL here to validate if it's an authenticate URL."
          buttonTitle="Validate URL"
          placeholder="Authenticate URL"
          autoCompleteType="off"
          keyboardType="default"
          textContentType="none"
          onPress={async (url, setResult) => {
            try {
              const result = await Embedded.isAuthenticateUrl(url);
              setResult(
                `${result}: ${url} ${isOrIsNot(
                  result
                )} a valid authentication URL`
              );
            } catch (e) {
              if (e instanceof Error) {
                setResult(e.message as string);
              }
            }
          }}
        />

        <InputCardView
          title="Bind Credential URL"
          detail="Paste a URL here to validate if it's a bind credential URL."
          buttonTitle="Validate URL"
          placeholder="Bind Credential URL"
          autoCompleteType="off"
          keyboardType="default"
          textContentType="none"
          onPress={async (url, setResult) => {
            try {
              const result = await Embedded.isBindCredentialUrl(url);
              setResult(
                `${result}: ${url} ${isOrIsNot(
                  result
                )} a valid bind credential URL`
              );
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

function isOrIsNot(result: boolean) {
  return result ? 'IS' : 'is NOT';
}
