import 'react-native-gesture-handler'; // Place this at the very top
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './access/login';
import SignUp from './access/SignUp';

import Home from './home';

const Stack = createStackNavigator();

const App = () => {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignUp" component={SignUp}/>
      </Stack.Navigator>
  );
};

export default App;
