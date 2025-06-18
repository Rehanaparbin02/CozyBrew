
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Svg, { G, Circle } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';

const NextButton = ({ percentage = 60, onPress, isLastSlide = false }) => {
  const size = 68;
  const strokeWidth = 4;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const strokeDashoffset = useRef(new Animated.Value(circumference)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const progress = (percentage * circumference) / 100;

    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  useEffect(() => {
    progressAnimation.addListener((value) => {
      const offset = circumference - value.value;
      strokeDashoffset.setValue(offset);
    });

    return () => {
      progressAnimation.removeAllListeners();
    };
  }, []);

  const handlePress = () => {
    // Add button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();

    onPress && onPress();
  };

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg width={size} height={size} style={styles.svg}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            {/* Background circle */}
            <Circle
              stroke="#E8DDD4"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <AnimatedCircle
              stroke="#8B4513"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>

        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity 
            style={[styles.button, isLastSlide && styles.buttonComplete]} 
            activeOpacity={0.8} 
            onPress={handlePress}
          >
            {isLastSlide ? (
              <AntDesign name="check" size={24} color="#fff" />
            ) : (
              <AntDesign name="arrowright" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default NextButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  svgContainer: {
    width: 98,
    height: 98,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#8B4513',
    borderRadius: 25, // Half of width/height for perfect circle
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonComplete: {
    backgroundColor: '#228B22',
  },
  buttonText: {
    marginTop: 12,
    color: '#8B4513',
    fontSize: 14,
    fontWeight: '600',
  },
});