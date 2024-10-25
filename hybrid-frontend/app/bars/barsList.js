import { NGROK_URL } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BarList = () => {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // Fetching bars from the API
    fetch('${NGROK_URL}/api/v1/bars')
      .then(response => response.json())
      .then(data => setBars(data.bars))
      .catch(error => console.error('Error fetching bars:', error));
  }, []);

  // Filter bars based on the search term
  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewEvents = (barId) => {
    navigation.navigate('BarEvents', { id: barId }); // Navigate to the events screen
  };

  if (!bars.length) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Bars"
        placeholderTextColor="#888"
        onChangeText={(text) => setSearchTerm(text)}
      />

      <FlatList
        data={filteredBars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: bar }) => (
          <View style={styles.card}>
            {bar.image_url && (
              <Image
                source={{ uri: bar.image_url }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.title}>{bar.name}</Text>
              <Text>Latitude: {bar.latitude}</Text>
              <Text>Longitude: {bar.longitude}</Text>
              {bar.address && (
                <Text>
                  Address: {bar.address.line1}, {bar.address.city}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleViewEvents(bar.id)}
            >
              <Text style={styles.buttonText}>View Events</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No bars available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#333',
    color: 'white',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  image: {
    height: 140,
    width: '100%',
    borderRadius: 8,
  },
  cardContent: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default BarList;
