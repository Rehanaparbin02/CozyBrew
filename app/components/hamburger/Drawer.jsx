import React from 'react';
import { Animated, Dimensions, StyleSheet, TouchableWithoutFeedback, View, Text, TouchableOpacity } from 'react-native';
import HamburgerMenu from './HamburgerMenu';

const { width, height } = Dimensions.get('window');

const MenuIcon = ({ name, size = 20 }) => {
  const icons = {
    home: '🏠',
    coffee: '☕',
    desserts: '🧁',
    favorites: '❤️',
    tomake: '📝',
    profile: '👤',
    settings: '⚙️',
    logout: '🚪'
  };
  
  return (
    <Text style={{ fontSize: size, marginRight: 12, opacity: 0.9 }}>
      {icons[name] || '•'}
    </Text>
  );
};

const MenuItem = ({ icon, title, isLogout = false, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.85,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const glowBackgroundColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(248, 244, 240, 0.05)', 'rgba(248, 244, 240, 0.15)']
  });

 
  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={[
        styles.menuItemContainer,
        isLogout && styles.logoutContainer,
        { 
          transform: [{ scale: scaleAnim }],
          backgroundColor: glowBackgroundColor
        }
      ]}>
        <MenuIcon name={icon} size={20} />
        <Text style={[
          styles.menuItem,
          isLogout && styles.logoutItem
        ]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const Drawer = ({ visible, onClose, navigation }) => {
  const translateX = React.useRef(new Animated.Value(width * 0.56)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const [shouldRender, setShouldRender] = React.useState(visible);

 const handleLogOut = () => {
  onClose(); // Close the drawer first
  navigation.reset({
    index: 0,
    routes: [{ name: 'AuthScreen' }],
  });
};


  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: width * 0.56,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  const menuItems = [
    { icon: 'home', title: 'Home' },
    { icon: 'coffee', title: 'Coffee' },
    { icon: 'desserts', title: 'Desserts' },
    { icon: 'favorites', title: 'Favorites' },
    { icon: 'tomake', title: 'To-Make' },
  ];

  const profileItems = [
    { icon: 'profile', title: 'Profile' },
    { icon: 'settings', title: 'Settings' },
  ];

  return (
    <View style={styles.overlay}>
      <Animated.View style={[
        styles.drawer,
        { 
          transform: [
            { translateX },
            { scale: scaleAnim }
          ],
          opacity: fadeAnim
        }
      ]}>
        {/* Close Button */}
        <View style={styles.menuButtonContainer}>
          <HamburgerMenu toggled={visible} setToggled={onClose} />
        </View>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandText}>☕ Menu</Text>
          <View style={styles.brandUnderline} />
        </View>
        
        {/* Menu Content */}
        <View style={styles.menuContent}>
          {/* Main Menu Items */}
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              onPress={() => console.log(`Navigate to ${item.title}`)}
            />
          ))}
          
          <View style={styles.sectionDivider} />
          
          {/* Profile Section */}
          {profileItems.map((item) => (
            <MenuItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              onPress={() => console.log(`Navigate to ${item.title}`)}
            />
          ))}
          
          <View style={styles.sectionDivider} />
          
          {/* Logout */}
          <MenuItem
            icon="logout"
            title="Logout"
            isLogout={true}
            onPress={handleLogOut}
          />
        </View>
      </Animated.View>
      
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[
          styles.backdrop, 
          { 
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.4]
            })
          }
        ]} />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    right: 110,
    top: height * 0.001,
    width: width * 0.65,
    height: height * 0.96,
    backgroundColor: '#4A3728',
    padding: 15,
    paddingTop: 70,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 6, height: 0 },
    shadowRadius: 15,
    zIndex: 101,
    borderRadius: 50,
    // Add gradient-like effect with inner shadow
    borderWidth: 1,
    borderColor: 'rgba(248, 244, 240, 0.1)',
  },
  menuButtonContainer: {
    position: 'absolute',
    top: 8,
    right: 14,
    zIndex: 102,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(248, 244, 240, 0.2)',
  },
  brandText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8F4F0',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  brandUnderline: {
    width: 40,
    height: 2,
    backgroundColor: '#D2691E',
    marginTop: 8,
    borderRadius: 1,
  },
  menuContent: {
    flex: 1,
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(248, 244, 240, 0.1)',
  },
  logoutContainer: {
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    borderColor: 'rgba(220, 20, 60, 0.3)',
    marginTop: 15,
  },
  menuItem: {
    fontSize: 16,
    color: '#F8F4F0',
    fontWeight: '500',
    flex: 1,
    letterSpacing: 0.5,
  },
  logoutItem: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(248, 244, 240, 0.2)',
    marginVertical: 20,
    marginHorizontal: 20,
  },
});

export default Drawer;