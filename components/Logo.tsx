import React from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
      <Svg width={logoSize} height={logoSize} viewBox="0 0 24 24" fill="none">
        {/* Center fleur */}
        <Path
          d="M12 2C12 2 13.5 5 13.5 8C13.5 11 12.5 13 12 14C11.5 13 10.5 11 10.5 8C10.5 5 12 2 12 2Z"
          fill={color}
        />
        
        {/* Left fleur */}
        <Path
          d="M6 8C6 8 4 10 4 12C4 14 5 16 6 17C7 16 8 14 8 12C8 10 6 8 6 8Z"
          fill={color}
        />
        
        {/* Right fleur */}
        <Path
          d="M18 8C18 8 20 10 20 12C20 14 19 16 18 17C17 16 16 14 16 12C16 10 18 8 18 8Z"
          fill={color}
        />
        
        {/* Horizontal bar */}
        <Path
          d="M7 16H17V18H7V16Z"
          fill={color}
        />
        
        {/* Bottom fleur */}
        <Path
          d="M12 18C12 18 10 19 10 20C10 21 11 22 12 22C13 22 14 21 14 20C14 19 12 18 12 18Z"
          fill={color}
        />
      </Svg>
      
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