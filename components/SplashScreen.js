import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulez un chargement long (par exemple, chargement de données initiales)
    setTimeout(() => {
      setLoading(false);
      // Naviguez vers la page d'accueil après le délai
      navigation.replace('Accueil');
    }, 2000); // Durée du splash screen en millisecondes (2 secondes ici)
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon App</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SplashScreen;