import { SafeAreaView, ScrollView, Text } from "react-native";
import { Button } from "@rneui/themed";
import Config from "../Config";
import styles, { Color } from "./styles";

export default function Home({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>React Native Embedded SDK</Text>
        <Text style={styles.version}>Version: {Config.sdkVersion}</Text>
        <Text style={styles.detail}>
          Beyond Identity provides the strongest authentication on the planet,
          eliminating passwords completely for customers, as well as from your
          database.
        </Text>
        <Text style={styles.title}>Embedded SDK</Text>
        <Text style={styles.detail}>
          The Embedded SDK is a holistic SDK solution offering the entire
          Passwordless authentication embedded into your app. A set of functions
          are provided to you through the Embedded SDK. This SDK supports OIDC
          and OAuth2.
        </Text>
        <Button
          title="View Embedded SDK"
          color={Color.primary}
          onPress={() => navigation.navigate("Demo")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
