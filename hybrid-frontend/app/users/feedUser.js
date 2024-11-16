import { getItem } from "../../util/Storage";
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Beer, Clock, User, Star } from 'lucide-react-native'
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, FlatList, TextInput, RefreshControl } from 'react-native';
import { NGROK_URL } from '@env';

const FeedScreen = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchText, setSearchText] = useState('');


  const fetchFeed = async () => {
    try {
      const token = await getItem('authToken');
      const userId = await getItem('user_id'); // Point 5: token authentication

      if (token && userId) {
        // API call to fetch feed
        const response = await fetch(`${NGROK_URL}/api/v1/feed?user_id=${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          console.error(data)
          setFeed(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } else {
          console.error('Error fetching feed');
        }
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop the refresh spinner
    }
  };

  useEffect(() => {
    const initializeFeedAndSocket = async () => {
      await fetchFeed(); // Fetch the feed on component mount
     
      // WebSocket connection for real-time updates
      const userId = await getItem('user_id'); // Get user_id outside WebSocket initialization
      const socket = new WebSocket(`${NGROK_URL.replace('http', 'ws')}/cable`);
      socket.onopen = () => {
        console.log('Connected to WebSocket');
        socket.send(
          JSON.stringify({
            command: 'subscribe',
            identifier: JSON.stringify({
              channel: 'FeedChannel',
              user_id: userId, // Use the retrieved user_id
            }),
          })
        );
      };
  
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.message && data.message.type === 'new_feed_item') {
          fetchFeed(); // Refresh the feed when a new item is received
        }
      };
  
      socket.onerror = (e) => {
        console.error('WebSocket error:', e);
      };
  
      socket.onclose = (e) => {
        console.log('WebSocket closed:', e);
      };
  
      // Clean up on component unmount
      return () => {
        socket.close();
      };
    };
  
    initializeFeedAndSocket(); // Call the async function
  }, []); // Dependency array ensures this runs once on mount

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchFeed();
  }, []);

  const toggleFilter = () => {
    const filters = ['all', 'friendship', 'bar', 'beer'];
    const currentIndex = filters.indexOf(activeFilter);
    const nextFilter = filters[(currentIndex + 1) % filters.length];
    setActiveFilter(nextFilter);
  };
  
  const filteredFeed = feed.filter(item => {
    const matchesType =
      activeFilter === 'all' ||
      (activeFilter === 'friendship' && true) ||
      (activeFilter === 'bar' && item.bar_name?.toLowerCase().includes(searchText.toLowerCase())) || // Filtrar por bar_name
      (activeFilter === 'beer' && item.type === 'beer_review');
      
    const matchesSearchText =
      item.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.event_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.beer_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.user_name?.toLowerCase().includes(searchText.toLowerCase());
  
    return matchesType && matchesSearchText;
  });
  
  

  const renderFeedItem = ({ item }) => {
    const formattedDate = new Date(item.created_at).toLocaleString();

    return (
      <View style={styles.post}>
        {item.type === 'event_picture' && (
          <TouchableOpacity onPress={() => navigation.navigate('EventsGallery', { event_id: item.event_id })}>
            <Text style={styles.title}>{item.event_name || 'Unnamed Event'}</Text>
            <View style={styles.userInfo}>
              <User size={16} color="#9CA3AF" />
              <Text style={styles.userName}>{item.user_name}</Text>
            </View>
            {item.image_url && <Image source={{ uri: item.image_url }} style={styles.image} />}
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.dateContainer}>
              <Calendar size={16} color="#9CA3AF" />
              <Text style={styles.date}>{formattedDate}</Text>
            </View>
          </TouchableOpacity>
        )}

        {item.type === 'beer_review' && (
          <TouchableOpacity onPress={() => navigation.navigate('BeerDetails', { beerId: item.beer_id })}>
            <Text style={styles.title}>{item.beer_name || 'Unnamed Beer'}</Text>
            <View style={styles.userInfo}>
              <User size={16} color="#9CA3AF" />
              <Text style={styles.userName}>{item.user_name}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFA500" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
            <Text style={styles.description}>{item.review_text}</Text>
            <View style={styles.dateContainer}>
              <Clock size={16} color="#9CA3AF" />
              <Text style={styles.date}>{formattedDate}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <TouchableOpacity
          onPress={() => toggleFilter()}
          style={styles.filterButton}
        >
          <Text style={styles.filterButtonText}>Filtrar</Text>
        </TouchableOpacity>
        <Text style={styles.filterIndicator}>
          Filtro activo: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
        </Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar en el feed..."
        placeholderTextColor="#9CA3AF"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />

      <FlatList
        data={filteredFeed}
        renderItem={renderFeedItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.feedContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFA500" />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    backgroundColor: '#374151',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  filterButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  filterButtonText: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },  
  filterIndicator: {
    color: '#D1D5DB',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#374151',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  feedContainer: {
    padding: 16,
  },
  post: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    color: '#9CA3AF',
    marginLeft: 4,
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  description: {
    color: '#D1D5DB',
    marginBottom: 8,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    color: '#FFA500',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: '#9CA3AF',
    marginLeft: 4,
    fontSize: 12,
  },
})

export default FeedScreen;
