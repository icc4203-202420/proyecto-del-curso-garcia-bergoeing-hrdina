import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, CardMedia } from '@mui/material';

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
      <Grid container spacing={2}>
        {filteredBars.map((bar) => (
          <Grid item xs={12} sm={6} md={4} key={bar.id}>
            <Card>
              {bar.image_url && (
                <CardMedia
                  component="img"
                  height="140"
                  image={bar.image_url}
                  alt={bar.name}
                />
              )}
              <CardContent>
                <Typography variant="h5">{bar.name}</Typography>
                <Typography variant="body2">Latitude: {bar.latitude}</Typography>
                <Typography variant="body2">Longitude: {bar.longitude}</Typography>
                {/* Assuming address details are included in the bar object */}
                {bar.address && (
                  <Typography variant="body2">Address: {bar.address.line1}, {bar.address.city}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BarList;
