/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/components/SplashScreen';
import Accueil from './src/components/Accueil';
import ApiPage from './src/components/ApiPage';
import AffichageDonnees from './src/components/AffichageDonnees';
import { initDatabase, closeDatabase } from './src/services/migrations/index.js';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    // Ouvrir la base de données au montage de l'application
    initDatabase()
      .then(() => console.log('Database initialized successfully.'))
      .catch(error => console.error('Failed to initialize database:', error));

    // Fermer la base de données à la fin de vie de l'application (optionnel, mais bonne pratique)
    return () => {
      closeDatabase();
    };
  }, []); // Le tableau vide assure que cela ne s'exécute qu'une fois

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Accueil"
          component={Accueil}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ApiPage" component={ApiPage} options={{ title: 'Page API' }} />
        <Stack.Screen name="AffichageDonnees" component={AffichageDonnees} options={{ title: 'Données internes' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;