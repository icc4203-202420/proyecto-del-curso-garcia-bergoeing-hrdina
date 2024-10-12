import 'react-native-gesture-handler'; // Place this at the very top
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './access/login';
import Home from './home';

const Stack = createStackNavigator();

const App = () => {
  const [token, setToken] = useState('');

  const handleToken = (receivedToken) => {
    setToken(receivedToken);
    console.log('Token received:', receivedToken);
  };

  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
  );
};

export default App;
