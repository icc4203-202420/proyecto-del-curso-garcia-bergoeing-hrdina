import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Slider } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ReviewForm = () => {
  const { beerId } = useParams();
  const [review, setReview] = useState({ text: '', rating: 1 });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (event, newValue) => {
    setReview({ ...review, rating: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3001/api/v1/beers/${beerId}/reviews`, review);
      // Handle success (e.g., redirect or show success message)
    } catch (err) {
      setError('Error al enviar la reseña.');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Escribir una Reseña</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Texto de la reseña"
          name="text"
          value={review.text}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'blue',
              },
              '& input': {
                color: 'white',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
            },
            backgroundColor: '#333',
          }}
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ color: 'white' }}>Calificación</Typography>
          <Slider
            value={review.rating}
            min={1}
            max={5}
            step={1}
            marks
            onChange={handleSliderChange}
            sx={{
              color: 'blue',
              '& .MuiSlider-thumb': {
                backgroundColor: 'blue',
              },
              '& .MuiSlider-track': {
                backgroundColor: 'white',
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#333',
              },
            }}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Enviar Reseña
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </form>
    </Container>
  );
};

export default ReviewForm;
