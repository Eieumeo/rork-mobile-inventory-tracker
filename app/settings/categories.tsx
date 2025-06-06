import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useInventoryStore } from '@/store/inventoryStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { Tag, Plus, X } from 'lucide-react-native';

export default function CategoriesScreen() {
  const { categories, addCategory, removeCategory } = useInventoryStore();
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const categoryExists = categories.some(
      (cat) => cat.name.toLowerCase() === newCategory.trim().toLowerCase()
    );

    if (categoryExists) {
      Alert.alert('Error', 'This category already exists');
      return;
    }

    addCategory({
      id: Date.now().toString(),
      name: newCategory.trim(),
    });

    setNewCategory('');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${name}"? This may affect items using this category.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeCategory(id)
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Categories</Text>
      </View>
      
      <Text style={styles.subtitle}>
        Manage categories for organizing your inventory items
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="Enter new category name"
          placeholderTextColor={Colors.placeholder}
        />
        <Button
          title="Add"
          onPress={handleAddCategory}
          style={styles.addButton}
          icon={<Plus size={20} color="#fff" />}
        />
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <Tag size={20} color={Colors.primary} />
              <Text style={styles.categoryName}>{item.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteCategory(item.id, item.name)}
            >
              <X size={20} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories added yet</Text>
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
  categoryItem: {
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
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
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