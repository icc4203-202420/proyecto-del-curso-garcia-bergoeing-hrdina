import { NGROK_URL } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const BeerList = () => {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/beers`)
      .then(response => setBeers(response.data.beers))
      .catch(error => console.error('Error fetching beers:', error));
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderBeerItem = ({ item }) => (
    <View style={styles.card}>
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : null}
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>ABV: {item.alcohol}%</Text>
        <Text style={styles.subtitle}>IBU: {item.ibu}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BeerDetails', { beerId: item.id })}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ReviewForm', { beerId: item.id })}
        >
          <Text style={styles.buttonText}>Write Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Beers"
        placeholderTextColor="#ccc"
        onChangeText={(text) => setSearchTerm(text)}
      />
      <FlatList
        data={filteredBeers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBeerItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#213547',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: 'white',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  cardContent: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default BeerList;
