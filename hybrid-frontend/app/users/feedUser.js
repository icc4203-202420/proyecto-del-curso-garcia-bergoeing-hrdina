import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, FlatList, TextInput, RefreshControl, Modal, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Calendar, Beer, Clock, User, Star, Filter, X } from 'lucide-react-native'
import { getItem } from "../../util/Storage"
import { NGROK_URL } from '@env'

const FeedScreen = () => {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState({ friend_id: null, bar_id: null, country: null, beer_id: null })
  const [friends, setFriends] = useState([])
  const [bars, setBars] = useState([])
  const [beers, setBeers] = useState([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState('none')
  const [searchText, setSearchText] = useState('')
  const navigation = useNavigation()

  const fetchFeed = useCallback(async () => {
    try {
      const token = await getItem('authToken')
      const userId = await getItem('user_id')

      if (token && userId) {
        let url = `${NGROK_URL}/api/v1/feed?user_id=${userId}`
        
        if (filter.friend_id) url += `&friend_id=${filter.friend_id}`
        if (filter.bar_id) url += `&bar_id=${filter.bar_id}`
        if (filter.country) url += `&country=${filter.country}`
        if (filter.beer_id) url += `&beer_id=${filter.beer_id}`

        const response = await fetch(url, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setFeed(data)
        } else {
          console.error('Failed to fetch feed')
        }
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filter])

  const fetchFriends = async () => {
    try {
      const token = await getItem('authToken')
      const userId = await getItem('user_id')
      if (token && userId) {
        const response = await fetch(`${NGROK_URL}/api/v1/feed/friends?user_id=${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setFriends(data)
        } else {
          console.error('Failed to fetch friends')
        }
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
    }
  }

  const fetchBars = async () => {
    try {
      const token = await getItem('authToken');
      const userId = await getItem('user_id');
      if (token && userId) {
        const response = await fetch(`${NGROK_URL}/api/v1/bars?user_id=${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Bars:', data); // Debugging log
          setBars(data.bars || []); // Extract the array of bars
        } else {
          console.error('Failed to fetch bars:', response.status);
        }
      }
    } catch (error) {
      console.error('Error fetching bars:', error);
    }
  };    

  const fetchBeers = async () => {
    try {
      const token = await getItem('authToken')
      const userId = await getItem('user_id')
      if (token && userId) {
        const response = await fetch(`${NGROK_URL}/api/v1/beers?user_id=${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setBeers(data.beers)
        } else {
          console.error('Failed to fetch beers:', response.status)
        }
      }
    } catch (error) {
      console.error('Error fetching beers:', error)
    }
  }

  useEffect(() => {
    const initializeFeedAndSocket = async () => {
      await Promise.all([fetchFeed(), fetchFriends(), fetchBars(), fetchBeers()])
      
      const userId = await getItem('user_id')
      const socket = new WebSocket(`${NGROK_URL.replace('http', 'ws')}/cable`)
      
      socket.onopen = () => {
        console.log('Connected to WebSocket')
        socket.send(JSON.stringify({
          command: 'subscribe',
          identifier: JSON.stringify({
            channel: 'FeedChannel',
            user_id: userId,
          }),
        }))
      }
  
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.message && data.message.type === 'new_feed_item') {
          fetchFeed()
        }
      }
  
      socket.onerror = (e) => {
        console.error('WebSocket error:', e)
      }
  
      socket.onclose = (e) => {
        console.log('WebSocket closed:', e)
      }
  
      return () => {
        socket.close()
      }
    }
  
    initializeFeedAndSocket()
  }, [fetchFeed])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchFeed()
  }, [fetchFeed])

  const handleFilter = (type, id) => {
    setFilter(prev => ({ ...prev, [`${type}_id`]: id }))
    setActiveFilter(type)
    setShowFilterModal(false)
  }

  const handleClearFilter = () => {
    setFilter({ friend_id: null, bar_id: null, country: null, beer_id: null })
    setActiveFilter('none')
  }

  const filteredFeed = feed.filter(item => 
    item.user_name.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.event_name && item.event_name.toLowerCase().includes(searchText.toLowerCase())) ||
    (item.beer_name && item.beer_name.toLowerCase().includes(searchText.toLowerCase())) ||
    item.description.toLowerCase().includes(searchText.toLowerCase())
  )

  const renderFeedItem = ({ item }) => {
    const formattedDate = new Date(item.created_at).toLocaleString()

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
          onPress={() => setShowFilterModal(true)}
          style={styles.filterButton}
        >
          <Filter size={20} color="#1F2937" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {activeFilter !== 'none' && (
        <View style={styles.activeFilterContainer}>
          <Text style={styles.activeFilterText}>
            Active filter: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
          </Text>
          <TouchableOpacity onPress={handleClearFilter} style={styles.clearFilterButton}>
            <X size={16} color="#FFA500" />
            <Text style={styles.clearFilterText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Search feed..."
        placeholderTextColor="#9CA3AF"
        value={searchText}
        onChangeText={setSearchText}
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

      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Feed</Text>
            <ScrollView>
              <Text style={styles.filterSectionTitle}>Friends</Text>
              {friends.map(friend => (
                <TouchableOpacity
                  key={friend.id}
                  style={styles.filterItem}
                  onPress={() => handleFilter('friend', friend.id)}
                >
                  <Text style={styles.filterItemText}>{friend.name}</Text>
                </TouchableOpacity>
              ))}
              <Text style={styles.filterSectionTitle}>Bars</Text>
              {bars.map(bar => (
                <TouchableOpacity
                  key={bar.id}
                  style={styles.filterItem}
                  onPress={() => handleFilter('bar', bar.id)}
                >
                  <Text style={styles.filterItemText}>{bar.name}</Text>
                </TouchableOpacity>
              ))}
              <Text style={styles.filterSectionTitle}>Beers</Text>
              {beers.map(beer => (
                <TouchableOpacity
                  key={beer.id}
                  style={styles.filterItem}
                  onPress={() => handleFilter('beer', beer.id)}
                >
                  <Text style={styles.filterItemText}>{beer.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  activeFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#374151',
  },
  activeFilterText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  clearFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearFilterText: {
    color: '#FFA500',
    fontSize: 14,
    marginLeft: 4,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500',
    marginTop: 16,
    marginBottom: 8,
  },
  filterItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  filterItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  closeModalButtonText: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default FeedScreen;
