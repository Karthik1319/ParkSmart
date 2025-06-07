import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Bell, CreditCard, Edit, HelpCircle, LogOut, Shield } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  React.useEffect(() => {
    if (!user) {
      router.replace('/sign-in' as any);  // Use path to your sign-in screen
    }
  }, [user]);

  if (!user) return null;
  
  const profileOptions = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: <Edit size={20} color={theme.primary.default} />,
      onPress: () => {},
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: <CreditCard size={20} color={theme.primary.default} />,
      onPress: () => {},
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell size={20} color={theme.primary.default} />,
      onPress: () => {},
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <Shield size={20} color={theme.primary.default} />,
      onPress: () => {},
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: <HelpCircle size={20} color={theme.primary.default} />,
      onPress: () => {},
    }
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]} edges={['top']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingBottom: 100}}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
            Profile
          </Text>
        </View>
        
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.background.secondary }]}>
          <Image 
            source={{ uri: user.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg' }} 
            style={styles.profileImage}
          />
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text.primary }]}>
              {user.displayName}
            </Text>
            <Text style={[styles.profileEmail, { color: theme.text.secondary }]}>
              {user.email}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: theme.background.tertiary }]}
            onPress={() => {}}
          >
            <Edit size={18} color={theme.text.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Options Section */}
        <View style={[styles.optionsSection, { backgroundColor: theme.background.secondary }]}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                index < profileOptions.length - 1 && styles.optionWithBorder,
                index < profileOptions.length - 1 && { borderBottomColor: theme.border }
              ]}
              onPress={option.onPress}
            >
              <View style={styles.optionIconContainer}>
                {option.icon}
              </View>
              
              <Text style={[styles.optionText, { color: theme.text.primary }]}>
                {option.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: theme.error.default }]}
          onPress={signOut}
        >
          <LogOut size={20} color={theme.text.inverse} />
          <Text style={[styles.signOutText, { color: theme.text.inverse }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
        
        {/* App Version */}
        <Text style={[styles.versionText, { color: theme.text.tertiary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  profileSection: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsSection: {
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionWithBorder: {
    borderBottomWidth: 1,
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  signOutButton: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signOutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});