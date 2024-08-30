import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, CardMedia, TextField } from '@mui/material';

const EventList = () => {
  const { id } = useParams();  // Get the bar ID from the URL
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/v1/bars/${id}/events`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setAllEvents(data.events || []);  // Store all events
        setEvents(data.events || []);  // Display all events initially
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  // Filter events based on search term
  const filteredEvents = allEvents.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <TextField
        label="Search Events"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
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
      <Grid container spacing={2} mt={2}>
        {filteredEvents.map((event) => (
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
