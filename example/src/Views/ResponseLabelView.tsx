import { ActivityIndicator, View, Text } from 'react-native';
import { Color } from './styles';

export default ({
  text,
  isLoading = false,
}: {
  text: string;
  isLoading: boolean;
}) => {
  function getText(): string {
    if (isLoading || text.length === 0) {
      return 'RESPONSE DATA';
    }
    return text;
  }

  return (
    <View
      style={{
        backgroundColor: Color.responseBackground,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginTop: 10,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text selectable={true}>{getText()}</Text>
        {isLoading && <ActivityIndicator />}
      </View>
    </View>
  );
};
