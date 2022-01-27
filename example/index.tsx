import { AppRegistry } from 'react-native';
import { Embedded } from '@beyondidentity/embedded-react-native';
import App from './src/App';
import { name as appName } from './app.json';
import Config from './src/Config';

Embedded.initialize(
  Config.biometricAskPrompt,
  Config.publicClientID,
  Config.redirectURI
);

Embedded.logEventEmitter.addListener('Logger', (message: string) => {
  console.log(message);
});

AppRegistry.registerComponent(appName, () => App);
