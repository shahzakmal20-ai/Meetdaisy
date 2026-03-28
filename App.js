import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import BlogScreen from './src/screens/BlogScreen';
import TermsScreen from './src/screens/TermsScreen';
import AllCalendars from './src/screens/AllCalendars';
import CalendarShowScreen from './src/screens/CalendarShowScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function EventsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EventsList"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="AllCalendars" component={AllCalendars} />
      <Stack.Screen name="CalendarShow" component={CalendarShowScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { height: 60 },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Events') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Blog') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Terms') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#22C3B5',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Events" component={EventsStack} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Blog" component={BlogScreen} />
        <Tab.Screen name="Terms" component={TermsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
