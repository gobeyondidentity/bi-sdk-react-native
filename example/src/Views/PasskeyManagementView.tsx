import { ScrollView, View } from "react-native";
import { Embedded } from "@beyondidentity/bi-sdk-react-native";
import ButtonCardView from "./ButtonCardView";
import InputCardView from "./InputCardView";
import s from "./styles";

export default function PasskeyManagementView() {
  return (
    <ScrollView>
      <View style={s.container}>
        <ButtonCardView
          title="View Passkeys"
          detail="View details of your passkey, such as date created, identity and other information related to your device."
          buttonTitle="View Passkeys"
          hideLabel={false}
          onPress={async (setResult) => {
            try {
              const passkeys = await Embedded.getPasskeys();
              if (passkeys.length === 0) {
                return setResult("No passkey found, bind a passkey first");
              }
              setResult(JSON.stringify(passkeys, null, 2));
            } catch (e) {
              if (e instanceof Error) {
                setResult(e.message as string);
              }
            }
          }}
        />

        <InputCardView
          title="Delete Passkey"
          detail="This is destructive and will remove the current passkey from this device. If no other device contains the Passkey to extend it back to this device, then the Passkey will be lost unless a recovery is done."
          buttonTitle="Delete Passkey"
          placeholder="Passkey ID"
          keyboardType="default"
          textContentType="none"
          onPress={async (input, setResult) => {
            try {
              const id = await Embedded.deletePasskey(input);
              setResult(`Deleted passkey: ${id}`);
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
