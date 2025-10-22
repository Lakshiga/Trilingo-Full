import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Video } from 'expo-av';
import { radii, shadow, spacing } from '../theme/designSystem';

interface VideoHeroProps {
  source: any; // require(...) or { uri }
  style?: ViewStyle;
}

const VideoHero: React.FC<VideoHeroProps> = ({ source, style }) => {
  return (
    <View style={[styles.wrap, style]}>
      <Video
        source={source}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { borderRadius: radii.lg, overflow: 'hidden', marginHorizontal: spacing.md, ...shadow.card },
  video: { width: '100%', height: 180 },
});

export default VideoHero;


