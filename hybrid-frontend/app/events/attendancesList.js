import { NGROK_URL } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const AttendancesList = () => {
  const route = useRoute();
  const { event_id } = route.params;
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/events/${event_id}/attendances`);
        setAttendees(response.data);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [event_id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#c0874f" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendees List</Text>
      {attendees.length > 0 ? (
        <FlatList
          data={attendees}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.attendeeItem}>
              <Text style={styles.text}>{item.handle}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noAttendeesText}>No attendees have checked in yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#213547',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c0874f',
    marginBottom: 20,
  },
  attendeeItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
  },
  noAttendeesText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AttendancesList;