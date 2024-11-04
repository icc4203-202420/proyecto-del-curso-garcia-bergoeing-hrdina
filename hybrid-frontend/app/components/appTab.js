import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from '../navigation/navigationRef';

// Import your screens
import UserHome from '../users/index.js';
import BeerList from '../beers/beers.js';
import BarsList from '../bars/barsList.js';
import BarEvents from '../bars/barEvents.js';
import BeerDetails from '../beers/beerDetails.js';

// Create Tab and Stack navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack for Beer-related screens
const BeerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BeerList" component={BeerList} />
    <Stack.Screen name="BeerDetails" component={BeerDetails} />
  </Stack.Navigator>
);

// Stack for Bar-related screens
const BarStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BarsList" component={BarsList} />
    <Stack.Screen name="BarEvents" component={BarEvents} />
  </Stack.Navigator>
);

const AppTabs = () => {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation && navigationRef) {
      navigationRef.current = navigation;
    }
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen
        name="Beers"
        component={BeerStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="beer" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Bars"
        component={BarStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wine" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserHome}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
