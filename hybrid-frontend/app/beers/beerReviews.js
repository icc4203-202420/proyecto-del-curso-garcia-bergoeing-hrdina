import { NGROK_URL } from '@env';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import StarRating from 'react-native-star-rating-widget';

// Validation schema for the form
const validationSchema = Yup.object().shape({
  text: Yup.string()
    .required('Requiere de justificación para poder dejar un review')
    .test(
      'minWords',
      'El review debe tener al menos 15 palabras',
      (value) => value && value.split(' ').filter(word => word !== '').length >= 15
    ),
  rating: Yup.number().required('Debe seleccionar una calificación')
});

const BeerReviews = () => {
  const route = useRoute();
  const { beerId } = route.params;
  const [serverError, setServerError] = useState('');
  const [rating, setRating] = useState(0);
  const navigation = useNavigation();

  const handleSubmit = async (values, { setSubmitting }) => {
    const userId = await AsyncStorage.getItem('user_id');
    values.user_id = userId;
    values.rating = parseInt(rating);

    try {
      await axios.post(
        `${NGROK_URL}/api/v1/beers/${beerId}/reviews`,
        { review: values },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
          }
        }
      );
      setServerError('');
      navigation.navigate('Main'); // Redirect to the home screen after a successful submission
    } catch (err) {
      console.log('Error:', err);
      if (err.response && err.response.status === 401) {
        setServerError('Correo electrónico o contraseña incorrectos.');
      } else {
        setServerError('Error en el servidor. Intenta nuevamente más tarde.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Escribir una Reseña</Text>
      <Formik
        initialValues={{ text: '', rating: 0, user_id: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.form}>
            <TextInput
              style={[styles.input, touched.text && errors.text ? styles.inputError : null]}
              placeholder="Texto de la reseña"
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={4}
              value={values.text}
              onChangeText={handleChange('text')}
            />
            {touched.text && errors.text && (
              <Text style={styles.errorText}>{errors.text}</Text>
            )}

            <Text style={styles.label}>Calificación</Text>
            <StarRating
              rating={rating}
              onChange={setRating}
              starSize={30}
              color="purple"
              maxStars={5}
            />

            <View style={styles.buttonContainer}>
              <Button
                title={isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                onPress={handleSubmit}
                disabled={isSubmitting}
              />
            </View>

            {serverError ? (
              <Text style={styles.errorText}>{serverError}</Text>
            ) : null}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#213547',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 16
  },
  form: {
    width: '100%'
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1
  },
  label: {
    color: 'white',
    marginBottom: 5
  },
  buttonContainer: {
    marginTop: 20
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    textAlign: 'center'
  }
});

export default BeerReviews;
