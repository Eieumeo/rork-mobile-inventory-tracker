import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { PlusCircle, SendToBack, Package, Barcode } from 'lucide-react-native';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import Logo from '@/components/Logo';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo size={180} color="#8A2BE2" style={styles.scoutLogo} />
        </View>
        
        <Text style={styles.title}>Inventory Tracker</Text>
        <Text style={styles.subtitle}>Manage your items with ease</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Add Item"
          onPress={() => router.push('/add-item')}
          style={styles.button}
          icon={<PlusCircle size={20} color="#fff" />}
        />
        
        <Button
          title="Lend Item"
          onPress={() => router.push('/lend-item')}
          style={styles.button}
          variant="secondary"
          icon={<SendToBack size={20} color="#fff" />}
        />
        
        <Button
          title="Scan Barcode"
          onPress={() => router.push('/scan')}
          style={styles.button}
          variant="secondary"
          icon={<Barcode size={20} color="#fff" />}
        />
        
        <Button
          title="View Inventory"
          onPress={() => router.push('/inventory')}
          style={styles.button}
          variant="outline"
          icon={<Package size={20} color={Colors.primary} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoutLogo: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.placeholder,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});