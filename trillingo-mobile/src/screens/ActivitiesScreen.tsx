import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BrandHeader from '../components/BrandHeader';
import { colors, spacing } from '../theme/designSystem';

const ActivitiesScreen: React.FC = () => {
  const activities = [
    { id: 1, title: 'Letter Matching', subtitle: 'Match letters with sounds', color: '#FF6B6B', icon: 'swap-horizontal' },
    { id: 2, title: 'Word Building', subtitle: 'Build words from letters', color: '#4ECDC4', icon: 'construct' },
    { id: 3, title: 'Sound Recognition', subtitle: 'Listen and identify sounds', color: '#45B7D1', icon: 'volume-high' },
    { id: 4, title: 'Writing Practice', subtitle: 'Practice writing letters', color: '#96CEB4', icon: 'create' },
    { id: 5, title: 'Memory Game', subtitle: 'Match Tamil words', color: '#FECA57', icon: 'brain' },
    { id: 6, title: 'Story Time', subtitle: 'Read Tamil stories', color: '#FF9FF3', icon: 'book' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BrandHeader title="🎮 Activities" subtitle="Fun learning games" />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {activities.map((activity) => (
            <TouchableOpacity key={activity.id} style={styles.activityCard}>
              <LinearGradient
                colors={[activity.color, `${activity.color}CC`]}
                style={styles.activityGradient}
              >
                <Ionicons name={activity.icon as any} size={32} color="white" />
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
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
    marginBottom: 12,
  },
  // header visuals via BrandHeader
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  activitySubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

export default ActivitiesScreen;