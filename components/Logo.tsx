import React from 'react';
import { View, StyleSheet, ViewStyle, Text, Image } from 'react-native';
import Colors from '@/constants/colors';

interface LogoProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  showText?: boolean;
}

export default function Logo({ size = 100, color = "#8A2BE2", style, showText = true }: LogoProps) {
  const logoSize = showText ? size * 0.7 : size;
  
  return (
    <View style={[styles.container, style]}>
      <Image 
        source={{ uri: 'https://i.imgur.com/Rl8Nt5j.png' }} 
        style={{ width: logoSize, height: logoSize }}
        resizeMode="contain"
      />
      
      {showText && (
        <Text style={[styles.scoutText, { color }]}>Scouts</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoutText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 4,
  },
});