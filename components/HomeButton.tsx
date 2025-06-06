import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Home } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface HomeButtonProps {
  light?: boolean;
}

export default function HomeButton({ light = false }: HomeButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={[styles.button, light && styles.lightButton]} 
      onPress={() => router.push('/')}
      activeOpacity={0.7}
    >
      <Home size={24} color={light ? '#fff' : Colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 15,
  },
  lightButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 22,
    padding: 10,
  },
});