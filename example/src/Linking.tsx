import { useEffect, useState } from "react";
import { Linking } from "react-native";

export default function useDeepLinkURL() {
  const [linkedURL, setLinkedURL] = useState<string | null>(null);

  // If the app is not already open
  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl !== null) {
        setLinkedURL(decodeURI(initialUrl));
      }
    };

    getUrlAsync();
  }, []);

  // If the app is already open
  useEffect(() => {
    const callback = ({ url }: { url: string }) => setLinkedURL(decodeURI(url));
    const linkingEventListener = Linking.addEventListener("url", callback);
    return () => {
      linkingEventListener.remove();
    };
  }, []);

  return { linkedURL };
}
