import { WebView } from "react-native-webview";

export const Support = () => {
  return (
    <WebView
      source={{
        uri: "https://join.slack.com/t/byndid/shared_invite/zt-1anns8n83-NQX4JvW7coi9dksADxgeBQ",
      }}
    />
  );
};

export const DevDocs = () => {
  return (
    <WebView
      source={{
        uri: "https://developer.beyondidentity.com",
      }}
    />
  );
};
