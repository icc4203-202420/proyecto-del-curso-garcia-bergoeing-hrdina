import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, Button, Card, CardMedia, TextField, Box, Autocomplete } from '@mui/material';

const EventGallery = () => {
  const { event_id } = useParams(); // Get event ID from URL
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState(''); // New state for description
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    // Fetch event details including photos
    fetch(`http://localhost:3001/api/v1/events/${event_id}`)
      .then((response) => response.json())
      .then((data) => {
        // Ensure photos is correctly accessed from the response
        const eventPictures = data.event_pictures || []; // Adjusted to fetch event pictures
        setPhotos(eventPictures);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
        setPhotos([]); // In case of an error, set photos to an empty array
      });

    // Fetch users for tagging
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/users`, {
          params: { user_id: user_id, event_id: event_id }
        });

        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [event_id]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePhotoUpload = async() => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('event_picture[image]', selectedFile); // Adjust the key to match the expected nested format
    formData.append('event_picture[description]', description); // Include description -> event_picture : {image : ---, decription : ---}

    fetch(`http://localhost:3001/api/v1/events/${event_id}/event_pictures/${user_id}`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Ensure the new photo data is correctly structured
        setPhotos((prevPhotos) => [...prevPhotos, data.photo]);
        setSelectedFile(null);
        setDescription(''); // Clear description after upload
      })
      .catch((error) => {
        console.error('Error uploading photo:', error);
      });

    const eventsResponse = await axios.get(`http://localhost:3001/api/v1/events/${event_id}`)
    setPhotos(eventsResponse.data.event_pictures || [])
  };

  const handleTagUser = (user) => {
    // Insert tagged user into the description at the current cursor position
    const input = document.getElementById("description-input");
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const newDescription = description.substring(0, start) + `@${user.handle} ` + description.substring(end);
    setDescription(newDescription);
  };

  return (
    <Container sx={{ backgroundColor: '#222', padding: 3 }}>
      <Typography variant="h4" sx={{ color: 'white' }}>Photo Gallery</Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Upload a New Photo</Typography>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span" sx={{ backgroundColor: '#1e88e5', color: 'white' }}>
            Select File
          </Button>
        </label>
        {selectedFile && <Typography sx={{ color: 'white', mt: 1 }}>{selectedFile.name}</Typography>}

        <Autocomplete
          options={users}
          getOptionLabel={(option) => option.handle || ''}
          loading={loadingUsers}
          onChange={(event, newValue) => {
            if (newValue) handleTagUser(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tag a user (start with @)"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'blue' },
                  '& input': { color: 'white' },
                },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                backgroundColor: '#333',
              }}
            />
          )}
        />

        <TextField
          id="description-input"
          fullWidth
          label="Description"
          variant="outlined"
          value={description}
          onChange={handleDescriptionChange}
          sx={{
            mt: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'blue' },
              '& input': { color: 'white' },
            },
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiInputLabel-root': { color: 'white' },
            '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            backgroundColor: '#333',
          }}
          multiline
          rows={3}
        />

        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: '#1e88e5',
            color: 'white',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
          onClick={handlePhotoUpload}
          disabled={!selectedFile || !description}
        >
          Upload Photo
        </Button>
      </Box>

      <Grid container spacing={2} mt={4}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo?.id || Math.random()}>
            <Card sx={{ backgroundColor: '#444' }}>
              <Typography variant="h5" sx={{ p: 1, color: 'white' }}>
                {photo?.user_handle || 'Anon'}
              </Typography>
              <Typography variant="body2" sx={{ p: 1, color: 'white' }}>
                {photo?.description || ''}
              </Typography>
              {photo?.image_url ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.image_url}
                  alt={`Photo ${photo?.id || 'N/A'}`}
                />
              ) : (
                <Typography variant="body2" sx={{ p: 2, color: 'white' }}>
                  No image available
                </Typography>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventGallery;