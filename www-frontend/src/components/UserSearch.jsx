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
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/users`, {
          params: { user_id: userId }
        });

        const users = Array.isArray(response.data) ? response.data : [response.data];

        // Flatten events for each user to create user-event combinations as options
        const userOptions = users.flatMap(user => 
          user.events.map(event => ({
            user_id: user.id, // Include the actual user ID
            handle: user.handle,
            event_name: event.event_name,
            bar_name: event.bar_name,
            event_id: event.event_id,
            bar_id: event.bar_id,
          }))
        );

        setOptions(userOptions);
      } catch (error) {
        console.error("Error fetching users:", error);
        setOptions([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId]);

  const handleAddFriend = async () => {
    if (selectedUser) {
      try {
        await axios.post(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
          friend_id: selectedUser.user_id, // Assuming handle is the identifier for the friend
          event_id: selectedUser.event_id, // Send event_id
          bar_id: selectedUser.bar_id // Send bar_id
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
          options={options}
          groupBy={(option) => option.handle}  // Group by the user handle
          getOptionLabel={(option) => `Event: ${option.event_name} - Bar: ${option.bar_name}`} // Display event and bar info
          onInputChange={(event, newInputValue) => {
            setSearchQuery(newInputValue);
          }}
          onChange={(event, newValue) => {
            setSelectedUser(newValue); // Update selected user, includes event_id and bar_id
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