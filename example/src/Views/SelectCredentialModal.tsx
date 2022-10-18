import type { Credential } from '@beyondidentity/bi-sdk-react-native';
import { Text, View, Modal, StyleSheet, Pressable } from 'react-native';

interface SelectCredentialModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  credentials: Credential[];
  onSelect: (id: string) => void;
}

export default function SelectCredentialModal(
  props: SelectCredentialModalProps
) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(!props.modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable
            onPress={() => {
              props.setModalVisible(false);
            }}
          >
            <Text>Close</Text>
          </Pressable>
          <Text style={styles.modalText}>Select A Credential</Text>
          {props.credentials.map((cred: Credential) => {
            return (
              <Pressable
                style={styles.button}
                key={cred.id}
                onPress={() => {
                  props.onSelect(cred.id);
                  props.setModalVisible(!props.modalVisible);
                }}
              >
                <Text style={styles.text}>{cred.identity.displayName}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    borderColor: 'gray',
    borderWidth: 1,
    elevation: 3,
    backgroundColor: 'white',
    margin: 5,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'black',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});
