import { ListItem } from '@rneui/themed';
import { Color } from './styles';

interface NavRowProps {
  title: string;
  onPress: () => void;
}

export default ({ title, onPress }: NavRowProps) => {
  return (
    <ListItem
      bottomDivider
      onPress={onPress}
      containerStyle={{ backgroundColor: Color.backgroundColor }}
    >
      <ListItem.Content>
        <ListItem.Title>{title}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron color="black" />
    </ListItem>
  );
};
