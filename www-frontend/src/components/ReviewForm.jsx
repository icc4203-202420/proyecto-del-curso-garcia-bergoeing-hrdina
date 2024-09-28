import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Slider } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import useAxios from 'axios-hooks';
import axios from 'axios';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  text: Yup.string()
    .required('Requiere de justificación para poder dejar un review')
    .test(
      'minWords',
      'El review debe tener al menos 15 palabras',
      (value) => value && value.split(' ').filter(word => word !== '').length >= 15),
  rating: Yup.number().required('Debe seleccionar una calificación')
});

const ReviewForm = () => {
  const { beerId } = useParams();
  const [serverError, setServerError] = useState(''); // Estado para manejar el error del servidor
  const navigate = useNavigate(); // Hook para manejar la navegación
  const [rating, setRating] = useState(0);

  // Retrieve user_id from localStorage
  const userId = localStorage.getItem("user_id");

  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: `http://localhost:3001/api/v1/beers/${beerId}/reviews`,
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    },
    { manual: true }
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    values.user_id = userId;
    values.rating = rating;
    console.log('Submitted values:', values); // Log the values to check the structure
    try {
      const response = await executePost({ data: qs.stringify({ review: values }) });

      console.log('Data in Response:', response.data);
      setServerError(''); // Clear the error message if submission is successful
      navigate('/'); // Redirect to the root route after a successful submission
    } catch (err) {
      console.log("Error: ", err);
      if (err.response && err.response.status === 401) {
        setServerError('Correo electrónico o contraseña incorrectos.');
      } else {
        setServerError('Error en el servidor. Intenta nuevamente más tarde.');
      }
      console.error('Error al enviar la reseña:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          mt: 8,
          bgcolor: '#213547',
          p: 4,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Typography variant="h4">Escribir una Reseña</Typography>
        <Formik
          initialValues={{ text: '', rating: 0, user_id: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, setFieldValue }) => (
            <Form style={{ width: '100%' }}>
              <Box sx={{ mt: 2 }}>
                <Field
                  as={TextField}
                  label="Texto de la reseña"
                  name="text"
                  type="text"
                  fullWidth
                  error={touched.text && Boolean(errors.text)}
                  helperText={touched.text && errors.text}
                  margin="normal"
                  multiline
                  rows={4}
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
                        color: 'white', // Color del texto en el input
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white', // Color del texto del usuario
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
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ color: 'white' }}>Calificación</Typography>
                <Slider
                  name="rating"
                  value={rating}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  onChange={(event, newValue) => setRating(newValue)}
                  sx={{
                    color: 'purple',
                    '& .MuiSlider-thumb': {
                      backgroundColor: 'purple',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: 'purple',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'paper',
                    },
                  }}
                />
              </Box>
              <Field name="user_id" type="hidden" value={userId} />
  
              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Reseña'}
                </Button>
              </Box>
              {serverError && (
                <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
                  {serverError}
                </Typography>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ReviewForm;
