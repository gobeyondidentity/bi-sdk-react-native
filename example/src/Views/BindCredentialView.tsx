import { Embedded } from '@beyondidentity/bi-sdk-react-native';
import InputCardView from './InputCardView';

interface BindCredentialViewProps {
  title: string;
  detail: string;
  buttonTitle: string;
  endpoint: string;
  placeholder: string;
}

export default function BindCredentialView({
  title,
  detail,
  buttonTitle,
  endpoint,
  placeholder,
}: BindCredentialViewProps) {
  return InputCardView({
    title: title,
    detail: detail,
    buttonTitle: buttonTitle,
    placeholder: placeholder,
    autoCompleteType: 'username',
    keyboardType: 'default',
    textContentType: 'username',
    onPress: (
      input: string,
      setResult: React.Dispatch<React.SetStateAction<string>>
    ) => {
      if (input === '') {
        return setResult('Please enter a username');
      }
      makeBindRequest(input, endpoint, setResult);
    },
  });
}

async function makeBindRequest(
  username: string,
  endpoint: string,
  setResult: React.Dispatch<React.SetStateAction<string>>
) {
  try {
    const body = JSON.stringify({
      username: username,
      authenticator_type: 'native',
      delivery_method: 'return',
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    let responseStatus = 200;

    if (!response.ok) {
      responseStatus = response.status;
    }

    const json = await response.json();

    if ('error' in json) {
      return setResult(`An error has occured ${responseStatus}: ${json.error}`);
    }

    if (json.code) {
      return setResult(
        `An error has occured ${responseStatus}: ${json.message}`
      );
    }

    const bindUrl = json.credential_binding_link;
    let bindResponse = await Embedded.bindCredential(bindUrl);

    return setResult(JSON.stringify(bindResponse, null, 2));
  } catch (e) {
    if (e instanceof Error) {
      return setResult(`An error has occured: ${e.message}`);
    }
  }
}
