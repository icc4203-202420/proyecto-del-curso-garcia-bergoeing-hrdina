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
    formData.append('event_picture[user_id]', localStorage.getItem("user_id")); // Append user_id using hidden input

    try {
      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/event_pictures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,  // Include your token here
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
      {/* Invisible hidden input to include user_id */}
      <input type="hidden" name="event_picture[user_id]" value={localStorage.getItem("user_id")} />
      <button onClick={handleSubmit}>Subir Imagen</button>
    </div>
  );
};

export default UploadEventPicture;
