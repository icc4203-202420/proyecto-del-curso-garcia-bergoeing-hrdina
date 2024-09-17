import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Grid, Typography, Card, CardContent, Button } from '@mui/material';
import AddCheckIn from './AddCheckIn';

const BarEvents = () => {
  const { id } = useParams(); // Get bar ID from the URL
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [address, setAddress] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Fetch bar details
    fetch(`http://localhost:3001/api/v1/bars/${id}`)
      .then((response) => response.json())
      .then((data) => setBar(data.bar));

    // Fetch events for the bar
    fetch(`http://localhost:3001/api/v1/bars/${id}/events`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.events);
        setAddress(data.address);
      });
  }, [id]);

  const handleViewAttendances = (event_id) => {
    if (event_id) {
      navigate(`/events/${event_id}/attendances`); // Ensure the event_id is passed correctly
    }
  };

  if (!bar) return <p>Loading bar details...</p>;

  return (
    <Container>
      <Typography variant="h4">{bar.name}</Typography>
      <Typography variant="h6">Address: {address?.line1 || "No address available"}</Typography>

      <Typography variant="h5" mt={4}>
        Events:
      </Typography>
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

                {/* Check-in button */}
                {bar && event.id && (
                  <AddCheckIn
                    bar_id={bar.id}
                    event_id={event.id}
                    onCheckIn={(data) => console.log(data)}
                  />
                )}

                <Button
                  onClick={() => handleViewAttendances(event.id)} // Use correct event.id here
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  See Attendances
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BarEvents;