import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import { Beer, Star, ChevronLeft, ChevronRight, Edit } from 'lucide-react-native'
import { NGROK_URL } from '@env'

const BeerDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { beerId } = route.params;
  const [beer, setBeer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingBeer, setLoadingBeer] = useState(true);
  const [beerError, setBeerError] = useState('');
  const [page, setPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchBeer = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/beers/${beerId}`)
        setBeer(response.data.beer)
        setLoadingBeer(false)
      } catch (err) {
        setBeerError('Error loading beer details.')
        setLoadingBeer(false)
      }
    }
    fetchBeer()
  }, [beerId])

  const handleReviewClick = () => {
    navigation.navigate('BeerReviews', { beerId })
  }

  const indexOfLastReview = page * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = beer?.reviews.slice(indexOfFirstReview, indexOfLastReview) || []

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, Math.ceil((beer?.reviews.length || 0) / reviewsPerPage)))
  }

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  if (loadingBeer) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    )
  }

  if (beerError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{beerError}</Text>
      </View>
    )
  }

  if (!beer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No beer details found.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.beerCard}>
        {beer.image_url && (
          <Image
            source={{ uri: beer.image_url }}
            style={styles.beerImage}
          />
        )}
        <Text style={styles.beerName}>{beer.name}</Text>
        <View style={styles.ratingContainer}>
          <Star size={20} color="#FFA500" fill="#FFA500" />
          <Text style={styles.ratingText}>{beer.avg_rating?.toFixed(1) || 'N/A'}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <DetailItem icon={<Beer size={16} color="#9CA3AF" />} label="ABV" value={beer.alcohol} />
          <DetailItem icon={<Beer size={16} color="#9CA3AF" />} label="IBU" value={beer.ibu} />
          <DetailItem icon={<Beer size={16} color="#9CA3AF" />} label="Style" value={beer.style} />
          <DetailItem icon={<Beer size={16} color="#9CA3AF" />} label="Hop" value={beer.hop} />
          <DetailItem icon={<Beer size={16} color="#9CA3AF" />} label="Yeast" value={beer.yeast} />
          <DetailItem icon={<Beer size={16} color="#9CA3AF" />} label="Malts" value={beer.malts} />
          <DetailItem icon={<Beer size={16} color="#9CA3AF" />} label="BLG" value={beer.blg} />
        </View>
        <TouchableOpacity style={styles.reviewButton} onPress={handleReviewClick}>
          <Edit size={20} color="#FFFFFF" />
          <Text style={styles.reviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>Reviews</Text>
        {currentReviews.length > 0 ? (
          <>
            {currentReviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <Text style={styles.reviewText}>{review.text}</Text>
                <View style={styles.reviewFooter}>
                  <View style={styles.reviewRating}>
                    <Star size={16} color="#FFA500" fill="#FFA500" />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                  <Text style={styles.reviewAuthor}>By: {review.user.handle}</Text>
                </View>
              </View>
            ))}
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.paginationButton, page === 1 && styles.paginationButtonDisabled]}
                onPress={handlePrevPage}
                disabled={page === 1}
              >
                <ChevronLeft size={20} color={page === 1 ? "#9CA3AF" : "#FFA500"} />
              </TouchableOpacity>
              <Text style={styles.paginationText}>
                Page {page} of {Math.ceil((beer.reviews.length || 0) / reviewsPerPage)}
              </Text>
              <TouchableOpacity
                style={[styles.paginationButton, page === Math.ceil((beer.reviews.length || 0) / reviewsPerPage) && styles.paginationButtonDisabled]}
                onPress={handleNextPage}
                disabled={page === Math.ceil((beer.reviews.length || 0) / reviewsPerPage)}
              >
                <ChevronRight size={20} color={page === Math.ceil((beer.reviews.length || 0) / reviewsPerPage) ? "#9CA3AF" : "#FFA500"} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.noReviewsText}>No reviews available for this beer.</Text>
        )}
      </View>
    </ScrollView>
  )
}

function DetailItem({ icon, label, value }) {
  return (
    <View style={styles.detailItem}>
      {icon}
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
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
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  beerCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  beerImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  beerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    color: '#FFA500',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginLeft: 8,
    marginRight: 4,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reviewsContainer: {
    padding: 16,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  reviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewAuthor: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationButton: {
    padding: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  noReviewsText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
})

export default BeerDetails;
