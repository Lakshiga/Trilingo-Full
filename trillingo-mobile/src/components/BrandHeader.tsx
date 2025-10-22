import React from 'react';
import { View, StyleSheet, Text, Image, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, spacing, shadow } from '../theme/designSystem';
import PawLogo from './PawLogo';

interface BrandHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
  logoSource?: any; // allow override; default will be paw
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ title, subtitle, right, style, logoSource }) => {
  return (
    <LinearGradient colors={gradients.brand} style={[styles.container, style]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.row}>
        <View style={styles.logoWrap}>
          {logoSource ? (
            <Image source={logoSource} resizeMode="contain" style={styles.logo} />
          ) : (
            <PawLogo size={56} color="#2E86DE" />
          )}
          <View>
            <Text style={styles.title}>{title}</Text>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    borderRadius: radii.lg,
    margin: spacing.md,
    ...shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pawCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginRight: spacing.md,
  },
  logo: {
    width: 56,
    height: 56,
    marginRight: spacing.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  right: {
    marginLeft: spacing.md,
  },
});

export default BrandHeader;


