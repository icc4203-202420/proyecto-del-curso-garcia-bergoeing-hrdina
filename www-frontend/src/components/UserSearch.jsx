import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete, TextField, CircularProgress, Container, Button, Box } from '@mui/material';

const UserSearch = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const userId = localStorage.getItem("user_id");
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/users`, {
          params: { user_id: userId }
        });

        // Ensure response.data is an array
        const users = Array.isArray(response.data) ? response.data : [response.data];
        setOptions(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setOptions([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddFriend = async () => {
    if (selectedUser) {
      try {
        await axios.post(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
          friend_id: selectedUser.id
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
      <Box sx={{ width: '100%', minWidth: 300, margin: '0 auto', marginBottom: 2 }}>
        <Autocomplete
          options={options} // Ensure this is an array
          getOptionLabel={(option) => {
            // Create a string representation including user handle, events, and bar names
            const eventNames = option.events.map(event => event.event_name).join(', ');
            const barNames = option.events.map(event => event.bar_name).join(', ');

            return `${option.handle || ''} - Events: ${eventNames} - Bar: ${barNames}`;
          }}
          onInputChange={(event, newInputValue) => {
            setSearchQuery(newInputValue);
          }}
          onChange={(event, newValue) => {
            setSelectedUser(newValue);
          }}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for users"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              sx={{
                backgroundColor: '#333',
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
