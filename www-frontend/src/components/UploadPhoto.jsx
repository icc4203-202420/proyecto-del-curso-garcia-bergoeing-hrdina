import React, { useState } from 'react';
import axios from 'axios';

const UploadEventPicture = ({ eventId }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('event_picture[image]', image);
    
    try {
      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/event_pictures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Imagen subida con éxito');
    } catch (error) {
      console.error('Error subiendo la imagen:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button onClick={handleSubmit}>Subir Imagen</button>
    </div>
  );
};

export default UploadEventPicture;
