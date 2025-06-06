import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Tag, MapPin, Info, ChevronRight } from 'lucide-react-native';
import Logo from '@/components/Logo';

export default function SettingsScreen() {
  const router = useRouter();

  const settingsOptions = [
    {
      title: 'Categories',
      description: 'Manage item categories',
      icon: <Tag size={24} color={Colors.primary} />,
      onPress: () => router.push('/settings/categories'),
    },
    {
      title: 'Locations',
      description: 'Manage storage locations',
      icon: <MapPin size={24} color={Colors.primary} />,
      onPress: () => router.push('/settings/locations'),
    },
    {
      title: 'About',
      description: 'App information',
      icon: <Info size={24} color={Colors.primary} />,
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={option.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.optionIcon}>{option.icon}</View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <ChevronRight size={20} color={Colors.placeholder} />
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  optionsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.placeholder,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: Colors.placeholder,
  },
});