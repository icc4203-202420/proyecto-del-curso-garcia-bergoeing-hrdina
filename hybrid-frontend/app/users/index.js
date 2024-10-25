import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { NGROK_URL } from '@env';

const UserHome = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Fetch the user's name (you can replace this with an actual API call if needed)
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('user_name'); // Assuming the user's name is stored under 'user_name'
        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');

      await axios.delete(`${NGROK_URL}/api/v1/logout`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Clear the stored user data after a successful logout
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user_id');
      await AsyncStorage.removeItem('user_name');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Error logging out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      <Button title="Logout" onPress={handleLogout} disabled={loading} />
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default UserHome;
