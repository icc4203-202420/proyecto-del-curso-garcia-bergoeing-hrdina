import axios from 'axios';
import { NGROK_URL } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { registerForPushNotificationsAsync } from "../../util/Notifications";
import { useRoute, useNavigation } from '@react-navigation/native';
import { getItem } from "../../util/Storage";

const BarEvents = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { barId } = route.params;
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [checkingIn, setCheckingIn] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch bar and event information
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

  const handleViewPhotos = (event_id) => {
    navigation.navigate('EventsGallery', { event_id });
  };

  const handleCheckIn = async (event_id) => {
    setCheckingIn(event_id);
    const token = await getItem('authToken');
    const userId = parseInt(await getItem("user_id"), 10);
    const pushToken = await registerForPushNotificationsAsync();

    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    try {
      const response = await axios.post(
        `${NGROK_URL}/api/v1/bars/${barId}/events/${event_id}/attendances`,
        { user_id: userId, push_token: pushToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if(response.status == 208){
        Alert.alert('You are already registered for this event!');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      setError('Failed to check in. Please try again.');
    } finally {
      setCheckingIn(null);
    }
  };

  const isEventStarted = (startDate) => {
    return new Date() >= new Date(startDate);
  };

  const isEventEnded = (endDate) => {
    return endDate ? new Date() > new Date(endDate) : false;
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
                <Text>End Date: {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Ongoing'}</Text>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleViewAttendances(item.id)}
                  >
                    <Text style={styles.buttonText}>See Attendees</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: isEventEnded(item.end_date) ? '#888' : '#28a745', marginLeft: 10 }
                    ]}
                    onPress={() => handleCheckIn(item.id)}
                    disabled={checkingIn === item.id || isEventEnded(item.end_date)}
                  >
                    {checkingIn === item.id ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Check In</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: isEventStarted(item.start_date) ? '#007BFF' : '#888' }
                    ]}
                    onPress={() => handleViewPhotos(item.id)}
                    disabled={!isEventStarted(item.start_date)}
                  >
                    <Text style={styles.buttonText}>See photos</Text>
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
