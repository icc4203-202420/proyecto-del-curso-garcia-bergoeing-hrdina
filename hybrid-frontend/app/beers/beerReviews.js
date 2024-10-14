import { NGROK_URL } from '@env';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

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
    values.rating = rating;

    try {
      const response = await axios.post(
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
      navigation.navigate('Home'); // Redirect to the home screen after a successful submission
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
            <Slider
              value={rating}
              onValueChange={setRating}
              minimumValue={1}
              maximumValue={5}
              step={1}
              trackStyle={styles.sliderTrack}
              thumbStyle={styles.sliderThumb}
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
  sliderTrack: {
    height: 10,
    backgroundColor: 'purple'
  },
  sliderThumb: {
    backgroundColor: 'purple'
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
