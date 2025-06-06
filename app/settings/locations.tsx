import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useInventoryStore } from '@/store/inventoryStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { MapPin, Plus, X } from 'lucide-react-native';

export default function LocationsScreen() {
  const { locations, addLocation, removeLocation } = useInventoryStore();
  const [newLocation, setNewLocation] = useState('');

  const handleAddLocation = () => {
    if (!newLocation.trim()) {
      Alert.alert('Error', 'Please enter a location name');
      return;
    }

    const locationExists = locations.some(
      (loc) => loc.name.toLowerCase() === newLocation.trim().toLowerCase()
    );

    if (locationExists) {
      Alert.alert('Error', 'This location already exists');
      return;
    }

    addLocation({
      id: Date.now().toString(),
      name: newLocation.trim(),
    });

    setNewLocation('');
  };

  const handleDeleteLocation = (id: string, name: string) => {
    Alert.alert(
      'Delete Location',
      `Are you sure you want to delete "${name}"? This may affect items stored at this location.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeLocation(id)
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Locations</Text>
      </View>
      
      <Text style={styles.subtitle}>
        Manage locations for tracking where your items are stored
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newLocation}
          onChangeText={setNewLocation}
          placeholder="Enter new location name"
          placeholderTextColor={Colors.placeholder}
        />
        <Button
          title="Add"
          onPress={handleAddLocation}
          style={styles.addButton}
          icon={<Plus size={20} color="#fff" />}
        />
      </View>

      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.locationItem}>
            <View style={styles.locationInfo}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.locationName}>{item.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteLocation(item.id, item.name)}
            >
              <X size={20} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No locations added yet</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.placeholder,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
  },
  addButton: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationName: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.placeholder,
  },
});