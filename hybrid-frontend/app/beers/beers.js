import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { Search, Beer, Star, Info, Edit } from 'lucide-react-native'
import { NGROK_URL } from '@env'

const BeerList = () => {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchBeers()
  }, [])

  const fetchBeers = async () => {
    try {
      const response = await axios.get(`${NGROK_URL}/api/v1/beers`)
      setBeers(response.data.beers)
    } catch (error) {
      console.error('Error fetching beers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderBeerItem = ({ item }) => (
    <View style={styles.card}>
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
        <View style={styles.infoRow}>
          <Beer size={16} color="#9CA3AF" />
          <Text style={styles.subtitle}>ABV: {item.alcohol}%</Text>
        </View>
        <View style={styles.infoRow}>
          <Beer size={16} color="#9CA3AF" />
          <Text style={styles.subtitle}>IBU: {item.ibu}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Star size={16} color="#FFA500" />
          <Text style={styles.rating}>{item.avg_rating?.toFixed(1) || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BeerDetails', { beerId: item.id })}
        >
          <Info size={16} color="#FFFFFF" />
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BeerReviews', { beerId: item.id })}
        >
          <Edit size={16} color="#FFFFFF" />
          <Text style={styles.buttonText}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Beer List</Text>
      </View>
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search Beers"
          placeholderTextColor="#9CA3AF"
          onChangeText={setSearchTerm}
          value={searchTerm}
        />
      </View>
      <FlatList
        data={filteredBeers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBeerItem}
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
    height: 200,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA500',
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
  },
  button: {
    backgroundColor: '#FFA500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
})

export default BeerList;
