import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthenticateView from './Views/AuthenticateView';
import CredentialManagementView from './Views/CredentialManagementView';
import Demo from './Views/Demo';
import Home from './Views/Home';
import URLValidationView from './Views/URLValidationView';
import { Support, DevDocs } from './Views/Webviews';
import useDeepLinkURL from './Linking';
import { Color } from './Views/styles';

const Stack = createNativeStackNavigator();

export default function App() {
  const { linkedURL } = useDeepLinkURL();

  useEffect(() => {
    async function register() {
      if (linkedURL !== null) {
        console.log('linkedURL', linkedURL);
      }
    }

    register();
  }, [linkedURL]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: Color.backgroundColor },
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{ title: '' }} />
        <Stack.Screen name="Demo" component={Demo} options={{ title: '' }} />
        <Stack.Screen
          name="CredentialManagement"
          component={CredentialManagementView}
          options={{ title: 'Manage Credentials' }}
        />
        <Stack.Screen
          name="Authenticate"
          component={AuthenticateView}
          options={{ title: 'Authenticate' }}
        />
        <Stack.Screen
          name="URLValidatation"
          component={URLValidationView}
          options={{ title: 'URL Validatation' }}
        />
        <Stack.Screen
          name="DevDocs"
          component={DevDocs}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="Support"
          component={Support}
          options={{ title: '' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
