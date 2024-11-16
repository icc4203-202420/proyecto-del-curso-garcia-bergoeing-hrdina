import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { NGROK_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const FeedScreen = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        const userId = await SecureStore.getItemAsync('user_id'); // Asegura que aquí es 'user_id'

        if (token && userId) {
          // Realizar la llamada a la API para obtener el feed
          const response = await fetch(`${NGROK_URL}/api/v1/feed?user_id=${userId}`, { // Cambia aquí a 'user_id'
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setFeed(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
          } else {
            console.error('Error al obtener el feed');
          }
        }

        // Conexión al WebSocket para actualizaciones en tiempo real
        const socket = new WebSocket(`${NGROK_URL.replace('http', 'ws')}/cable`);
        socket.onopen = () => {
          console.log('Conectado al WebSocket');
          socket.send(JSON.stringify({
            command: 'subscribe',
            identifier: JSON.stringify({
              channel: 'FeedChannel',
              user_id: userId  // Asegúrate de que aquí es 'user_id'
            })
          }));
        };

        socket.onmessage = (e) => {
          const data = JSON.parse(e.data);
          if (data.message && data.message.type === 'new_feed_item') {
            fetchFeed();  // Refresca el feed cuando llegue un nuevo item
          }
        };

        socket.onerror = (e) => {
          console.error('Error en WebSocket:', e);
        };

        socket.onclose = (e) => {
          console.log('WebSocket cerrado:', e);
        };

        return () => {
          socket.close();
        };
      } catch (error) {
        console.error('Error al obtener el feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {feed.map((post, index) => {
        const formattedDate = new Date(post.created_at);
        const date = isNaN(formattedDate) ? 'Fecha no válida' : formattedDate.toLocaleString();

        return (
          <View key={index} style={styles.post}>
            {/* Mostrar publicaciones de eventos */}
            {post.type === 'event_picture' && (
              <TouchableOpacity onPress={() => navigation.navigate('EventsGallery', { event_id: post.event_id })}>
                <Text style={styles.title}>{post.event_name || 'Sin nombre'}</Text>
                <Text>Publicado por: {post.user_name}</Text>
                <Image source={{ uri: post.image_url }} style={styles.image} />
                <Text>{post.description}</Text>
                <Text style={styles.date}>Fecha: {date}</Text>
              </TouchableOpacity>
            )}

            {/* Mostrar reviews de cervezas */}
            {post.type === 'beer_review' && (
              <TouchableOpacity onPress={() => navigation.navigate('BeerDetails', { beerId: post.beer_id })}>
                <Text style={styles.title}>{post.beer_name || 'Sin nombre de cerveza'}</Text>
                <Text>Review por: {post.user_name}</Text>
                <Text style={styles.rating}>Rating: {post.rating}</Text>
                <Text>{post.review_text}</Text>
                <Text style={styles.date}>Fecha: {date}</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  post: { marginBottom: 15, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 },
  title: { fontSize: 18, fontWeight: 'bold' },
  image: { width: '100%', height: 200, borderRadius: 5, marginBottom: 10 },
  rating: { color: '#ff9900', fontWeight: 'bold' },
  date: { color: '#888', marginTop: 5 },
});

export default FeedScreen;
