import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Button, CircularProgress, Box, Pagination } from '@mui/material';
import axios from 'axios';

const BeerDetails = () => {
  const { beerId } = useParams();
  const [beer, setBeer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingBeer, setLoadingBeer] = useState(true);
  const [beerError, setBeerError] = useState('');
  const [page, setPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeer = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/beers/${beerId}`);
        setBeer(response.data.beer);
        setReviews(response.data.beer.reviews || []);
        setLoadingBeer(false);
      } catch (err) {
        setBeerError('Error al cargar los detalles de la cerveza.');
        setLoadingBeer(false);
      }
    };

    fetchBeer();
  }, [beerId]);

  const handleReviewClick = () => {
    navigate(`/beers/${beerId}/review`);
  };

  // Calcular el índice de inicio y fin para las reseñas actuales
  const indexOfLastReview = page * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (event, value) => {
    setPage(value);
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
              Escribir una Reseña
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography>No se encontraron detalles de la cerveza</Typography>
      )}

      {/* Mostrar reseñas */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Reseñas</Typography>
        {loadingBeer ? (
          <CircularProgress />
        ) : reviews.length > 0 ? (
          <Box>
            {currentReviews.map((review) => (
              <Card key={review.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1">{review.text}</Typography>
                  <Typography variant="body2">Rating: {review.rating}</Typography>
                  <Typography variant="body2">By: {review.user.handle}</Typography> {/* Mostrar el handle del usuario */}
                </CardContent>
              </Card>
            ))}
            {/* Componente de paginación separado */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={Math.ceil(reviews.length / reviewsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Box>
        ) : (
          <Typography>No hay reseñas disponibles para esta cerveza</Typography>
        )}
      </Box>
    </Container>
  );
};

export default BeerDetails;