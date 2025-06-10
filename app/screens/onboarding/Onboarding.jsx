import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Slides from './Slides';
import OnboardingItem from './OnboardingItems';
import NextButton from './NextButton';
import CozyAlert from '../../components/common/CozyAlert';

const { width, height } = Dimensions.get('window');

const Onboarding = ({ navigation, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cozyAlertVisible, setCozyAlertVisible] = useState(false);
  const [cozyAlertProps, setCozyAlertProps] = useState({});

  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  useEffect(() => {
    const opacity = currentIndex === 0 ? 1 : 0.8;
    Animated.timing(headerOpacity, {
      toValue: opacity,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const scrollTo = () => {
    if (currentIndex < Slides.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // When on last slide, complete onboarding
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCozyAlertProps({
        title: "Welcome to CoffeeBrew!",
        message: "You're all set to start your coffee journey!",
        confirmText: "Let's Brew!",
        cozyEmoji: "☕️",
        onConfirm: () => {
          setCozyAlertVisible(false);
          // Complete onboarding and navigate to auth
          if (onComplete) {
            onComplete();
          }
        },
        showCancel: false,
      });
      setCozyAlertVisible(true);
    });
  };

  const skipOnboarding = () => {
    setCozyAlertProps({
      title: "Skip Onboarding",
      message: "Are you sure you want to skip the introduction?",
      cancelText: "Cancel",
      confirmText: "Skip",
      cozyEmoji: "🚀",
      onConfirm: () => {
        setCozyAlertVisible(false);
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          slidesRef.current?.scrollToIndex({ index: Slides.length - 1 });
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        });
      },
      onCancel: () => {
        setCozyAlertVisible(false);
      },
      showCancel: true,
    });
    setCozyAlertVisible(true);
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F0" translucent={false} />
      <View style={styles.backgroundPattern} />
      <View style={styles.backgroundGradient} />

      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logo} />
          <Text style={styles.brandText}>CoffeeBrew</Text>
        </View>
      </Animated.View>

      <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList
          data={Slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfig}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          ref={slidesRef}
          decelerationRate="fast"
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </Animated.View>

      <View style={styles.bottomArea}>
        <View style={styles.pagination}>
          {Slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 32, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={i.toString()}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: i === currentIndex ? '#8B4513' : '#D2B48C',
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      <NextButton
        percentage={(currentIndex + 1) * (100 / Slides.length)}
        onPress={scrollTo}
        isLastSlide={currentIndex === Slides.length - 1}
      />

      <CozyAlert
        visible={cozyAlertVisible}
        onClose={() => setCozyAlertVisible(false)}
        {...cozyAlertProps}
      />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    opacity: 0.03,
    backgroundColor: '#8B4513',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    opacity: 0.5,
  },
  header: {
    paddingTop: 40,
    paddingBottom: -40,
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8B4513',
    marginRight: 10,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A3728',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    bottom: 45,
    left: 30,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.1)',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipText: {
    color: '#8B4513',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomArea: {
    paddingBottom: 130,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});