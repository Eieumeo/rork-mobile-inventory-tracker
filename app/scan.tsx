import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { useInventoryStore } from '@/store/inventoryStore';
import Colors from '@/constants/colors';
import { Camera, RotateCw, X } from 'lucide-react-native';

export default function ScanScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const { getItemByBarcode } = useInventoryStore();

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    // Check if the barcode exists in inventory
    const existingItem = getItemByBarcode(data);
    
    if (returnTo === 'lend-item') {
      if (existingItem) {
        if (existingItem.isLent) {
          Alert.alert(
            'Item Already Lent',
            `${existingItem.name} is currently lent to ${existingItem.lendingInfo?.borrower}.`,
            [{ text: 'OK', onPress: () => setScanned(false) }]
          );
        } else {
          router.push({
            pathname: '/lend-item',
            params: { itemId: existingItem.id }
          });
        }
      } else {
        Alert.alert(
          'Item Not Found',
          'No item with this barcode exists in your inventory.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } else {
      // For add-item flow or general scan
      if (existingItem) {
        Alert.alert(
          'Item Found',
          `This barcode belongs to "${existingItem.name}"`,
          [
            { 
              text: 'View Item', 
              onPress: () => router.push({
                pathname: `/item/${existingItem.id}`
              })
            },
            { 
              text: 'Scan Again', 
              onPress: () => setScanned(false) 
            }
          ]
        );
      } else {
        Alert.alert(
          'New Item',
          'This barcode is not in your inventory. Would you like to add it?',
          [
            { 
              text: 'Add Item', 
              onPress: () => router.push({
                pathname: '/add-item',
                params: { barcode: data }
              })
            },
            { 
              text: 'Scan Again', 
              onPress: () => setScanned(false) 
            }
          ]
        );
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Camera size={64} color={Colors.primary} />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          We need camera permission to scan barcodes. Please grant permission to continue.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_e', 'upc_a', 'code39', 'code128', 'qr'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <RotateCw size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Position the barcode within the frame to scan
            </Text>
          </View>
        </CameraView>
      ) : (
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackText}>
            Barcode scanning is not fully supported on web.
            Please use a mobile device for the best experience.
          </Text>
          <TouchableOpacity 
            style={styles.webFallbackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.webFallbackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: Colors.text,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.placeholder,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  webFallbackText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.text,
  },
  webFallbackButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  webFallbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});