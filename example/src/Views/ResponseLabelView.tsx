import { View, Text } from 'react-native';
import { Color } from './styles';

export default ({ text }: { text: string }) => {
  return (
    <View
      style={{
        backgroundColor: Color.responseBackground,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginTop: 10,
      }}
    >
      <Text selectable={true}>{text || "RESPONSE DATA"}</Text>
    </View>
  );
};
