import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import AboutScreen from './src/screens/AboutScreen';
import LoginScreen from './src/screens/LoginScreen';
import TaskFormScreen from './src/screens/TaskFormScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import ErrorBoundary from './src/components/ErrorBoundary';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Initial metrics khusus platform Web untuk mencegah height collapsing / blank screen
const initialMetrics =
  Platform.OS === 'web'
    ? {
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }
    : undefined;

// Komponen Bottom Tab Navigator (4 Menu: Home, Tugas, Tentang, Login)
function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 26 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ellipse-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tugas') {
            iconName = focused ? 'checkbox' : 'checkbox-outline';
          } else if (route.name === 'Tentang') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Login') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Tugas"
        component={TasksScreen}
        options={{ tabBarLabel: 'Tugas' }}
      />
      <Tab.Screen
        name="Tentang"
        component={AboutScreen}
        options={{ tabBarLabel: 'Tentang' }}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{ tabBarLabel: 'Login' }}
      />
    </Tab.Navigator>
  );
}

// Komponen Konten Utama dalam Context Theme
function AppContent() {
  const { colors, isDarkMode } = useTheme();

  return (
    <SafeAreaProvider
      initialMetrics={initialMetrics}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        style={isDarkMode ? 'light' : 'dark'}
        backgroundColor={colors.background}
      />
      <View style={[styles.rootWrapper, { backgroundColor: colors.background }]}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="MainTabs"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
            }}
          >
            {/* 4 Bottom Tabs Utama */}
            <Stack.Screen name="MainTabs" component={MainTabs} />

            {/* Modal / Halaman Form Tambah & Edit Tugas */}
            <Stack.Screen
              name="TaskForm"
              component={TaskFormScreen}
              options={{
                presentation: 'card',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

// Root App dengan ErrorBoundary & ThemeProvider
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
  },
  rootWrapper: {
    flex: 1,
    height: '100%',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 560 : undefined,
    alignSelf: 'center',
  },
});
