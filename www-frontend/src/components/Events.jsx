// src/components/EventList.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';

const EventList = () => {
  const { id } = useParams();  // Get the bar ID from the URL
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/bar/${id}/events`)
      .then(response => response.json())
      .then(data => setEvents(data.events))  // Access the "events" array in the response
      .catch(error => console.error('Error fetching events:', error));
  }, [id]);

  return (
    <Container>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              {event.image_url && (
                <CardMedia
                  component="img"
                  height="140"
                  image={event.image_url}
                  alt={event.name}
                />
              )}
              <CardContent>
                <Typography variant="h5">{event.name}</Typography>
                <Typography variant="body2">{event.description}</Typography>
                <Typography variant="body2">Start Date: {new Date(event.start_date).toLocaleDateString()}</Typography>
                <Typography variant="body2">End Date: {new Date(event.end_date).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventList;
