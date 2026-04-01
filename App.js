import React from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './src/screens/HomeScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import AllCalendars from './src/screens/AllCalendars';
import CalendarShowScreen from './src/screens/CalendarShowScreen';
import MapScreen from './src/screens/MapScreen';
import DaisyIcon from './src/components/DaisyIcon';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
      <Stack.Screen
        name="AllCalendars"
        component={AllCalendars}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="CalendarShow" component={CalendarShowScreen} />
    </Stack.Navigator>
  );
}
function CalendarsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllCalendars"
        component={AllCalendars}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="CalendarShow" component={CalendarShowScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
}
function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MapMain"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CalendarShow"
        component={CalendarShowScreen}
      />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Explore"
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: { height: 60 },
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === 'Explore') {
                return <DaisyIcon size={size} color={color} />;
              }

              let iconName;

              if (route.name === 'Calendars') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'About') {
                iconName = focused ? 'information-circle' : 'information-circle-outline';
              } else if (route.name === 'Map') {
                iconName = focused ? 'location' : 'location-outline';
              }

              let iconSize = size;
              if (route.name === 'Calendars' || route.name === 'Map') {
                iconSize = size - 3;
              }

              return <Ionicons name={iconName} size={iconSize} color={color} />;
            },
            tabBarActiveTintColor: '#22C3B5',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Explore" component={EventsStack} />
          <Tab.Screen name="Calendars" component={CalendarsStack} />
          <Tab.Screen
            name="About"
            component={() => null}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
                Linking.openURL('https://www.meetdaisy.co/blog');
              },
            }}
          />
          <Tab.Screen name="Map" component={MapStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
