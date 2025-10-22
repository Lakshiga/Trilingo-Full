import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './src/theme/designSystem';
import TopBar from './src/components/TopBar';

// Context Providers
import { AuthProvider } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { ThemeProvider } from './src/context/ThemeContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LessonsScreen from './src/screens/LessonsScreen';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Types
interface RootStackParamList {
  MainTabs: undefined;
  [key: string]: undefined | object;
}

interface TabParamList {
  Home: undefined;
  Lessons: undefined;
  Activities: undefined;
  Profile: undefined;
  [key: string]: undefined | object;
}

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Lessons') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Activities') {
            iconName = focused ? 'play-circle' : 'play-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: true, header: () => <TopBar /> }} />
      <Tab.Screen name="Lessons" component={LessonsScreen} options={{ headerShown: true, header: () => <TopBar /> }} />
      <Tab.Screen name="Activities" component={ActivitiesScreen} options={{ headerShown: true, header: () => <TopBar /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, header: () => <TopBar /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <PaperProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabs" component={TabNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}