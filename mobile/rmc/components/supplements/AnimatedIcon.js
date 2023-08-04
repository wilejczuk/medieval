import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnimatedIcon() {
  const opacity = new Animated.Value(0); // Initial opacity is set to 1 (fully opaque)

  useEffect(() => {
    // Define the animation configuration
    const animationConfig = {
      toValue: 1, // The final opacity value (0 means fully transparent)
      duration: 2000, // Duration of the animation in milliseconds (3 seconds in this case)
      useNativeDriver: true, // Enable the use of native driver for better performance
    };

    // Create the animation using the Animated library
    Animated.timing(opacity, animationConfig).start();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      <Ionicons name="link-outline" size={40} color="grey" />
    </Animated.View>
  );
}
