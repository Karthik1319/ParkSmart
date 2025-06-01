import { useTheme } from '@/context/ThemeContext';
import { Bell, CreditCard, Globe, HelpCircle, Lock, MapPin, Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SettingItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'switch' | 'button';
  value?: boolean; // optional for 'button' type
  onValueChange?: () => void;
  onPress?: () => void;
};

type SettingSection = {
  title: string;
  settings: SettingItem[];
};

export default function SettingsScreen() {
  const { theme, mode, setMode, isDark } = useTheme();
  
  // List of settings options
  const settingsSections: SettingSection[] = [
    {
      title: 'Appearance',
      settings: [
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          description: 'Switch between light and dark theme',
          icon: isDark ? <Moon size={22} color={theme.primary.default} /> : <Sun size={22} color={theme.primary.default} />,
          type: 'switch',
          value: isDark,
          onValueChange: () => setMode(isDark ? 'light' : 'dark'),
        },
        {
          id: 'system-theme',
          title: 'Use System Theme',
          description: 'Automatically match your device theme',
          icon: <Globe size={22} color={theme.primary.default} />,
          type: 'switch',
          value: mode === 'system',
          onValueChange: () => setMode(mode === 'system' ? (isDark ? 'dark' : 'light') : 'system'),
        },
      ],
    },
    {
      title: 'Notifications',
      settings: [
        {
          id: 'push-notifications',
          title: 'Push Notifications',
          description: 'Receive alerts for bookings and updates',
          icon: <Bell size={22} color={theme.primary.default} />,
          type: 'switch',
          value: true,
          onValueChange: () => {},
        },
        {
          id: 'location-alerts',
          title: 'Location Alerts',
          description: 'Get notified when near available parking',
          icon: <MapPin size={22} color={theme.primary.default} />,
          type: 'switch',
          value: false,
          onValueChange: () => {},
        },
      ],
    },
    {
      title: 'Privacy',
      settings: [
        {
          id: 'location-services',
          title: 'Location Services',
          description: 'Allow app to access your location',
          icon: <MapPin size={22} color={theme.primary.default} />,
          type: 'switch',
          value: true,
          onValueChange: () => {},
        },
        {
          id: 'data-collection',
          title: 'Data Collection',
          description: 'Allow anonymous usage data collection',
          icon: <Lock size={22} color={theme.primary.default} />,
          type: 'switch',
          value: true,
          onValueChange: () => {},
        },
      ],
    },
    {
      title: 'Payment',
      settings: [
        {
          id: 'payment-methods',
          title: 'Payment Methods',
          description: 'Manage your payment options',
          icon: <CreditCard size={22} color={theme.primary.default} />,
          type: 'button',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Support',
      settings: [
        {
          id: 'help-center',
          title: 'Help Center',
          description: 'View FAQs and contact support',
          icon: <HelpCircle size={22} color={theme.primary.default} />,
          type: 'button',
          onPress: () => {},
        },
      ],
    },
  ];
  
  // Render a settings item
  const renderSettingItem = (item: SettingItem) => {
    return (
      <View 
        key={item.id}
        style={[
          styles.settingItem, 
          { borderBottomColor: theme.border }
        ]}
      >
        <View style={styles.settingIconContainer}>
          {item.icon}
        </View>
        
        <View style={styles.settingContent}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, { color: theme.text.primary }]}>
              {item.title}
            </Text>
            <Text style={[styles.settingDescription, { color: theme.text.secondary }]}>
              {item.description}
            </Text>
          </View>
          
          {item.type === 'switch' ? (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ 
                false: theme.neutral[300], 
                true: theme.primary.default 
              }}
              thumbColor={theme.background.primary}
            />
          ) : (
            <TouchableOpacity 
              style={[styles.settingButton, { backgroundColor: theme.primary.default }]}
              onPress={item.onPress}
            >
              <Text style={[styles.settingButtonText, { color: theme.text.inverse }]}>
                Manage
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
            Settings
          </Text>
        </View>
        
        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.settingSection}>
            <Text style={[styles.sectionTitle, { color: theme.primary.default }]}>
              {section.title}
            </Text>
            
            <View style={[styles.sectionContent, { backgroundColor: theme.background.secondary }]}>
              {section.settings.map(renderSettingItem)}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  settingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 8,
  },
  sectionContent: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  settingButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  settingButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});