import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Car, MapPin, Shield } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SignInScreen() {
  const { signInWithGoogle, loading } = useAuth();
  const { theme } = useTheme();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Logo */}
        <View style={styles.headerContainer}>
          <Text style={[styles.appName, { color: theme.primary.default }]}>
            Smart<Text style={{ color: theme.text.primary }}>Park</Text>
          </Text>
          <Text style={[styles.tagline, { color: theme.text.secondary }]}>
            Find parking spots effortlessly
          </Text>
        </View>

        {/* Feature carousel */}
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          <View style={[styles.featureSlide, { width: SCREEN_WIDTH - 40 }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: theme.primary.light }]}>
              <MapPin size={40} color={theme.primary.default} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.text.primary }]}>
              Find Nearby Parking
            </Text>
            <Text style={[styles.featureDescription, { color: theme.text.secondary }]}>
              Discover available parking spots near your location in real-time
            </Text>
          </View>
          
          <View style={[styles.featureSlide, { width: SCREEN_WIDTH - 40 }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: theme.secondary.light }]}>
              <Car size={40} color={theme.secondary.default} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.text.primary }]}>
              Smart Spot Selection
            </Text>
            <Text style={[styles.featureDescription, { color: theme.text.secondary }]}>
              Our algorithm finds the best parking spot based on your location
            </Text>
          </View>
          
          <View style={[styles.featureSlide, { width: SCREEN_WIDTH - 40 }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: theme.accent.light }]}>
              <Shield size={40} color={theme.accent.default} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.text.primary }]}>
              Secure Booking
            </Text>
            <Text style={[styles.featureDescription, { color: theme.text.secondary }]}>
              Book and pay for parking spots securely through our platform
            </Text>
          </View>
        </ScrollView>

        {/* Sign In Button */}
        <View style={styles.signInContainer}>
          <TouchableOpacity
            style={[styles.googleButton, { backgroundColor: theme.background.secondary }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} 
              style={styles.googleIcon} 
            />
            <Text style={[styles.googleButtonText, { color: theme.text.primary }]}>
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.termsText, { color: theme.text.tertiary }]}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  carousel: {
    marginVertical: 30,
  },
  featureSlide: {
    alignItems: 'center',
    padding: 20,
  },
  featureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  signInContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  termsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});