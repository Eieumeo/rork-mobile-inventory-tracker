import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useInventoryStore } from '@/store/inventoryStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import SearchBar from '@/components/SearchBar';
import { Camera, SendToBack } from 'lucide-react-native';
import { Item } from '@/types/inventory';

export default function LendItemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { items, lendItem } = useInventoryStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [borrower, setBorrower] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set selected item from params if available
  useEffect(() => {
    if (params.itemId) {
      const item = items.find(i => i.id === params.itemId);
      if (item && !item.isLent) {
        setSelectedItem(item);
      }
    }
  }, [params.itemId, items]);

  // Filter available (not lent) items
  useEffect(() => {
    const availableItems = items.filter(item => !item.isLent);
    
    if (searchQuery.trim() === '') {
      setFilteredItems(availableItems);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredItems(
        availableItems.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.barcode.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, items]);

  const handleScanBarcode = () => {
    router.push({
      pathname: '/scan',
      params: { returnTo: 'lend-item' }
    });
  };

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleSubmit = () => {
    if (!selectedItem) {
      Alert.alert('Error', 'Please select an item');
      return;
    }

    if (!borrower.trim()) {
      Alert.alert('Error', 'Please enter borrower name');
      return;
    }

    setIsSubmitting(true);

    try {
      lendItem(
        selectedItem.id,
        borrower.trim(),
        selectedItem.location, // Use the item's current location
        undefined,
        notes.trim()
      );
      
      // Clear form fields
      setSelectedItem(null);
      setBorrower('');
      setNotes('');
      
      Alert.alert('Success', 'Item lent successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to lend item');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Lend an Item</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Item</Text>
        
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name or barcode"
          />
          <TouchableOpacity style={styles.scanButton} onPress={handleScanBarcode}>
            <Camera size={20} color="#fff" />
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemsContainer}>
          {filteredItems.length === 0 ? (
            <Text style={styles.emptyText}>No available items found</Text>
          ) : (
            filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemCard,
                  selectedItem?.id === item.id && styles.selectedItemCard,
                ]}
                onPress={() => handleSelectItem(item)}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBarcode}>Barcode: {item.barcode}</Text>
                <Text style={styles.itemCategory}>Category: {item.category}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      {selectedItem && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lending Details</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Borrower Name *</Text>
              <TextInput
                style={styles.input}
                value={borrower}
                onChangeText={setBorrower}
                placeholder="Enter borrower name"
                placeholderTextColor={Colors.placeholder}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Enter any additional notes"
                placeholderTextColor={Colors.placeholder}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Lend Item"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              icon={<SendToBack size={20} color="#fff" />}
            />
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              style={{ marginTop: 12 }}
            />
          </View>
        </>
      )}
    </ScrollView>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  itemsContainer: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.placeholder,
    marginTop: 16,
  },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedItemCard: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  itemBarcode: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: Colors.placeholder,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
  },
});