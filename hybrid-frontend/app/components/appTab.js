import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from '../navigation/navigationRef';
import { Beer, Wine, User } from 'lucide-react-native';

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
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1F2937',
      },
      headerTintColor: '#FFA500',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen name="BeerList" component={BeerList} options={{ title: 'Beers' }} />
    <Stack.Screen name="BeerDetails" component={BeerDetails} options={{ title: 'Beer Details' }} />
  </Stack.Navigator>
)

// Stack for Bar-related screens
const BarStack = () =>  (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1F2937',
      },
      headerTintColor: '#FFA500',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen name="BarsList" component={BarsList} options={{ title: 'Bars' }} />
    <Stack.Screen name="BarEvents" component={BarEvents} options={{ title: 'Bar Events' }} />
  </Stack.Navigator>
)

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
        tabBarStyle: { 
          backgroundColor: '#1F2937',
          borderTopColor: '#374151',
        },
        tabBarActiveTintColor: '#FFA500',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="Beers"
        component={BeerStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Beer color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Bars"
        component={BarStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Wine color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserHome}
        options={{
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
};

export default AppTabs;
