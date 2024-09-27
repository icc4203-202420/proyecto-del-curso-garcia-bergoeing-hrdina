import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Button, Card, CardMedia } from '@mui/material';

const EventGallery = () => {
  const { event_id } = useParams(); // Get event ID from URL
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Fetch event photos
    fetch(`http://localhost:3001/api/v1/events/${event_id}`)
      .then((response) => response.json())
      .then((data) => {
        // Ensure data.photos is an array or set it to an empty array
        setPhotos(Array.isArray(data.photos) ? data.photos : []);
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
        setPhotos([]); // In case of an error, set photos to an empty array
      });
  }, [event_id]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePhotoUpload = () => {
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('event_picture[image]', selectedFile); // Adjust the key to match the expected nested format
  
    fetch(`http://localhost:3001/api/v1/events/${event_id}/event_pictures`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setPhotos((prevPhotos) => [...prevPhotos, data.photo]);
        setSelectedFile(null);
      });
  };  

  return (
    <Container>
      <Typography variant="h4">Photo Gallery</Typography>

      {/* Photo upload section */}
      <div>
        <input type="file" onChange={handleFileChange} />
        <Button
          variant="contained"
          color="primary"
          onClick={handlePhotoUpload}
          disabled={!selectedFile}
          sx={{ mt: 2 }}
        >
          Upload Photo
        </Button>
      </div>

      {/* Gallery display */}
      <Grid container spacing={2} mt={4}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={photo.url} // Assuming the API returns a URL to the uploaded photo
                alt={`Photo ${photo.id}`}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventGallery;