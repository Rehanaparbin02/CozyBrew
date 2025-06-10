import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import CozyAlert from '../../components/common/CozyAlert';
import HamburgerMenu from '../../components/hamburger/HamburgerMenu';
import SearchBar from '../../components/common/SearchBar';
import Drawer from '../../components/hamburger/Drawer';

const HomeScreen = ({ onRestart }) => {
  const [alertVisible, setAlertVisible] = useState(false);

  const handleRestart = async () => {
    try {
      setAlertVisible(false);
      if (onRestart) {
        await onRestart();
      }
    } catch (error) {
      console.error('Error restarting app:', error);
      setAlertVisible(false);
      Alert.alert('Error', 'Failed to restart the app. Please try again.');
    }
  };

   const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.hamburgerWrapper}>
          <HamburgerMenu toggled={drawerVisible} setToggled={setDrawerVisible} />
        </View>
        <View style={styles.searchWrapper}>
          <SearchBar />
          <Drawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
        </View>
      </View>

            
      <Text style={styles.title}>Welcome to CoffeeBrew!</Text>

      <TouchableOpacity
        style={styles.restartButton}
        onPress={() => setAlertVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.restartButtonText}>🔄 Restart Onboarding</Text>
      </TouchableOpacity>

      <CozyAlert
        visible={alertVisible}
        title="Restart Onboarding"
        message="This will reset the app and take you back to the onboarding flow. Are you sure?"
        cancelText="Cancel"
        confirmText="Restart"
        cozyEmoji="☕️"
        showCancel={true}
        onClose={() => setAlertVisible(false)}
        onCancel={() => setAlertVisible(false)}
        onConfirm={handleRestart}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 20,
  },
  headerRow: {
    position: 'absolute',
    top: 15,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // optional, for clean spacing
  },

  hamburgerWrapper: {
    width: 50, // fixed width for menu
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchWrapper: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A3728',
    marginBottom: 10,
    textAlign: 'center',
    position: 'absolute',
    top: 150,
    left: 20,
    right: 20,
  },
  restartButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
