import { NGROK_URL } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Card, Title, Paragraph } from 'react-native-paper';

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
        const response = await axios.get(`${NGROK_URL}/api/v1/beers/${beerId}`);
        setBeer(response.data.beer);
        console.error("Beer stats:", response.data);

        // Verifica si las reviews son strings y conviértelas a objeto si es necesario
        const reviews = response.data.beer.reviews.map(review =>
          typeof review === 'string' ? JSON.parse(review) : review
        );
        console.error("reviews:", reviews);
        setReviews(reviews || []);
        setLoadingBeer(false);
      } catch (err) {
        setBeerError('Error loading beer details.');
        setLoadingBeer(false);
      }
    };
    fetchBeer();
  }, [beerId]);

  const handleReviewClick = () => {
    navigation.navigate('BeerReviews', { beerId });
  };

  // Calcular índices para la paginación
  const indexOfLastReview = page * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(reviews.length / reviewsPerPage)));
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Mostrar detalles de la cerveza */}
      {loadingBeer ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : beerError ? (
        <Text style={{ color: 'red' }}>{beerError}</Text>
      ) : beer ? (
        <Card>
          {beer.image_url && (
            <Image
              source={{ uri: beer.image_url }}
              style={{ height: 200, resizeMode: 'contain' }}
            />
          )}
          <Card.Content>
            <Title>{beer.name}</Title>
            <Paragraph>ABV: {beer.alcohol || 'N/A'}</Paragraph>
            <Paragraph>IBU: {beer.ibu || 'N/A'}</Paragraph>
            <Paragraph>Style: {beer.style || 'N/A'}</Paragraph>
            <Paragraph>Hop: {beer.hop || 'N/A'}</Paragraph>
            <Paragraph>Yeast: {beer.yeast || 'N/A'}</Paragraph>
            <Paragraph>Malts: {beer.malts || 'N/A'}</Paragraph>
            <Paragraph>BLG: {beer.blg || 'N/A'}</Paragraph>
            <Paragraph>Average Rating: {beer.avg_rating || 'N/A'}</Paragraph>
          </Card.Content>
          <Button title="Write a Review" onPress={handleReviewClick} />
        </Card>
      ) : (
        <Text>No beer details found.</Text>
      )}

      {/* Mostrar reseñas */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Reviews</Text>
        {loadingBeer ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : reviews.length > 0 ? (
          <View>
            {currentReviews.map((review) => (
              <Card key={review.id} style={{ marginBottom: 16 }}>
                <Card.Content>
                  <Paragraph>{review.text}</Paragraph>
                  <Paragraph>Rating: {review.rating}</Paragraph>
                  <Paragraph>By: {review.user.handle}</Paragraph>
                </Card.Content>
              </Card>
            ))}
            {/* Paginación Manual */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <Button
                title="Previous"
                onPress={handlePrevPage}
                disabled={page === 1}
              />
              <Text>Page {page} of {Math.ceil(reviews.length / reviewsPerPage)}</Text>
              <Button
                title="Next"
                onPress={handleNextPage}
                disabled={page === Math.ceil(reviews.length / reviewsPerPage)}
              />
            </View>
          </View>
        ) : (
          <Text>No reviews available for this beer.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default BeerDetails;
