import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useInventoryStore } from '@/store/inventoryStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { Package, Barcode, Calendar, MapPin, Tag, User, ArrowLeft, SendToBack, RotateCcw } from 'lucide-react-native';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { items, updateItem, removeItem, returnItem } = useInventoryStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Item not found</Text>
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setIsDeleting(true);
            try {
              removeItem(item.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
              setIsDeleting(false);
            }
          }
        },
      ]
    );
  };

  const handleReturn = () => {
    Alert.alert(
      'Return Item',
      'Confirm that this item has been returned?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            setIsReturning(true);
            try {
              returnItem(item.id);
              Alert.alert('Success', 'Item marked as returned');
              setIsReturning(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to return item');
              setIsReturning(false);
            }
          }
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: item.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        {item.image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
          </View>
        )}
        
        <View style={styles.card}>
          <View style={styles.header}>
            <Package size={24} color={Colors.primary} />
            <Text style={styles.title}>{item.name}</Text>
            {item.isLent && (
              <View style={styles.lentBadge}>
                <Text style={styles.lentText}>Lent</Text>
              </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Barcode size={20} color={Colors.primary} />
              <Text style={styles.infoLabel}>Barcode:</Text>
              <Text style={styles.infoValue}>{item.barcode}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Tag size={20} color={Colors.primary} />
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{item.category}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{item.location}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Package size={20} color={Colors.primary} />
              <Text style={styles.infoLabel}>Quantity:</Text>
              <Text style={styles.infoValue}>{item.quantity}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.infoLabel}>Added:</Text>
              <Text style={styles.infoValue}>{formatDate(item.dateAdded)}</Text>
            </View>
          </View>

          {item.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}

          {item.isLent && item.lendingInfo && (
            <View style={styles.lendingSection}>
              <Text style={styles.sectionTitle}>Lending Information</Text>
              
              <View style={styles.infoRow}>
                <User size={20} color={Colors.primary} />
                <Text style={styles.infoLabel}>Borrower:</Text>
                <Text style={styles.infoValue}>{item.lendingInfo.borrower}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MapPin size={20} color={Colors.primary} />
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoValue}>{item.lendingInfo.location}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Calendar size={20} color={Colors.primary} />
                <Text style={styles.infoLabel}>Date Lent:</Text>
                <Text style={styles.infoValue}>{formatDate(item.lendingInfo.dateLent)}</Text>
              </View>
              
              {item.lendingInfo.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notes}>{item.lendingInfo.notes}</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.buttonContainer}>
            {item.isLent ? (
              <Button
                title="Mark as Returned"
                onPress={handleReturn}
                loading={isReturning}
                disabled={isReturning}
                icon={<RotateCcw size={20} color="#fff" />}
              />
            ) : (
              <Button
                title="Lend Item"
                onPress={() => router.push({
                  pathname: '/lend-item',
                  params: { itemId: item.id }
                })}
                icon={<SendToBack size={20} color="#fff" />}
              />
            )}
            
            <Button
              title="Delete Item"
              onPress={handleDelete}
              variant="outline"
              style={styles.deleteButton}
              textStyle={{ color: Colors.danger }}
              loading={isDeleting}
              disabled={isDeleting}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  backButton: {
    marginRight: 16,
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: 250,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  lentBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  lentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 10,
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  lendingSection: {
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  notesContainer: {
    marginTop: 12,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  notes: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 12,
    borderColor: Colors.danger,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.placeholder,
    marginBottom: 20,
  },
});