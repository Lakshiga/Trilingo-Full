import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

type Video = {
  id: string;
  title: string;
  description: string;
  duration: string;
  emoji: string;
  gradient: readonly [string, string];
  category: string;
};

const VideosScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const videos: Video[] = [
    {
      id: '1',
      title: 'Introduction to Learning',
      description: 'Get started with our educational content',
      duration: '5:30',
      emoji: '🎓',
      gradient: ['#667EEA', '#764BA2'] as const,
      category: 'Basics',
    },
    {
      id: '2',
      title: 'Advanced Concepts',
      description: 'Deep dive into complex topics',
      duration: '8:15',
      emoji: '🧠',
      gradient: ['#F093FB', '#F5576C'] as const,
      category: 'Advanced',
    },
    {
      id: '3',
      title: 'Fun Learning Activities',
      description: 'Interactive educational content',
      duration: '6:45',
      emoji: '🎮',
      gradient: ['#4FACFE', '#00F2FE'] as const,
      category: 'Activities',
    },
    {
      id: '4',
      title: 'Science Adventures',
      description: 'Explore the wonders of science',
      duration: '7:20',
      emoji: '🔬',
      gradient: ['#43E97B', '#38F9D7'] as const,
      category: 'Science',
    },
    {
      id: '5',
      title: 'Math Magic',
      description: 'Learn math in a fun way',
      duration: '6:00',
      emoji: '🔢',
      gradient: ['#FA709A', '#FEE140'] as const,
      category: 'Math',
    },
    {
      id: '6',
      title: 'Storytime Adventures',
      description: 'Listen to amazing stories',
      duration: '10:30',
      emoji: '📚',
      gradient: ['#30CFD0', '#330867'] as const,
      category: 'Stories',
    },
  ];

  return (
    <LinearGradient colors={theme.videosBackground} style={styles.container}>
      {/* Decorative circles */}
      <View style={[styles.decorativeCircle1, { backgroundColor: theme.decorativeCircle1 }]} />
      <View style={[styles.decorativeCircle2, { backgroundColor: theme.decorativeCircle2 }]} />
      <View style={[styles.decorativeCircle3, { backgroundColor: theme.decorativeCircle3 }]} />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerEmoji}>📹</Text>
            <Text style={styles.headerTitle}>Educational Videos</Text>
            <Text style={styles.headerEmoji}>🎬</Text>
          </View>
          <Text style={styles.headerSubtitle}>Learn through engaging content</Text>
        </View>
      </View>

      {/* Videos List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {videos.map((video, index) => (
          <TouchableOpacity key={video.id} activeOpacity={0.8} style={styles.videoCard}>
            <LinearGradient
              colors={video.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.videoGradient}
            >
              {/* Thumbnail with play button */}
              <View style={styles.thumbnail}>
                <Text style={styles.thumbnailEmoji}>{video.emoji}</Text>
                <View style={styles.playButtonOverlay}>
                  <View style={styles.playButton}>
                    <MaterialIcons name="play-arrow" size={40} color="#fff" />
                  </View>
                </View>
                
                {/* Duration badge */}
                <View style={styles.durationBadge}>
                  <MaterialIcons name="access-time" size={14} color="#fff" />
                  <Text style={styles.durationText}>{video.duration}</Text>
                </View>

                {/* Category badge */}
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{video.category}</Text>
                </View>
              </View>

              {/* Video Info */}
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={1}>
                  {video.title}
                </Text>
                <Text style={styles.videoDescription} numberOfLines={2}>
                  {video.description}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 100,
    right: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  decorativeCircle3: {
    position: 'absolute',
    bottom: 150,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(67, 188, 205, 0.9)',
    borderRadius: 25,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerEmoji: {
    fontSize: 32,
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 10,
  },
  videoCard: {
    marginBottom: 20,
  },
  videoGradient: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnailEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  playButtonOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoInfo: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
  },
  videoDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default VideosScreen;