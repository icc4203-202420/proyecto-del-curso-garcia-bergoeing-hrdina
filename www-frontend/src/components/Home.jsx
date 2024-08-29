// src/components/Home.jsx
import React from 'react';
import { Typography, Container } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Welcome to the Beer App!
      </Typography>
      <Typography variant="body1">
        Explore different beers and find your favorite.
      </Typography>
    </Container>
  );
};

export default Home;

 