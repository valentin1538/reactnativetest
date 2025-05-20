import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';
import { addDataItem, getItems, deleteItem, clearAllItems } from '../src/services/migrations/index.js';

const AffichageDonnees = () => {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [items, setItems] = useState([]);

  // Fonction pour charger les données depuis la DB
  const loadItems = useCallback(async () => {
    try {
      const storedItems = await getItems();
      setItems(storedItems);
    } catch (error) {
      console.error("Failed to load items:", error);
      Alert.alert("Erreur", "Impossible de charger les données.");
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]); // Dépend de loadItems pour se recharger si loadItems change (peu probable ici)

  const handleAddItem = async () => {
    if (!itemName || !itemQuantity) {
      Alert.alert("Erreur", "Veuillez entrer un nom et une quantité.");
      return;
    }
    try {
      const quantity = parseInt(itemQuantity, 10);
      if (isNaN(quantity)) {
        Alert.alert("Erreur", "La quantité doit être un nombre.");
        return;
      }
      await addDataItem(itemName, quantity);
      setItemName('');
      setItemQuantity('');
      loadItems(); // Recharger les données après l'ajout
    } catch (error) {
      console.error("Failed to add item:", error);
      Alert.alert("Erreur", "Impossible d'ajouter l'élément.");
    }
  };

  const handleDeleteItem = async (id) => {
    Alert.alert(
      "Supprimer l'élément",
      "Êtes-vous sûr de vouloir supprimer cet élément ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              await deleteItem(id);
              loadItems(); // Recharger les données après la suppression
            } catch (error) {
              console.error("Failed to delete item:", error);
              Alert.alert("Erreur", "Impossible de supprimer l'élément.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleClearAllItems = async () => {
    Alert.alert(
      "Vider la base de données",
      "Êtes-vous sûr de vouloir supprimer TOUS les éléments ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Vider",
          onPress: async () => {
            try {
              await clearAllItems();
              loadItems(); // Recharger les données après le vidage
            } catch (error) {
              console.error("Failed to clear items:", error);
              Alert.alert("Erreur", "Impossible de vider la base de données.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>ID: {item.id}, Nom: {item.name}, Quantité: {item.quantity}</Text>
      <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des données internes</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom de l'élément"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantité"
        keyboardType="numeric"
        value={itemQuantity}
        onChangeText={setItemQuantity}
      />
      <Button title="Ajouter un élément" onPress={handleAddItem} />

      <Button title="Vider tout" onPress={handleClearAllItems} color="red" />

      <Text style={styles.listTitle}>Liste des éléments :</Text>
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
        />
      ) : (
        <Text>Aucun élément trouvé.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AffichageDonnees;