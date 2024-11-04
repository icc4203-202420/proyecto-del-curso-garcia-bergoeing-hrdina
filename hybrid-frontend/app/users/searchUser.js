import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Button, ActivityIndicator, Text, RadioButton } from 'react-native-paper';
import { NGROK_URL } from '@env';

const SearchUser = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userId = await AsyncStorage.getItem("user_id");
        const response = await axios.get(`${NGROK_URL}/api/v1/users`, {
          params: { user_id: userId }
        });

        const users = Array.isArray(response.data) ? response.data : [response.data];

        const userOptions = users.flatMap(user => 
          user.events.map(event => ({
            user_id: user.id,
            handle: user.handle,
            event_name: event.event_name,
            bar_name: event.bar_name,
            event_id: event.event_id,
            bar_id: event.bar_id,
          }))
        );

        setOptions(userOptions);
      } catch (error) {
        console.error("Error fetching users:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddFriend = async () => {
    if (selectedUser) {
      try {
        const userId = await AsyncStorage.getItem("user_id");
        await axios.post(`${NGROK_URL}/api/v1/users/${userId}/friendships`, {
          friend_id: selectedUser.user_id,
          event_id: selectedEvent?.event_id, // Optional
          bar_id: selectedEvent?.bar_id // Optional
        });
        Alert.alert('Friend request sent!');
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    } else {
      Alert.alert('Please select a user.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Search by handle"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={styles.input}
        underlineColor="transparent"
        theme={{ colors: { text: 'white', placeholder: 'white', primary: 'blue' } }}
        placeholderTextColor="white"
        right={<TextInput.Icon name="magnify" color="white" />}
      />
      <View style={styles.resultsContainer}>
        {loading ? (
          <ActivityIndicator animating={true} color="#ffffff" />
        ) : (
          options
            .filter(option => option.handle.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((option, index) => (
              <View key={index}>
                <Text
                  onPress={() => setSelectedUser(option)}
                  style={[
                    styles.optionText,
                    selectedUser?.user_id === option.user_id && styles.selectedOption
                  ]}
                >
                  {`@${option.handle} - Event: ${option.event_name} - Bar: ${option.bar_name}`}
                </Text>
                {selectedUser?.user_id === option.user_id && (
                  <RadioButton.Group
                    onValueChange={value => setSelectedEvent(value)}
                    value={selectedEvent}
                  >
                    <RadioButton.Item
                      labelStyle={styles.radioButtonText}
                      label={`${option.event_name} at ${option.bar_name}`}
                      value={option}
                      color="white"
                      uncheckedColor="white"
                    />
                  </RadioButton.Group>
                )}
              </View>
            ))
        )}
      </View>
      <Button mode="contained" onPress={handleAddFriend} style={styles.button}>
        Add Friend
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#333',
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    marginBottom: 16,
  },
  resultsContainer: {
    marginVertical: 10,
  },
  optionText: {
    color: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  selectedOption: {
    backgroundColor: '#444',
  },
  radioButtonText: {
    color: 'white', // Color de texto para las opciones de RadioButton
  },
  button: {
    marginTop: 20,
  },
});

export default SearchUser;

