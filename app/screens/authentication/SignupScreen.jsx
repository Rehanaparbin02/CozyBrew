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
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SignupScreen = ({ onBack, onSignup, onNavigateToProfile }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const heartsAnimation = useRef(new Animated.Value(0)).current;
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const socialButtonScale = useRef(new Animated.Value(1)).current;

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
    Animated.sequence([
      Animated.timing(backButtonScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(backButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    if (onBack) {
      onBack();
    }
  };

  const handleEmailSignup = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
      Alert.alert('Oops! ☕️', 'Please fill in all fields to join our coffee community!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch ☕️', 'Passwords don\'t match. Please try again!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password ☕️', 'Password should be at least 6 characters long!');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const userData = {
        email,
        signupMethod: 'email',
        timestamp: Date.now()
      };
      
      if (onNavigateToProfile) {
        onNavigateToProfile(userData);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Oops! ☕️', 'Something went wrong. Let\'s try that again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    Animated.sequence([
      Animated.timing(socialButtonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(socialButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const userData = {
        email: `user@${provider}.com`,
        signupMethod: provider,
        timestamp: Date.now()
      };
      
      if (onNavigateToProfile) {
        onNavigateToProfile(userData);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      Alert.alert('Oops! ☕️', `${provider} login failed. Please try again!`);
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
          <Text style={styles.heartEmoji}>🌟</Text>
        </Animated.View>
        <Animated.View style={[styles.floatingHeart3, { opacity: heartsOpacity, transform: [{ translateY: heartsTranslateY }] }]}>
          <Text style={styles.heartEmoji}>✨</Text>
        </Animated.View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.title}>Join Our Community! 🌟</Text>
            <Text style={styles.subtitle}>Create your account and start your coffee journey</Text>
          </View>

          {/* Social Login Section */}
          <View style={styles.socialSection}>
            <Text style={styles.socialTitle}>Quick Sign Up</Text>
            
            <Animated.View style={{ transform: [{ scale: socialButtonScale }] }}>   
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton, isLoading && styles.buttonDisabled]}
                onPress={() => handleSocialLogin('google')}
                disabled={isLoading}
                activeOpacity={0.8}  
              >
                <Text style={styles.socialButtonEmoji}>🇬</Text>
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: socialButtonScale }] }}>
              <TouchableOpacity
                style={[styles.socialButton, styles.facebookButton, isLoading && styles.buttonDisabled]}
                onPress={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.socialButtonEmoji}>📘</Text>
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Signup Form */}
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
                  placeholder="Create password"
                  placeholderTextColor="#B8A994"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputEmoji}>🔐</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#B8A994"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.buttonDisabled]}
              onPress={handleEmailSignup}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? '☕️ Brewing your account...' : '🚀 Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms and Privacy */}
          <View style={styles.termsSection}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Login Link */}
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <TouchableOpacity onPress={onBack}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Text>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  backgroundDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingHeart: {
    position: 'absolute',
    top: height * 0.15,
    left: width * 0.1,
  },
  floatingHeart2: {
    position: 'absolute',
    top: height * 0.3,
    right: width * 0.15,
  },
  floatingHeart3: {
    position: 'absolute',
    top: height * 0.6,
    left: width * 0.2,
  },
  heartEmoji: {
    fontSize: 24,
    opacity: 0.6,
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
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonArrow: {
    fontSize: 18,
    color: '#8B4513',
    marginRight: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    zIndex: 1,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 15,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#D4A574',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#8B4513',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 5,
  },
  sparkles: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    fontSize: 14,
    marginHorizontal: 3,
    opacity: 0.8,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0744B',
    textAlign: 'center',
    lineHeight: 22,
  },
  socialSection: {
    marginBottom: 25,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 12,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0E6D6',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  facebookButton: {
    backgroundColor: '#F8F9FA',
  },
  socialButtonEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D4A574',
    opacity: 0.3,
  },
  dividerText: {
    fontSize: 14,
    color: '#A0744B',
    marginHorizontal: 15,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 25,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0E6D6',
  },
  inputEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#8B4513',
    paddingVertical: 15,
  },
  signupButton: {
    backgroundColor: '#D4A574',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  termsSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 13,
    color: '#A0744B',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#8B4513',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loginSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#A0744B',
    textAlign: 'center',
  },
  loginLink: {
    color: '#8B4513',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;