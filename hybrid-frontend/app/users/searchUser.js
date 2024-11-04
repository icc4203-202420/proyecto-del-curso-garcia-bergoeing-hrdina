import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, ScrollView, FlatList } from 'react-native';
import axios from 'axios';
import { Button, ActivityIndicator, Text, RadioButton, Searchbar } from 'react-native-paper';
import { getItem } from "../../util/Storage";
import { NGROK_URL } from '@env';


const SearchUser = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userId = await getItem('user_id');
        const response = await axios.get(`${NGROK_URL}/api/v1/users`, {
          params: { user_id: userId },
        });

        const users = Array.isArray(response.data) ? response.data : [response.data];
        const userOptions = users.map(user => ({
          user_id: user.id,
          handle: user.handle,
          events: user.events.map(event => ({
            event_name: event.event_name,
            bar_name: event.bar_name,
            event_id: event.event_id,
            bar_id: event.bar_id,
          })),
        }));

        setOptions(userOptions);
      } catch (error) {
        console.error('Error fetching users:', error);
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
        const userId = await getItem('user_id');
        await axios.post(`${NGROK_URL}/api/v1/users/${userId}/friendships`, {
          friend_id: selectedUser.user_id,
          event_id: selectedBar?.event_id || null, // Optional
          bar_id: selectedBar?.bar_id || null, // Optional
        });
        Alert.alert('Friend request sent!');
      } catch (error) {
        console.error('Error adding friend:', error);
      }
    } else {
      Alert.alert('Please select a user.');
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by handle"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        style={styles.searchbar}
        iconColor="white"
      />
      <ScrollView style={styles.resultsContainer}>
        {loading ? (
          <ActivityIndicator animating={true} color="#ffffff" />
        ) : (
          options
            .filter(option => option.handle.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(option => (
              <View key={option.user_id}>
                <Text
                  onPress={() => {
                    setSelectedUser(option);
                    setSelectedBar(null); // Clear selected bar when a new user is selected
                  }}
                  style={[
                    styles.optionText,
                    selectedUser?.user_id === option.user_id && styles.selectedOption,
                  ]}
                >
                  @{option.handle}
                </Text>
                {/* Render bar selection if the user has events */}
                {selectedUser?.user_id === option.user_id && selectedUser.events.length > 0 && (
                  <FlatList
                    data={selectedUser.events}
                    keyExtractor={(item) => item.bar_id.toString()}
                    numColumns={2}
                    renderItem={({ item }) => (
                      <Text
                        style={[
                          styles.barText,
                          selectedBar?.bar_id === item.bar_id && styles.selectedBar,
                        ]}
                        onPress={() => setSelectedBar(item)}
                      >
                        {item.bar_name}
                      </Text>
                    )}
                  />
                )}
              </View>
            ))
        )}
      </ScrollView>
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
  searchbar: {
    marginBottom: 16,
  },
  resultsContainer: {
    flex: 1,
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
  barText: {
    color: 'white',
    padding: 8,
    margin: 4,
    backgroundColor: '#555',
    textAlign: 'center',
    borderRadius: 4,
  },
  selectedBar: {
    backgroundColor: '#777',
  },
  button: {
    marginTop: 20,
  },
});

export default SearchUser;