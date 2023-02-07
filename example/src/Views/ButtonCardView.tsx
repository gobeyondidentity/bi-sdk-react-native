import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@rneui/themed';
import s, { Color } from './styles';
import ResponseLabelView from './ResponseLabelView';

interface ButtonCardViewProps {
  title: string;
  detail: string;
  buttonTitle: string;
  hideLabel: boolean;
  onPress: (setResult: React.Dispatch<React.SetStateAction<string>>) => void;
}

export default function ButtonCardView({
  title,
  detail,
  buttonTitle,
  hideLabel = false,
  onPress,
}: ButtonCardViewProps) {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <View>
      <Text style={s.title} selectable={true}>
        {title}
      </Text>
      <NewlineText text={detail} />
      <Button
        onPress={async () => {
          setLoading(true);
          onPress((result) => {
            setLoading(false);
            setResult(result);
          });
        }}
        title={buttonTitle}
        color={Color.primary}
      />
      {!hideLabel && <ResponseLabelView text={result} isLoading={loading} />}
    </View>
  );
}

export function NewlineText(props: { text: string }) {
  const newText = props.text.split('\\n').map((str) => {
    return (
      <Text style={{ paddingBottom: 10 }} key={str} selectable={true}>
        {str}
      </Text>
    );
  });

  return <View>{newText}</View>;
}
