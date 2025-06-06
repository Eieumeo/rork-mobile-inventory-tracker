import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useInventoryStore } from '@/store/inventoryStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { Barcode, Camera, Plus, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddItemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { categories, locations, addItem, addCategory, addLocation } = useInventoryStore();
  
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New state for adding new category/location
  const [newCategory, setNewCategory] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);

  // Set barcode from params if available
  useEffect(() => {
    if (params.barcode) {
      setBarcode(params.barcode as string);
    }
  }, [params.barcode]);

  const handleScanBarcode = () => {
    router.push({
      pathname: '/scan',
      params: { returnTo: 'add-item' }
    });
  };

  const handleAddNewCategory = () => {
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

    const newCategoryObj = {
      id: Date.now().toString(),
      name: newCategory.trim(),
    };
    
    addCategory(newCategoryObj);
    setCategory(newCategory.trim());
    setNewCategory('');
    setShowAddCategory(false);
  };

  const handleAddNewLocation = () => {
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

    const newLocationObj = {
      id: Date.now().toString(),
      name: newLocation.trim(),
    };
    
    addLocation(newLocationObj);
    setLocation(newLocation.trim());
    setNewLocation('');
    setShowAddLocation(false);
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      let result;
      
      if (source === 'camera') {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take photos');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        // Request media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Media library permission is required to select photos');
          return;
        }
        
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (!barcode.trim()) {
      Alert.alert('Error', 'Please enter or scan a barcode');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Please select a location');
      return;
    }

    setIsSubmitting(true);

    try {
      const newItem = {
        id: Date.now().toString(),
        name: name.trim(),
        barcode: barcode.trim(),
        category,
        location,
        quantity: parseInt(quantity) || 1,
        description: description.trim(),
        dateAdded: new Date().toISOString(),
        isLent: false,
        image: image || undefined,
      };

      addItem(newItem);
      
      // Clear form fields
      setName('');
      setBarcode('');
      setCategory('');
      setLocation('');
      setQuantity('1');
      setDescription('');
      setImage(null);
      
      Alert.alert('Success', 'Item added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Add New Item</Text>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter item name"
          placeholderTextColor={Colors.placeholder}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Barcode *</Text>
        <View style={styles.barcodeContainer}>
          <TextInput
            style={styles.barcodeInput}
            value={barcode}
            onChangeText={setBarcode}
            placeholder="Enter or scan barcode"
            placeholderTextColor={Colors.placeholder}
          />
          <TouchableOpacity style={styles.scanButton} onPress={handleScanBarcode}>
            <Camera size={20} color="#fff" />
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Item Image (Optional)</Text>
        <View style={styles.imageContainer}>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeImageButton} 
                onPress={() => setImage(null)}
              >
                <Text style={styles.removeImageText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageButtonsContainer}>
              <TouchableOpacity 
                style={styles.imageButton} 
                onPress={() => pickImage('camera')}
              >
                <Camera size={24} color={Colors.primary} />
                <Text style={styles.imageButtonText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.imageButton} 
                onPress={() => pickImage('gallery')}
              >
                <ImageIcon size={24} color={Colors.primary} />
                <Text style={styles.imageButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity 
            style={styles.addNewButton} 
            onPress={() => setShowAddCategory(!showAddCategory)}
          >
            <Plus size={16} color={Colors.primary} />
            <Text style={styles.addNewText}>Add New</Text>
          </TouchableOpacity>
        </View>
        
        {showAddCategory && (
          <View style={styles.addNewContainer}>
            <TextInput
              style={styles.addNewInput}
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Enter new category name"
              placeholderTextColor={Colors.placeholder}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddNewCategory}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.pickerContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.pickerItem,
                category === cat.name && styles.pickerItemSelected,
              ]}
              onPress={() => setCategory(cat.name)}
            >
              <Text
                style={[
                  styles.pickerItemText,
                  category === cat.name && styles.pickerItemTextSelected,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Location *</Text>
          <TouchableOpacity 
            style={styles.addNewButton} 
            onPress={() => setShowAddLocation(!showAddLocation)}
          >
            <Plus size={16} color={Colors.primary} />
            <Text style={styles.addNewText}>Add New</Text>
          </TouchableOpacity>
        </View>
        
        {showAddLocation && (
          <View style={styles.addNewContainer}>
            <TextInput
              style={styles.addNewInput}
              value={newLocation}
              onChangeText={setNewLocation}
              placeholder="Enter new location name"
              placeholderTextColor={Colors.placeholder}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddNewLocation}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.pickerContainer}>
          {locations.map((loc) => (
            <TouchableOpacity
              key={loc.id}
              style={[
                styles.pickerItem,
                location === loc.name && styles.pickerItemSelected,
              ]}
              onPress={() => setLocation(loc.name)}
            >
              <Text
                style={[
                  styles.pickerItemText,
                  location === loc.name && styles.pickerItemTextSelected,
                ]}
              >
                {loc.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Enter quantity"
          placeholderTextColor={Colors.placeholder}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter item description"
          placeholderTextColor={Colors.placeholder}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Add Item"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          icon={<Barcode size={20} color="#fff" />}
        />
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={{ marginTop: 12 }}
        />
      </View>
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
  formGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addNewText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
  },
  addNewContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  addNewInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barcodeInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
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
  imageContainer: {
    marginTop: 8,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imageButtonText: {
    marginTop: 8,
    color: Colors.primary,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  removeImageButton: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeImageText: {
    color: '#fff',
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    marginRight: 8,
    marginBottom: 8,
  },
  pickerItemSelected: {
    backgroundColor: Colors.primary,
  },
  pickerItemText: {
    color: Colors.text,
  },
  pickerItemTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
  },
});