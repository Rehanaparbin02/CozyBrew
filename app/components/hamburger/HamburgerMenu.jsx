import React from 'react';
import { View, TouchableWithoutFeedback, Animated, Easing } from 'react-native';

const HamburgerMenu = ({ toggled, setToggled }) => {
  const animValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animValue, {
      toValue: toggled ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [toggled]);

  const handlePress = () => setToggled(prev => !prev);

  // Color interpolation
  const colorInterpolation = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#8B4513', '#F8F4F0'] // Brown to Tomato Red when opened
  });

  const topLineStyle = {
    transform: [
      { translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [-13.5, 0] }) },
      { rotate: animValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '49deg'] }) },
      { translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [13.5, 5] }) },
    ],
    backgroundColor: colorInterpolation
  };

  const centerLineStyle = {
    transform: [
      { rotate: animValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-50deg'] }) },
    ],
    backgroundColor: colorInterpolation
  };

  const bottomLineStyle = {
    transform: [
      { translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [13.5, 0] }) },
      { rotate: animValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '50deg'] }) },
      { translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [-13.5, -5] }) },
    ],
    backgroundColor: colorInterpolation
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.button}>
          <View style={styles.linesContainer}>
            <View style={styles.topLineContainer}>
              <Animated.View style={[styles.topLine, topLineStyle]} />
            </View>
            <Animated.View style={[styles.centerLine, centerLineStyle]} />
            <View style={styles.bottomLineContainer}>
              <Animated.View style={[styles.bottomLine, bottomLineStyle]} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = {
  container: {
    padding: 16,
  },
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linesContainer: {
    flexDirection: 'column',
  },
  topLineContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  topLine: {
    height: 6,
    width: 15,
    borderRadius: 3,
    backgroundColor: '#8B4513',
    marginBottom: 4,
  },
  centerLine: {
    height: 6,
    width: 32,
    borderRadius: 3,
    backgroundColor: '#8B4513',
  },
  bottomLineContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bottomLine: {
    height: 6,
    width: 15,
    borderRadius: 3,
    backgroundColor: '#8B4513',
    marginTop: 4,
  },
};

export default HamburgerMenu;
