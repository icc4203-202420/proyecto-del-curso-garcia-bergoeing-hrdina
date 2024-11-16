import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { Calendar, Users, Camera, Video as VideoIcon, CheckCircle } from 'lucide-react-native'
import { registerForPushNotificationsAsync } from "../../util/Notifications"
import { getItem } from "../../util/Storage"
import { NGROK_URL } from '@env'
import * as FileSystem from 'expo-file-system';

const BarEvents = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { barId } = route.params
  const [bar, setBar] = useState(null)
  const [events, setEvents] = useState([])
  const [checkingIn, setCheckingIn] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBarAndEvents()
  }, [barId])

  const fetchBarAndEvents = async () => {
    try {
      const [barResponse, eventsResponse] = await Promise.all([
        axios.get(`${NGROK_URL}/api/v1/bars/${barId}`),
        axios.get(`${NGROK_URL}/api/v1/bars/${barId}/events`)
      ])
      setBar(barResponse.data.bar)
      setEvents(eventsResponse.data.events)
    } catch (error) {
      console.error('Error fetching bar and events:', error)
      setError('Failed to load bar and events. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleViewAttendances = (event_id) => {
    navigation.navigate('AttendancesList', { event_id })
  }

  const handleViewPhotos = (event_id) => {
    navigation.navigate('EventsGallery', { event_id })
  }

  const handleCheckIn = async (event_id) => {
    setCheckingIn(event_id)
    const token = await getItem('authToken')
    const userId = parseInt(await getItem("user_id"), 10)
    const pushToken = await registerForPushNotificationsAsync()

    if (!token) {
      setError('Authentication token not found.')
      setCheckingIn(null)
      return
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
      )

      if (response.status === 208) {
        Alert.alert('Already Registered', 'You are already registered for this event!')
      } else {
        Alert.alert('Check-in Successful', 'You have been checked in to the event.')
      }
    } catch (error) {
      console.error('Check-in error:', error)
      setError('Failed to check in. Please try again.')
    } finally {
      setCheckingIn(null)
    }
  }

  const handleFetchVideo = async (event_id) => {
    try {
      const response = await axios.get(`${NGROK_URL}/api/v1/events/${event_id}/fetch_video`, {
        responseType: 'blob',
      });
  
      if (response.status === 200) {
        const blob = response.data;
  
        // Save the blob to a local file
        const fileUri = `${FileSystem.documentDirectory}event_video_${event_id}.mp4`;
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const base64Data = fileReader.result.split(',')[1];
          await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          navigation.navigate('VideoPlayer', { videoUri: fileUri });
        };
        fileReader.readAsDataURL(blob);
      } else {
        Alert.alert('Video Unavailable', 'The video for this event is not available.');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      Alert.alert('Video Error', 'Failed to load video. Please try again.');
    }
  };

  const isEventStarted = (startDate) => {
    return new Date() >= new Date(startDate)
  }

  const isEventEnded = (endDate) => {
    return endDate ? new Date() > new Date(endDate) : false
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{bar?.name || 'Bar Events'}</Text>
        <Text style={styles.subtitle}>{bar?.address?.line1 || 'Address not available'}</Text>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
            <View style={styles.dateContainer}>
              <Calendar size={16} color="#9CA3AF" />
              <Text style={styles.dateText}>
                {new Date(item.start_date).toLocaleDateString()} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Ongoing'}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleViewAttendances(item.id)}
              >
                <Users size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>Attendees</Text>
              </TouchableOpacity>
        
              {isEventEnded(item.end_date) ? (
                // Show Video Button
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleFetchVideo(item.id)}
                >
                  <VideoIcon size={16} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Video</Text>
                </TouchableOpacity>
              ) : (
                // Show Check In Button
                <TouchableOpacity
                  style={[styles.button, checkingIn === item.id && styles.disabledButton]}
                  onPress={() => handleCheckIn(item.id)}
                  disabled={checkingIn === item.id}
                >
                  {checkingIn === item.id ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <CheckCircle size={16} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Check In</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
        
              <TouchableOpacity
                style={[styles.button, !isEventStarted(item.start_date) && styles.disabledButton]}
                onPress={() => handleViewPhotos(item.id)}
                disabled={!isEventStarted(item.start_date)}
              >
                <Camera size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>Photos</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
  },
  header: {
    backgroundColor: '#374151',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  eventCard: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  disabledButton: {
    backgroundColor: '#4B5563',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default BarEvents;