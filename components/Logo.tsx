import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Colors from '@/constants/colors';

interface LogoProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function Logo({ size = 100, color = "#8A2BE2", style }: LogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 1000 1000" fill="none">
        {/* Center fleur */}
        <Path
          d="M500 0C500 0 600 150 600 300C600 450 550 550 500 600C450 550 400 450 400 300C400 150 500 0 500 0Z"
          fill={color}
        />
        
        {/* Left fleur */}
        <Path
          d="M200 300C200 300 100 400 100 500C100 600 150 700 200 750C250 700 300 600 300 500C300 400 200 300 200 300Z"
          fill={color}
        />
        
        {/* Right fleur */}
        <Path
          d="M800 300C800 300 900 400 900 500C900 600 850 700 800 750C750 700 700 600 700 500C700 400 800 300 800 300Z"
          fill={color}
        />
        
        {/* Horizontal bar */}
        <Path
          d="M250 700H750V800H250V700Z"
          fill={color}
        />
        
        {/* Bottom fleur */}
        <Path
          d="M500 800C500 800 400 850 400 900C400 950 450 1000 500 1000C550 1000 600 950 600 900C600 850 500 800 500 800Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});