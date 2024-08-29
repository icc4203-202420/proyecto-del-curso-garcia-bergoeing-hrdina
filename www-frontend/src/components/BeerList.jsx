// src/components/BeerList.jsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, CardMedia } from '@mui/material';

const BeerList = () => {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/beers')
      .then(response => response.json())
      .then(data => setBeers(data.beers))
      .catch(error => console.error('Error fetching beers:', error));
  }, []);

  const filteredBeers = beers.filter(beer => 
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <TextField
        label="Search Beers"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2}>
        {filteredBeers.map((beer) => (
          <Grid item xs={12} sm={6} md={4} key={beer.id}>
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
                <Typography variant="body2">ABV: {beer.alcohol}%</Typography>
                <Typography variant="body2">IBU: {beer.ibu}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BeerList;


