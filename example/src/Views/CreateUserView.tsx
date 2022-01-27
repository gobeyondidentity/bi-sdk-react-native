import React, { useState } from 'react';

import { Alert, Button, Text, TextInput, View } from 'react-native';
import s from './styles';

interface CreateUserViewProps {
  title: string;
  buttonTitle: string;
  endpoint: string;
  placeholder: string;
  makeBody: (email: string) => string;
}

export default function CreateUserView({
  title,
  buttonTitle,
  endpoint,
  placeholder,
  makeBody,
}: CreateUserViewProps) {
  const [email, setEmail] = useState('');
  const [createUserText, setUserText] = useState('');

  return (
    <View style={s.container}>
      <Text style={s.header}>{title}</Text>
      <TextInput
        style={s.input}
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
        placeholder={placeholder}
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <Button
        onPress={async () => {
          if (email === '' || !email.includes('@')) {
            return setUserText('Please enter an email address');
          }
          makeUserRequest(email, endpoint, makeBody);
        }}
        title={buttonTitle}
      />
      <Text style={s.info}>{createUserText}</Text>
    </View>
  );
}

async function makeUserRequest(
  email: string,
  endpoint: string,
  makeBody: (email: string) => string
) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: makeBody(email),
    });

    if (!response.ok) {
      Alert.alert(`An error has occured: ${response.status}`, '', [
        { text: 'OK', onPress: () => {} },
      ]);
    }

    const json = await response.json();

    if ('error' in json) {
      return Alert.alert('Error', json.error, [
        { text: 'OK', onPress: () => {} },
      ]);
    }
    Alert.alert('check your email!', '', [{ text: 'OK', onPress: () => {} }]);
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert('Error', e.message, [{ text: 'OK', onPress: () => {} }]);
    }
  }
}
