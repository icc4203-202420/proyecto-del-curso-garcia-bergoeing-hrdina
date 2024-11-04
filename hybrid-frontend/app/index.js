import 'react-native-gesture-handler'; // Place this at the very top
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getItem } from "../util/Storage";
import { navigationRef } from './navigation/navigationRef'; // Import navigationRef
import setupNotificationHandler from '../util/notificationHandler'; // Import your notification handler

// Paths
import Login from './access/login';
import SignUp from './access/SignUp';
import BeerDetails from './beers/beerDetails.js';
import BeerReviews from './beers/beerReviews.js';
import AppTabs from './components/appTab.js';
import BarEvents from './bars/barEvents.js';
import AttendancesList from './events/attendancesList.js';
import EventsGallery from './events/eventsGallery.js';
import SearchUser from './users/searchUser.js';

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize notification handling
  const linking = setupNotificationHandler();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer ref={navigationRef} independent={true} linking={linking}>
    <Stack.Navigator initialRouteName="Login">
      <>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Main" component={AppTabs} />
        <Stack.Screen name="BeerDetails" component={BeerDetails} />
        <Stack.Screen name="BeerReviews" component={BeerReviews} />
        <Stack.Screen name="BarEvents" component={BarEvents} />
        <Stack.Screen name="AttendancesList" component={AttendancesList} />
        <Stack.Screen name="EventsGallery" component={EventsGallery} />
        <Stack.Screen name="SearchUser" component={SearchUser} />
      </>
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
