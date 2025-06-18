import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../app/screens/SplashScreen';
import Onboarding from '../app/screens/onboarding/Onboarding';
import HomeScreen from '../app/screens/homescreen/HomeScreen';
import AuthScreen from '../app/screens/authentication/AuthScreen';
import SignupScreen from '../app/screens/authentication/SignupScreen';

const Stack = createNativeStackNavigator();

// Storage keys as constants to prevent typos
const STORAGE_KEYS = {
  ONBOARDED: 'onboarded',
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  // Memoized function to check storage
  const checkStorage = useCallback(async () => {
    try {
      const [onboarded, userToken, storedUserData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED),
        AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      setIsOnboarded(!!onboarded);
      setIsAuthenticated(!!userToken);
      
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error('Storage check failed:', error);
      // Reset states on error
      setIsOnboarded(false);
      setIsAuthenticated(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStorage();
  }, [checkStorage]);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleOnboardingComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
      setIsOnboarded(true);
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  }, []);

  const handleSignup = useCallback(async (signupData) => {
    try {
      // Process signup data (email, password, etc.)
      const { email, password, signupMethod } = signupData;
      
      // Generate a token (in real app, this would come from your API)
      const token = `signup_token_${Date.now()}`;
      
      // Create user data object
      const newUserData = {
        email,
        signupMethod,
        joinDate: new Date().toISOString(),
        id: Date.now().toString(),
      };

      // Save to storage and update state
      const promises = [
        AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUserData)),
      ];

      await Promise.all(promises);
      
      setUserData(newUserData);
      setIsAuthenticated(true);
      setShowSignup(false);
    } catch (error) {
      console.error('Error during signup:', error);
      throw error; // Let the signup screen handle the error
    }
  }, []);

  const handleNavigateToSignup = useCallback(() => {
    setShowSignup(true);
  }, []);

  const handleBackFromSignup = useCallback(() => {
    setShowSignup(false);
  }, []);
  const handleLogin = useCallback(async (token = 'default_token', user = null) => {
    try {
      const promises = [
        AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token),
      ];

      if (user) {
        promises.push(
          AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
        );
        setUserData(user);
      }

      await Promise.all(promises);
      setIsAuthenticated(true);
      setShowSignup(false); // Ensure signup is hidden after login
    } catch (error) {
      console.error('Error saving login state:', error);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
      setIsAuthenticated(false);
      setUserData(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  const handleBackToOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDED);
      setIsOnboarded(false);
    } catch (error) {
      console.error('Error going back to onboarding:', error);
    }
  }, []);

  const handleRestart = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ONBOARDED,
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      
      setIsOnboarded(false);
      setIsAuthenticated(false);
      setUserData(null);
      setShowSplash(true);
      setShowSignup(false);
    } catch (error) {
      console.error('Error restarting app:', error);
    }
  }, []);

  const handleProfileUpdate = useCallback(async (updatedUserData) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA, 
        JSON.stringify(updatedUserData)
      );
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }, []);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show loading indicator while checking storage
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      {!isOnboarded ? (
        <Stack.Screen 
          name="Onboarding"
          options={{
            gestureEnabled: false, // Prevent swipe back from onboarding
          }}
        >
          {(props) => (
            <Onboarding
              {...props}
              onComplete={handleOnboardingComplete}
            />
          )}
        </Stack.Screen>
      ) : !isAuthenticated ? (
        <>
          {showSignup ? (
            <Stack.Screen 
              name="Signup"
              options={{
                animation: 'slide_from_right',
              }}
>
              {(props) => (
                <SignupScreen
                  {...props}
                  navigation={props.navigation}
                  onBack={handleBackFromSignup}
                  onSignup={handleSignup}
                  onNavigateToProfile={handleSignup} // For social logins that go directly to profile
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen 
              name="Auth"
              options={{
                animation: 'fade',
              }}
>
              {(props) => (
                <AuthScreen
                  {...props}
                  navigation={props.navigation}
                  onLogin={handleLogin}
                  onNavigateToSignup={handleNavigateToSignup}
                  onBack={handleBackToOnboarding}
                  userData={userData}
                />
              )}
            </Stack.Screen>
          )}
        </>
      ) : (
        <Stack.Screen 
          name="Home"
          options={{
            gestureEnabled: false, // Prevent swipe back from home
          }}
        >
          {(props) => (
            <HomeScreen
              {...props}
              onRestart={handleRestart}
              onLogout={handleLogout}
              userData={userData}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
});

export default App;
