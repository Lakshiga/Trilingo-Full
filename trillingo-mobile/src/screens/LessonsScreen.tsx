import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BrandHeader from '../components/BrandHeader';
import { colors, spacing } from '../theme/designSystem';

const LessonsScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
    ]).start();
  }, []);

  const lessons = [
    { 
      id: 1, 
      title: 'அகரம்', 
      subtitle: 'Letter A', 
      emoji: '🅰️',
      color: ['#FF6B6B', '#FF8E8E'], 
      progress: 80,
      description: 'Learn the first Tamil letter!'
    },
    { 
      id: 2, 
      title: 'ஆகரம்', 
      subtitle: 'Letter AA', 
      emoji: '🅰️',
      color: ['#4ECDC4', '#6EDDD6'], 
      progress: 60,
      description: 'Master the second letter!'
    },
    { 
      id: 3, 
      title: 'இகரம்', 
      subtitle: 'Letter I', 
      emoji: '🅸',
      color: ['#45B7D1', '#5BC0DE'], 
      progress: 40,
      description: 'Explore the third letter!'
    },
    { 
      id: 4, 
      title: 'ஈகரம்', 
      subtitle: 'Letter II', 
      emoji: '🅸',
      color: ['#96CEB4', '#A8E6CF'], 
      progress: 20,
      description: 'Discover the fourth letter!'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <BrandHeader title="Tamil Lessons" subtitle="Learn step by step with fun!" />
      </Animated.View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {lessons.map((lesson, index) => (
          <Animated.View
            key={lesson.id}
            style={[
              styles.lessonCard,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: fadeAnim }
                ]
              }
            ]}
          >
            <TouchableOpacity style={styles.lessonTouchable}>
              <LinearGradient
                colors={lesson.color as [string, string]}
                style={styles.lessonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.lessonContent}>
                  <View style={styles.lessonHeader}>
                    <View style={styles.lessonIcon}>
                      <Text style={styles.lessonEmoji}>{lesson.emoji}</Text>
                    </View>
                    <View style={styles.lessonText}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
                      <Text style={styles.lessonDescription}>{lesson.description}</Text>
                    </View>
                    <Ionicons name="play-circle" size={32} color="white" />
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <Animated.View
                        style={[
                          styles.progressFill,
                          {
                            width: `${lesson.progress}%`,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{lesson.progress}% Complete</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 20,
  },
  // header now provided by BrandHeader
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  lessonCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  lessonTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  lessonGradient: {
    padding: 24,
  },
  lessonContent: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lessonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonEmoji: {
    fontSize: 28,
  },
  lessonText: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lessonSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '600',
  },
  lessonDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default LessonsScreen;