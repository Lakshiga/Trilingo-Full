import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, shadow, spacing } from '../theme/designSystem';

interface AnimatedCTAProps {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const AnimatedCTA: React.FC<AnimatedCTAProps> = ({ label, onPress, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.04, duration: 900, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.ctaWrap, style]}>
        <LinearGradient colors={[colors.secondary, colors.secondaryLight]} style={styles.cta}>
          <Text style={styles.ctaText}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ctaWrap: { borderRadius: radii.lg, overflow: 'hidden', ...shadow.card },
  cta: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, alignItems: 'center' },
  ctaText: { color: 'white', fontSize: 18, fontWeight: '800' },
});

export default AnimatedCTA;


