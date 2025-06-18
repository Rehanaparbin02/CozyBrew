

import { StyleSheet, Text, View, Image, useWindowDimensions, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';

const OnboardingItems = ({ item }) => {
    const { width } = useWindowDimensions();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View 
            style={[
                { flex: 1, width },
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim }
                    ]
                }
            ]}
        >
            {/* Visual Content Container */}
            <View style={[styles.visualContainer, { width }]}>
                <View style={styles.imageWrapper}>
                    {item.animation ? (
                        <LottieView
                            source={item.animation}
                            autoPlay
                            loop
                            style={styles.lottie}
                        />
                    ) : (
                        <Image
                            source={item.image}
                            style={styles.image}
                        />
                    )}
                </View>
                
                {/* Decorative elements */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
                <View style={styles.decorativeCircle3} />
            </View>

            {/* Text Content Container */}
            <View style={styles.textContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.titleUnderline} />
                </View>
                
                <Text style={styles.description}>{item.description}</Text>

                {/* Coffee bean decorative elements */}
                <View style={styles.beanDecoration1} />
                <View style={styles.beanDecoration2} />
            </View>
        </Animated.View>
    );
};

export default OnboardingItems;

const styles = StyleSheet.create({
    visualContainer: {
        flex: 0.65,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingTop: 50,
    },
    imageWrapper: {
        borderRadius: 30,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        shadowColor: '#8B4513',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    image: {
        height: 300,
        width: 300,
        resizeMode: 'contain',
    },
    lottie: {
        height: 300,
        width: 300,
    },
    decorativeCircle1: {
        position: 'absolute',
        top: 120,
        left: 40,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F4A460',
        opacity: 0.3,
    },
    decorativeCircle2: {
        position: 'absolute',
        top: 200,
        right: 30,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DEB887',
        opacity: 0.4,
    },
    decorativeCircle3: {
        position: 'absolute',
        bottom: 50,
        left: 60,
        width: 25,
        height: 25,
        borderRadius: 12.5,
        backgroundColor: '#CD853F',
        opacity: 0.5,
    },
    textContainer: {
        flex: 0.35,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 10,
        position: 'relative',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontWeight: '800',
        fontSize: 32,
        color: '#4A3728',
        textAlign: 'center',
        lineHeight: 38,
        letterSpacing: -0.5,
    },
    titleUnderline: {
        width: 60,
        height: 4,
        backgroundColor: '#8B4513',
        borderRadius: 2,
        marginTop: 10,
        opacity: 0.8,
    },
    description: {
        fontWeight: '500',
        fontSize: 18,
        color: '#6B4E3D',
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 10,
        opacity: 0.9,
    },
    beanDecoration1: {
        position: 'absolute',
        top: 10,
        right: 20,
        width: 12,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#8B4513',
        opacity: 0.2,
        transform: [{ rotate: '15deg' }],
    },
    beanDecoration2: {
        position: 'absolute',
        bottom: 30,
        left: 25,
        width: 10,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: '#A0522D',
        opacity: 0.25,
        transform: [{ rotate: '-20deg' }],
    },
});