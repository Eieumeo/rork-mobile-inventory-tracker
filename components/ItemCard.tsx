import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Item } from '@/types/inventory';
import Colors from '@/constants/colors';
import { Package, MapPin, Tag } from 'lucide-react-native';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/item/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {item.image && (
          <Image 
            source={{ uri: item.image }} 
            style={styles.thumbnail} 
            resizeMode="cover"
          />
        )}
        
        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{item.name}</Text>
            {item.isLent && (
              <View style={styles.lentBadge}>
                <Text style={styles.lentText}>Lent</Text>
              </View>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Tag size={16} color={Colors.primary} />
            <Text style={styles.infoText}>{item.category}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MapPin size={16} color={Colors.primary} />
            <Text style={styles.infoText}>
              {item.isLent ? item.lendingInfo?.location : item.location}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Package size={16} color={Colors.primary} />
            <Text style={styles.infoText}>Qty: {item.quantity}</Text>
          </View>
          
          {item.isLent && (
            <View style={styles.lentInfo}>
              <Text style={styles.borrowerText}>
                Borrowed by: {item.lendingInfo?.borrower}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  lentBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  lentInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  borrowerText: {
    fontSize: 14,
    color: Colors.text,
    fontStyle: 'italic',
  },
});