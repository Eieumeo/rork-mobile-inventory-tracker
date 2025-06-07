import React from 'react';
import { View, StyleSheet, ViewStyle, Image } from 'react-native';
import Colors from '@/constants/colors';

interface LogoProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  showText?: boolean;
}

export default function Logo({ size = 100, color = "#8A2BE2", style, showText = false }: LogoProps) {
  const logoSize = size;
  
  return (
    <View style={[styles.container, style]}>
      <Image 
        source={{ uri: 'https://www.dorsetscouts.org.uk/wp-content/uploads/Scouts-Logo.png' }} 
        style={{ width: logoSize, height: logoSize }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});