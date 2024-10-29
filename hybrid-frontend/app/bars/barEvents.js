import { NGROK_URL } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const BarEvents = () => {
  const route = useRoute();
  const { barId } = route.params;
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Obtener información del bar y eventos
    axios.get(`${NGROK_URL}/api/v1/bars/${barId}`)
      .then(response => setBar(response.data.bar))
      .catch(error => console.error('Error fetching bar details:', error));

    axios.get(`${NGROK_URL}/api/v1/bars/${barId}/events`)
      .then(response => setEvents(response.data.events))
      .catch(error => console.error('Error fetching events:', error));
  }, [barId]);

  return (
    <View style={styles.container}>
      {bar ? (
        <>
          <Text style={styles.title}>{bar.name}</Text>
          <Text style={styles.subtitle}>Address: {bar.address?.line1 || 'No address available'}</Text>
          
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.eventCard}>
                <Text style={styles.eventTitle}>{item.name}</Text>
                <Text>Description: {item.description}</Text>
                <Text>Start Date: {new Date(item.start_date).toLocaleDateString()}</Text>
                <Text>End Date: {new Date(item.end_date).toLocaleDateString()}</Text>
              </View>
            )}
          />
        </>
      ) : (
        <Text>Loading bar details...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#213547',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default BarEvents;
