import { NGROK_URL } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const BarEvents = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { barId } = route.params;
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [checkingIn, setCheckingIn] = useState(null); // Para indicar el estado del check-in
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener información del bar y eventos
    axios.get(`${NGROK_URL}/api/v1/bars/${barId}`)
      .then(response => setBar(response.data.bar))
      .catch(error => console.error('Error fetching bar details:', error));

    axios.get(`${NGROK_URL}/api/v1/bars/${barId}/events`)
      .then(response => setEvents(response.data.events))
      .catch(error => console.error('Error fetching events:', error));
  }, [barId]);

  const handleViewAttendances = (event_id) => {
    navigation.navigate('AttendancesList', { event_id });
  };

  const handleCheckIn = async (event_id) => {
    setCheckingIn(event_id);  // Mostrar el estado de carga para este evento
    const token = await AsyncStorage.getItem('authToken');  // Obtener token del almacenamiento

    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    const userId = parseInt(await AsyncStorage.getItem("user_id"), 10);

    try {
      const response = await axios.post(
        `${NGROK_URL}/api/v1/bars/${barId}/events/${event_id}/attendances`,
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.attendance) {
        console.log('User checked in:', response.data.attendance.user_id);
      }

    } catch (error) {
      console.error('Check-in error:', error);
      setError('Failed to check in. Please try again.');
    } finally {
      setCheckingIn(null);
    }
  };

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
                <View style={styles.buttonContainer}>
                  
                  {/* Botón de ver asistentes */}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleViewAttendances(item.id)}
                  >
                    <Text style={styles.buttonText}>See Attendees</Text>
                  </TouchableOpacity>

                  {/* Botón de Check In */}
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#28a745', marginLeft: 10 }]}
                    onPress={() => handleCheckIn(item.id)}
                    disabled={checkingIn === item.id} // Desactivar durante el check-in
                  >
                    {checkingIn === item.id ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Check In</Text>
                    )}
                  </TouchableOpacity>
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default BarEvents;
