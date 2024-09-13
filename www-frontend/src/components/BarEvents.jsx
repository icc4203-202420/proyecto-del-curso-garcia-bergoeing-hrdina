import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, Card, CardContent } from '@mui/material';

const BarEvents = () => {
  const { id } = useParams(); // Get bar ID from the URL
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch bar details
    fetch(`http://localhost:3001/api/v1/bars/${id}`)
      .then(response => response.json())
      .then(data => setBar(data.bar));

    // Fetch events for the bar
    fetch(`http://localhost:3001/api/v1/bars/${id}/events`)
      .then(response => response.json())
      .then(data => setEvents(data.events));
  }, [id]);

  if (!bar) return <p>Loading bar details...</p>;

  return (
    <Container>
      <Typography variant="h4">{bar.name}</Typography>
      <Typography variant="h6">Location: {bar.location}</Typography>
      
      <Typography variant="h5" mt={4}>Events:</Typography>
      <Grid container spacing={2} mt={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
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
