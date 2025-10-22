import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BrandHeader from '../components/BrandHeader';
import { colors, spacing } from '../theme/designSystem';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const learningStages = [
    {
      id: 'letters',
      title: 'எழுத்துகள்',
      subtitle: 'Letters',
      emoji: '🔤',
      color: ['#FF6B6B', '#FF8E8E'],
      icon: 'alphabetical',
      progress: 75,
      description: 'Learn Tamil letters with fun animations!'
    },
    {
      id: 'words',
      title: 'சொற்கள்',
      subtitle: 'Words',
      emoji: '📚',
      color: ['#4ECDC4', '#6EDDD6'],
      icon: 'library',
      progress: 50,
      description: 'Build words from letters!'
    },
    {
      id: 'sentences',
      title: 'வாக்கியங்கள்',
      subtitle: 'Sentences',
      emoji: '📝',
      color: ['#45B7D1', '#5BC0DE'],
      icon: 'document-text',
      progress: 25,
      description: 'Create beautiful sentences!'
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'அகரம் கற்றல்',
      subtitle: 'Learning A',
      emoji: '🅰️',
      progress: 80,
      color: '#FF6B6B',
    },
    {
      id: 2,
      title: 'ஆகரம் கற்றல்',
      subtitle: 'Learning AA',
      emoji: '🅰️',
      progress: 60,
      color: '#4ECDC4',
    },
    {
      id: 3,
      title: 'இகரம் கற்றல்',
      subtitle: 'Learning I',
      emoji: '🅸',
      progress: 40,
      color: '#45B7D1',
    },
  ];

  const renderLearningStage = (stage: any, index: number) => (
    <Animated.View
      key={stage.id}
      style={[
        styles.stageCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity style={styles.stageTouchable}>
        <LinearGradient
          colors={stage.color}
          style={styles.stageGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.stageContent}>
            <View style={styles.stageHeader}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{stage.emoji}</Text>
              </View>
              <View style={styles.stageText}>
                <Text style={styles.stageTitle}>{stage.title}</Text>
                <Text style={styles.stageSubtitle}>{stage.subtitle}</Text>
                <Text style={styles.stageDescription}>{stage.description}</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: `${stage.progress}%`,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{stage.progress}% Complete</Text>
            </View>
            
            <View style={styles.playButton}>
              <Ionicons name="play-circle" size={32} color="white" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderActivity = (activity: any, index: number) => (
    <Animated.View
      key={activity.id}
      style={[
        styles.activityCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity style={styles.activityTouchable}>
        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
              <Text style={styles.activityEmoji}>{activity.emoji}</Text>
            </View>
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#7F8C8D" />
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${activity.progress}%`, backgroundColor: activity.color }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{activity.progress}% Complete</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Animated Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <BrandHeader title="வணக்கம்!" subtitle="Welcome to Trillingo! Let's learn Tamil with fun! 🎉" />
        </Animated.View>

        {/* Learning Stages */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Learning Adventure</Text>
            <Text style={styles.sectionSubtitle}>Choose your learning path</Text>
          </View>
          {learningStages.map(renderLearningStage)}
        </Animated.View>

        {/* Recent Activities */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📚 Continue Learning</Text>
            <Text style={styles.sectionSubtitle}>Pick up where you left off</Text>
          </View>
          {recentActivities.map(renderActivity)}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          </View>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="play" size={24} color="white" />
                <Text style={styles.quickActionText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient
                colors={['#4ECDC4', '#6EDDD6']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="refresh" size={24} color="white" />
                <Text style={styles.quickActionText}>Practice</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient
                colors={['#45B7D1', '#5BC0DE']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="trophy" size={24} color="white" />
                <Text style={styles.quickActionText}>Achievements</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  // header visuals now provided by BrandHeader
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  stageCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  stageTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  stageGradient: {
    padding: 24,
  },
  stageContent: {
    flex: 1,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 28,
  },
  stageText: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  stageSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '600',
  },
  stageDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  progressContainer: {
    marginBottom: 16,
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
  playButton: {
    alignItems: 'center',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityTouchable: {
    borderRadius: 16,
  },
  activityContent: {
    padding: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  quickAction: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;