import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Button, Card, CardMedia, TextField, Box } from '@mui/material';

const EventGallery = () => 
{
  const { event_id } = useParams(); // Get event ID from URL
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState(''); // New state for description
  const user_id = localStorage.getItem("user_id");

  useEffect(() => 
  {
    // Fetch event photos
    fetch(`http://localhost:3001/api/v1/events/${event_id}`)
      .then((response) => response.json())
      .then((data) => 
      {
        // Ensure data.photos is an array or set it to an empty array
        setPhotos(Array.isArray(data.photos) ? data.photos : []);
      })
      .catch((error) => 
      {
        console.error('Error fetching photos:', error);
        setPhotos([]); // In case of an error, set photos to an empty array
      });
  }, [event_id]);

  const handleFileChange = (event) => 
  {
    setSelectedFile(event.target.files[0]);
  };

  const handleDescriptionChange = (event) => 
  {
    setDescription(event.target.value);
  };

  const handlePhotoUpload = () => 
  {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('event_picture[image]', selectedFile); // Adjust the key to match the expected nested format
    formData.append('event_picture[description]', description); // Include description

    fetch(`http://localhost:3001/api/v1/events/${event_id}/event_pictures/${user_id}`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => 
      {
        setPhotos((prevPhotos) => [...prevPhotos, data.photo]);
        setSelectedFile(null);
        setDescription(''); // Clear description after upload
      })
      .catch((error) => 
      {
        console.error('Error uploading photo:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4">Photo Gallery</Typography>

      {/* Photo upload section */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Upload a New Photo</Typography>
        <input type="file" onChange={handleFileChange} />
        
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          value={description}
          onChange={handleDescriptionChange}
          sx={{ mt: 2 }}
          multiline
          rows={3}
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={handlePhotoUpload}
          disabled={!selectedFile || !description}
          sx={{ mt: 2 }}
        >
          Upload Photo
        </Button>
      </Box>

      {/* Gallery display */}
      <Grid container spacing={2} mt={4}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo?.id || Math.random()}> {/* Use optional chaining for id */}
            <Card>
              {photo?.url ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.url}
                  alt={`Photo ${photo?.id || 'N/A'}`} // Optional chaining for alt text
                />
              ) : (
                <Typography variant="body2" sx={{ p: 2 }}>
                  No image available
                </Typography>
              )}
              <Typography variant="body2" sx={{ p: 2 }}>
                {photo?.description || 'No description'}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventGallery;
