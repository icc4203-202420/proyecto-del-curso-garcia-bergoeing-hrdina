import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserHome = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigation = useNavigation();

  // Fetch the user's name (you can replace this with an actual API call if needed)
  useEffect(() => {
    const fetchUserName = async () => {
      setLoading(true); // Start loading
      try {
        const storedName = await AsyncStorage.getItem('user_name'); // Assuming the user's name is stored under 'user_name'
        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = async () => {
    setLoading(true); // Start loading
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user_id');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error removing token:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleFriendsNavigation = () => {
    navigation.navigate('SearchUser'); // Navigate to the SearchUser screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      <Button title="Logout" onPress={handleLogout} disabled={loading} />
      <Button title="Friends" onPress={handleFriendsNavigation} disabled={loading} />
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default UserHome;