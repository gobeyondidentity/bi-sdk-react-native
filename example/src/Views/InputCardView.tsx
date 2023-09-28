import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  KeyboardTypeOptions,
  TextInputIOSProps,
} from "react-native";
import { Button } from "@rneui/themed";
import s, { Color } from "./styles";
import ResponseLabelView from "./ResponseLabelView";

interface InputCardViewProps {
  title: string;
  detail: string;
  buttonTitle: string;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  textContentType: TextInputIOSProps["textContentType"];
  onPress: (
    input: string,
    setResult: React.Dispatch<React.SetStateAction<string>>
  ) => void;
}

export default function InputCardView({
  title,
  detail,
  buttonTitle,
  placeholder,
  keyboardType,
  textContentType,
  onPress,
}: InputCardViewProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View>
      <Text style={s.title}>{title}</Text>
      <Text selectable={true}>{detail}</Text>
      <TextInput
        style={s.input}
        autoCapitalize="none"
        onChangeText={setInput}
        value={input}
        placeholder={placeholder}
        keyboardType={keyboardType}
        textContentType={textContentType}
      />
      <Button
        onPress={async () => {
          setLoading(true);
          onPress(input, (response) => {
            setLoading(false);
            setResult(response);
          });
        }}
        title={buttonTitle}
        color={Color.primary}
      />
      <ResponseLabelView text={result} isLoading={loading} />
    </View>
  );
}
