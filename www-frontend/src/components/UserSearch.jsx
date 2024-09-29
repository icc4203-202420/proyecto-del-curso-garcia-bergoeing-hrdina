import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete, TextField, CircularProgress, Container, Button, Box } from '@mui/material';

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/users/${userId}/attended-events`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [userId]);

  const handleAddFriend = async () => {
    if (selectedUser) {
      try {
        await axios.post(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
          friend_id: selectedUser.id,
          event_id: selectedEvent ? selectedEvent.id : null, // Optional event ID
        });
        alert('Friend request sent!');
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    } else {
      alert('Please select a user.');
    }
  };

  return (
    <Container>
      {/* Wrapper for Autocomplete components */}
      <Box sx={{ width: '100%', minWidth: 300, margin: '0 auto', marginBottom: 2 }}>
        {/* Autocomplete para buscar usuarios */}
        <Autocomplete
          options={users}
          getOptionLabel={(option) => option.handle}
          onChange={(event, newValue) => {
            setSelectedUser(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="" // Ocultamos el label para una apariencia más limpia
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
                backgroundColor: '#333', // Fondo gris
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white', // Color de borde blanco
                  },
                  '&:hover fieldset': {
                    borderColor: 'white', // Color de borde al pasar el mouse
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'blue', // Color de borde al enfocar
                  },
                  '& input': {
                    color: 'white', // Color de texto blanco
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white', // Color de etiqueta
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white', // Color de etiqueta al enfocar
                },
              }}
            />
          )}
        />

        {/* Autocomplete para buscar eventos (opcional) */}
        <Autocomplete
          options={events}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            setSelectedEvent(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="" // Ocultamos el label para una apariencia más limpia
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
                backgroundColor: '#333', // Fondo gris
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white', // Color de borde blanco
                  },
                  '&:hover fieldset': {
                    borderColor: 'white', // Color de borde al pasar el mouse
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'blue', // Color de borde al enfocar
                  },
                  '& input': {
                    color: 'white', // Color de texto blanco
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white', // Color de etiqueta
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white', // Color de etiqueta al enfocar
                },
              }}
            />
          )}
        />
      </Box>

      <Button onClick={handleAddFriend} variant="contained" color="primary">
        Add Friend
      </Button>
    </Container>
  );
};

export default UserSearch;