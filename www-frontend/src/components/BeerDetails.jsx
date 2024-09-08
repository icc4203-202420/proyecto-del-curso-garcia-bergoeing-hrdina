import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Button, CircularProgress, Box, Pagination } from '@mui/material';
import axios from 'axios';

const BeerDetails = () => {
  const { beerId } = useParams();
  const [beer, setBeer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingBeer, setLoadingBeer] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [beerError, setBeerError] = useState('');
  const [reviewsError, setReviewsError] = useState('');
  const [page, setPage] = useState(1); // Estado para la página actual
  const [reviewsPerPage] = useState(5); // Número de reseñas por página
  const navigate = useNavigate();

  // Fetch para obtener detalles de la cerveza
  useEffect(() => {
    const fetchBeer = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/beers/${beerId}`);
        setBeer(response.data.beer);
        setLoadingBeer(false);
      } catch (err) {
        setBeerError('Error fetching beer details.');
        setLoadingBeer(false);
      }
    };

    fetchBeer();
  }, [beerId]);

  // Fetch para obtener reseñas de la cerveza
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/beers/${beerId}/reviews`);
        setReviews(response.data.reviews); // Asumiendo que la API devuelve un array de reseñas
        setLoadingReviews(false);
      } catch (err) {
        setReviewsError('Error fetching reviews.');
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [beerId]);

  const handleReviewClick = () => {
    navigate(`/beers/${beerId}/review`);
  };

  // Calcular el índice de inicio y fin para las reseñas actuales
  const indexOfLastReview = page * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview); // Reseñas actuales de la página

  const handlePageChange = (event, value) => {
    setPage(value); // Actualizar el estado de la página
  };

  return (
    <Container>
      {/* Mostrar detalles de la cerveza */}
      {loadingBeer ? (
        <CircularProgress />
      ) : beerError ? (
        <Typography color="error">{beerError}</Typography>
      ) : beer ? (
        <Card>
          {beer.image_url && (
            <CardMedia
              component="img"
              height="140"
              image={beer.image_url}
              alt={beer.name}
            />
          )}
          <CardContent>
            <Typography variant="h5">{beer.name}</Typography>
            <Typography variant="body2">ABV: {beer.alcohol || 'N/A'}</Typography>
            <Typography variant="body2">IBU: {beer.ibu || 'N/A'}</Typography>
            <Typography variant="body2">Style: {beer.style || 'N/A'}</Typography>
            <Typography variant="body2">Hop: {beer.hop || 'N/A'}</Typography>
            <Typography variant="body2">Yeast: {beer.yeast || 'N/A'}</Typography>
            <Typography variant="body2">Malts: {beer.malts || 'N/A'}</Typography>
            <Typography variant="body2">BLG: {beer.blg || 'N/A'}</Typography>
            <Typography variant="body2">Average Rating: {beer.avg_rating || 'N/A'}</Typography>
            <Button variant="contained" color="primary" onClick={handleReviewClick}>
              Leave a Review
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography>No beer details found</Typography>
      )}

      {/* Mostrar reseñas */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Reseñas</Typography>
        {loadingReviews ? (
          <CircularProgress />
        ) : reviewsError ? (
          <Typography color="error">{reviewsError}</Typography>
        ) : reviews.length > 0 ? (
          <Box>
            {currentReviews.map((review) => (
              <Card key={review.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1">{review.text}</Typography>
                  <Typography variant="body2">Rating: {review.rating}</Typography>
                </CardContent>
              </Card>
            ))}
            {/* Componente de paginación separado */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={Math.ceil(reviews.length / reviewsPerPage)} // Calcular el número total de páginas
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Box>
        ) : (
          <Typography>No reviews available for this beer</Typography>
        )}
      </Box>
    </Container>
  );
};

export default BeerDetails;
