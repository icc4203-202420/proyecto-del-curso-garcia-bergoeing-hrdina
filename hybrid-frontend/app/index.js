import 'react-native-gesture-handler'; // Place this at the very top
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Icons
import {Ionicons} from '@expo/vector-icons'

//Paths
import Login from './access/login';
import SignUp from './access/SignUp';
import Home from './home';
import BeerList from './beers/beers.js'
import BeerDetails from './beers/beerDetails.js'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => (
  <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide headers for individual tabs
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: { backgroundColor: '#fff' }, // Style for the tab bar
      }}
    >
    <Tab.Screen name="Beers" component={BeerList} options={{tabBarIcon: ({color, size}) => (
      <Ionicons name="beer" color={color} size={size} />
    ),}}/>
  </Tab.Navigator>
);

const App = () => {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="BeerDetails" component={BeerDetails} />
        <Stack.Screen
          name="Main"
          component={AppTabs}
        />
      </Stack.Navigator>
  );
};

export default App;
