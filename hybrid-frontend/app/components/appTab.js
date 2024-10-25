import React from 'react';
import { View, Text, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserHome from '../users/index.js'
import BeerList from '../beers/beers.js';
import BarsList from '../bars/barsList.js'

// Define the Tab Navigator
const Tab = createBottomTabNavigator();

const AppTabs = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide headers for individual tabs
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: { backgroundColor: '#fff' }, // Style for the tab bar
      }}
    >
      <Tab.Screen
        name="Beers"
        component={BeerList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="beer" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Bars"
        component={BarsList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wine" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={UserHome}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
