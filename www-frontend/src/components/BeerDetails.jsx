import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const BeerDetails = () => {
  const { beerId } = useParams();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeer = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/beers/${beerId}`);
        setBeer(response.data.beer);
        setLoading(false);
      } catch (err) {
        setError('Error fetching beer details.');
        setLoading(false);
      }
    };

    fetchBeer();
  }, [beerId]);

  const handleReviewClick = () => {
    navigate(`/beers/${beerId}/review`);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      {beer ? (
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
    </Container>
  );
};

export default BeerDetails;
