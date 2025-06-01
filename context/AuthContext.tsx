import { auth } from '@/services/firebase';
import { User } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import dotenv from 'dotenv';
import { router } from 'expo-router';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
// dotenv.config();


// Configure Google Sign In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load stored user:', error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)');
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
        router.replace('/(auth)/sign-in' as any);
      }
      setLoading(false);
    });

    loadStoredUser();
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
        try {
            // Check if device supports Google Play Services
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Sign in and get the result
            const signInResult = await GoogleSignin.signIn();

            // Extract idToken using both new and old result styles
            let idToken = signInResult?.data?.idToken;
            if (!idToken) {
            throw new Error('No ID token found');
            }

            // Create Firebase credential from idToken
            const credential = GoogleAuthProvider.credential(idToken);
            // Sign in with the credential using Firebase
            await signInWithCredential(auth, credential);
        } catch (error) {
            console.error('Google sign-in error:', error);
            throw error;
        }
    };


  const signOut = async () => {
    try {
      setLoading(true);
      await GoogleSignin.signOut();
      await auth.signOut();
      setUser(null);
      await AsyncStorage.removeItem('user');
      router.replace('/(auth)/sign-in' as any);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};