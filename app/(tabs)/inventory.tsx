import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useInventoryStore } from '@/store/inventoryStore';
import ItemCard from '@/components/ItemCard';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { Item } from '@/types/inventory';

export default function InventoryScreen() {
  const { items } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.barcode.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, items]);

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by name, barcode, category..."
      />

      {items.length === 0 ? (
        <EmptyState message="No items in your inventory yet. Add some items to get started!" />
      ) : filteredItems.length === 0 ? (
        <EmptyState message="No items match your search criteria." />
      ) : (
        <>
          <Text style={styles.resultCount}>
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </Text>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ItemCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  resultCount: {
    marginBottom: 12,
    fontSize: 14,
    color: Colors.placeholder,
  },
});