import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const AuthScreen = ({ onLogin, onBack, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const heartsAnimation = useRef(new Animated.Value(0)).current;
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const signupButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo rotation animation
    Animated.loop(
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // Floating hearts animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartsAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(heartsAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBack = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(backButtonScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(backButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    if (onBack) {
      onBack();
    }
  };

  const handleSignup = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(signupButtonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(signupButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    if (onNavigateToSignup) {
      onNavigateToSignup();
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      // Cute shake animation for empty fields
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      Alert.alert('Oops! ☕️', 'Please fill in all fields to continue your coffee journey!');
      return;
    }

    setIsLoading(true);
    
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (onLogin) {
        await onLogin(`token_${email}_${Date.now()}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Oops! ☕️', 'Something went wrong. Let\'s try that again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (onLogin) {
        await onLogin('guest_token');
      }
    } catch (error) {
      console.error('Guest login error:', error);
      Alert.alert('Oops! ☕️', 'Something went wrong. Let\'s try that again!');
    } finally {
      setIsLoading(false);
    }
  };

  const logoRotate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const heartsOpacity = heartsAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const heartsTranslateY = heartsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F0" />
      
      {/* Back Button */}
      <Animated.View style={[styles.backButtonContainer, { transform: [{ scale: backButtonScale }] }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonArrow}>←</Text>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Floating Background Elements */}
      <View style={styles.backgroundDecorations}>
        <Animated.View style={[styles.floatingHeart, { opacity: heartsOpacity, transform: [{ translateY: heartsTranslateY }] }]}>
          <Text style={styles.heartEmoji}>☕️</Text>
        </Animated.View>
        <Animated.View style={[styles.floatingHeart2, { opacity: heartsOpacity, transform: [{ translateY: heartsTranslateY }] }]}>
          <Text style={styles.heartEmoji}>🤎</Text>
        </Animated.View>
        <Animated.View style={[styles.floatingHeart3, { opacity: heartsOpacity, transform: [{ translateY: heartsTranslateY }] }]}>
          <Text style={styles.heartEmoji}>✨</Text>
        </Animated.View>
      </View>

      <Animated.View style={[
        styles.mainContainer,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim }
          ]
        }
      ]}>
        
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View style={[styles.logoContainer, { transform: [{ rotate: logoRotate }] }]}>
            <View style={styles.logo} />
          </Animated.View>
          <Text style={styles.appName}>CoffeeBrew</Text>
          <View style={styles.sparkles}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.sparkle}>✨</Text>
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome Back! ☕️</Text>
          <Text style={styles.subtitle}>Let's brew something amazing together</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputEmoji}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="Your email address"
                placeholderTextColor="#B8A994"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputEmoji}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Your password"
                placeholderTextColor="#B8A994"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? '☕️ Brewing...' : '✨ Sign In ✨'}
            </Text>
          </TouchableOpacity>

          {/* Guest Login Button */}
          <TouchableOpacity
            style={[styles.guestButton, isLoading && styles.buttonDisabled]}
            onPress={handleGuestLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.guestButtonText}>🚀 Continue as Guest</Text>
          </TouchableOpacity>
        </View>

        {/* Signup Section */}
        <View style={styles.signupSection}>
          <Text style={styles.footerText}>
            New here? Join our cozy coffee community! 🤗
          </Text>
          <Animated.View style={{ transform: [{ scale: signupButtonScale }] }}>
            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>🌟 Create Account</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.1)',
  },
  backButtonArrow: {
    fontSize: 18,
    color: '#8B4513',
    fontWeight: '600',
    marginRight: 4,
  },
  backButtonText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
  },
  backgroundDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingHeart: {
    position: 'absolute',
    top: height * 0.15,
    left: width * 0.1,
  },
  floatingHeart2: {
    position: 'absolute',
    top: height * 0.25,
    right: width * 0.15,
  },
  floatingHeart3: {
    position: 'absolute',
    top: height * 0.7,
    left: width * 0.2,
  },
  heartEmoji: {
    fontSize: 24,
    opacity: 0.6,
  },
  mainContainer: {
    width: width * 0.9,
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.08)',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF8F0',
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#4A3728',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  sparkles: {
    flexDirection: 'row',
    gap: 8,
  },
  sparkle: {
    fontSize: 12,
    opacity: 0.7,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4A3728',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
    fontWeight: '500',
  },
  formSection: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCFA',
    borderWidth: 2,
    borderColor: 'rgba(139, 69, 19, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#4A3728',
    paddingVertical: 12,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#8B4513',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D2B48C',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  guestButtonText: {
    color: '#8B4513',
    fontSize: 15,
    fontWeight: '600',
  },
  signupSection: {
    width: '100%',
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#D2691E',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#D2691E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  footerText: {
    fontSize: 13,
    color: '#A0937A',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 18,
  },
});