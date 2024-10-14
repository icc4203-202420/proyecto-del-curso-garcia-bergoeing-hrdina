import React from 'react';
import { View, Text, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import BeerList from '../beers/beers.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Tab Navigator
const Tab = createBottomTabNavigator();

const AppTabs = ({ navigation }) => {

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user_id');
      navigation.navigate('Login'); // Navigate back to the login screen
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  // Create the Logout screen
  const LogoutScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Are you sure you want to log out?</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );

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
        name="Logout"
        component={LogoutScreen}
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
