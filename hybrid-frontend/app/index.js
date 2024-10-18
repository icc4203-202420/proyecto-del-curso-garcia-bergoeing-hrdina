import 'react-native-gesture-handler'; // Place this at the very top
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

//Paths
import Login from './access/login';
import SignUp from './access/SignUp';
import BeerDetails from './beers/beerDetails.js'
import BeerReviews from './beers/beerReviews.js'
import AppTabs from './components/appTab.js'

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user_id');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };
  
  return (
    <Stack.Navigator initialRouteName="Login">
      <>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Main" component={AppTabs} />
        <Stack.Screen name="BeerDetails" component={BeerDetails} />
        <Stack.Screen name="BeerReviews" component={BeerReviews} />
      </>
  </Stack.Navigator>
  );
};

export default App;
