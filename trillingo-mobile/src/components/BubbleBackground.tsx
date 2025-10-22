import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors } from '../theme/designSystem';

interface BubbleBackgroundProps {
  style?: ViewStyle;
}

const BubbleBackground: React.FC<BubbleBackgroundProps> = ({ style, children }) => {
  const anims = Array.from({ length: 8 }).map(() => ({
    translateY: useRef(new Animated.Value(50)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    anims.forEach((a, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.parallel([
            Animated.timing(a.translateY, { toValue: -30, duration: 3500, useNativeDriver: true }),
            Animated.timing(a.opacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(a.translateY, { toValue: 50, duration: 3500, useNativeDriver: true }),
            Animated.timing(a.opacity, { toValue: 0.2, duration: 1200, useNativeDriver: true }),
          ]),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={[styles.container, style]}>
      {anims.map((a, i) => (
        <Animated.View key={i} style={[styles.bubble, {
          left: (i * 12) % 100 + '%',
          transform: [{ translateY: a.translateY }],
          opacity: a.opacity,
          backgroundColor: i % 2 ? `${colors.info}33` : `${colors.secondary}33`,
        }]} />
      ))}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative' },
  bubble: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: 0,
  },
  content: { position: 'relative' },
});

export default BubbleBackground;


