import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, Card, CardContent } from '@mui/material';

const BarEvents = () => {
  const { id } = useParams(); // Get bar ID from the URL
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [address, setAddress] = useState([]);

  useEffect(() => {
    // Fetch bar details
    fetch(`http://localhost:3001/api/v1/bars/${id}`)
      .then(response => response.json())
      .then(data => setBar(data.bar));

    // Fetch events for the bar
    fetch(`http://localhost:3001/api/v1/bars/${id}/events`)
      .then(response => response.json())
      .then(data => setEvents(data.events));
    
    // Fetch address for the bar
    fetch(`http://localhost:3001/api/v1/bars/${id}/addresses`)
      .then(response => response.json())
      .then(data => setAddress(data.address));

      //console.log('Events: ', events)
      //console.log('Bar: ', bar)
      //console.log('Address: ', address)
  }, [id]);

  if (!bar) return <p>Loading bar details...</p>;

  return (
    <Container>
      <Typography variant="h4">{bar.name}</Typography>
      <Typography variant="h6">Latitude: {bar.latitude}</Typography>
      <Typography variant="h6">Longitude: {bar.longitude}</Typography>
      
      <Typography variant="h5" mt={4}>Events:</Typography>
      <Grid container spacing={2} mt={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={8} md={8} key={event.id} sx={{ minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{event.name}</Typography>
                <Typography variant="body2">Description: {event.description}</Typography>
                <Typography variant="body2">
                  Start Date: {new Date(event.start_date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  End Date: {new Date(event.end_date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BarEvents;