import 'react-native-gesture-handler'; // Place this at the very top
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
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
import VideoPlayer from './components/videoPlayer'; // Import the VideoPlayer
import FeedUser from './users/feedUser.js'

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
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Main" : "Login"}
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
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={AppTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="BeerDetails" component={BeerDetails} />
        <Stack.Screen name="BeerReviews" component={BeerReviews} />
        <Stack.Screen name="BarEvents" component={BarEvents} />
        <Stack.Screen name="AttendancesList" component={AttendancesList} />
        <Stack.Screen name="EventsGallery" component={EventsGallery} />
        <Stack.Screen name="SearchUser" component={SearchUser} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
        <Stack.Screen name="FeedUser" component={FeedUser} />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default App;
