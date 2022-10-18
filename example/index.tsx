import { AppRegistry } from 'react-native';
import { Embedded } from '@beyondidentity/bi-sdk-react-native';
import App from './src/App';
import { name as appName } from './app.json';
import Config from './src/Config';

Embedded.initialize(Config.biometricAskPrompt).catch(console.error);

Embedded.logEventEmitter.addListener(
  'BeyondIdentityLogger',
  (message: string) => {
    console.log(message);
  }
);

AppRegistry.registerComponent(appName, () => App);
