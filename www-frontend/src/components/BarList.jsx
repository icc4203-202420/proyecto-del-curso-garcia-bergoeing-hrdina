import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link for routing

const BarList = () => {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/bars')
      .then(response => response.json())
      .then(data => setBars(data.bars))
      .catch(error => console.error('Error fetching bars:', error));
  }, []);

  const filteredBars = bars.filter(bar => 
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <TextField
        label="Search Bars"
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
      <Grid container spacing={3}>
        {filteredBars.map((bar) => (
          <Grid item xs={12} sm={6} md={4} key={bar.id} sx={{ minWidth: 300 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {bar.image_url && (
                <CardMedia
                  component="img"
                  sx={{ height: 140, objectFit: 'contain' }} // Ensures the image fits inside the card
                  image={bar.image_url}
                  alt={bar.name}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div">{bar.name}</Typography>
                <Typography variant="body2">Latitude: {bar.latitude}</Typography>
                <Typography variant="body2">Longitude: {bar.longitude}</Typography>
                {bar.address && (
                  <Typography variant="body2">
                    Address: {bar.address.line1}, {bar.address.city}
                  </Typography>
                )}
              </CardContent>
              <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/bars/${bar.id}/events`} // Link to the events view
                  fullWidth
                >
                  View Events
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BarList;