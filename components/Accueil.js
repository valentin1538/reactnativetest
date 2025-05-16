import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Accueil = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur l'Accueil !</Text>
      <Button
        title="Aller à la page API"
        onPress={() => navigation.navigate('ApiPage')}
      />
      <Button
        title="Afficher les données"
        onPress={() => navigation.navigate('AffichageDonnees')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Accueil;