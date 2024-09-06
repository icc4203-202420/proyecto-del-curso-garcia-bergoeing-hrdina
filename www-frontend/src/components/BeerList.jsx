import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';

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
                <Button
                  component={Link}
                  to={`/beers/${beer.id}/details`}
                  variant="contained"
                  color="primary"
                >
                  View Details
                </Button>
                <Button
                  component={Link}
                  to={`/beers/${beer.id}/review`}
                  variant="contained"
                  color="secondary"
                >
                  Write Review
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BeerList;
