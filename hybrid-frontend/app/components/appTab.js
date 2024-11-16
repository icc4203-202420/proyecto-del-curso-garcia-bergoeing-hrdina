import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from '../navigation/navigationRef';
import { Beer, Wine, User, Newspaper } from 'lucide-react-native';

// Import your screens
import UserHome from '../users/index.js';
import BeerList from '../beers/beers.js';
import BarsList from '../bars/barsList.js';
import FeedUser from '../users/feedUser.js';

// Create Tab and Stack navigators
const Tab = createBottomTabNavigator();

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
        component={BeerList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Beer color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Bars"
        component={BarsList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Wine color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedUser}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Newspaper color={color} size={size} />
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
