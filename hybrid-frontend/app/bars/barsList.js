import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { Search, MapPin, Calendar, Beer } from 'lucide-react-native'
import { NGROK_URL } from '@env'

const BarList = () => {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation();

  useEffect(() => {
    fetchBars()
  }, [])

  const fetchBars = async () => {
    try {
      const response = await axios.get(`${NGROK_URL}/api/v1/bars`)
      setBars(response.data.bars)
    } catch (error) {
      console.error('Error fetching bars:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderBarItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BarEvents', { barId: item.id })}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Beer size={48} color="#9CA3AF" />
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        {item.address && (
          <View style={styles.infoRow}>
            <MapPin size={16} color="#9CA3AF" />
            <Text style={styles.subtitle}>
              {item.address.line1}, {item.address.city}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.eventsButton}
          onPress={() => navigation.navigate('BarEvents', { barId: item.id })}
        >
          <Calendar size={16} color="#FFFFFF" />
          <Text style={styles.eventsButtonText}>View Events</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

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
        <Text style={styles.headerTitle}>Bar List</Text>
      </View>
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search Bars"
          placeholderTextColor="#9CA3AF"
          onChangeText={setSearchTerm}
          value={searchTerm}
        />
      </View>
      <FlatList
        data={filteredBars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBarItem}
        contentContainerStyle={styles.list}
      />
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#374151',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  placeholderImage: {
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  eventsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  eventsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
})
export default BarList;
