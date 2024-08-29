// src/components/BeerList.jsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField } from '@mui/material';

const BeerList = () => {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/v1/beers')
      .then(response => response.json())
      .then(data => setBeers(data));
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
              <CardContent>
                <Typography variant="h5">{beer.name}</Typography>
                <Typography variant="body2">ABV: {beer.abv}%</Typography>
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
