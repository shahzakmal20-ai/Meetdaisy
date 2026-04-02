import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, StatusBar, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  // Animation value initialization
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.2)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(20)).current;
  const bgFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Initial Entrance Cycle: Logo Pop-in and Background Depth
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(bgFadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false, // Color interpolation does not support native driver
      }),
    ]).start(() => {
      // 2. Looping Breathing Effect (Heartbeat) for the logo
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // 3. Coordinated Text Slide + Fade entrance
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(textSlideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Simple fixed transition back to MainTabs (no pre-fetching)
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  // Interpolate background color for a premium feel
  const backgroundColor = bgFadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#f8fdfe'], // Subtle shift to a branded off-white
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            opacity: fadeAnim, 
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim }
            ] 
          }
        ]}
      >
        <Image
          source={require('../../assets/daisylogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View 
        style={[
          styles.textContainer, 
          { 
            opacity: textFadeAnim,
            transform: [{ translateY: textSlideAnim }]
          }
        ]}
      >
        <Text style={styles.welcomeText}>Welcome to Daisy</Text>
        <View style={styles.underline} />
      </Animated.View>

      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            {
              width: bgFadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: {
    width: 200, height: 200, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 8,
  },
  logo: { width: '100%', height: '100%' },
  textContainer: { marginTop: 40, alignItems: 'center' },
  welcomeText: { fontSize: 28, fontWeight: '900', color: '#1a1a1a', letterSpacing: 0.8 },
  underline: { width: 45, height: 5, backgroundColor: '#22C3B5', borderRadius: 3, marginTop: 10 },
  progressContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'rgba(34, 195, 181, 0.1)' },
  progressBar: { height: '100%', backgroundColor: '#22C3B5' },
});

export default SplashScreen;
