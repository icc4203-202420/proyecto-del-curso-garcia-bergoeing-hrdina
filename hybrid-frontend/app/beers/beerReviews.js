import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { Star, Send } from 'lucide-react-native'
import { getItem } from "../../util/Storage"
import { NGROK_URL } from '@env'

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
    const userId = await getItem('user_id');
    values.user_id = userId;
    values.rating = rating;

    try {
      await axios.post(
        `${NGROK_URL}/api/v1/beers/${beerId}/reviews`,
        { review: values },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${await getItem('token')}`
          }
        }
      );
      setServerError('');
      navigation.goBack(); // Redirect to the home screen after a successful submission
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
    <KeyboardAvoidingView 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
  >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Write a Review</Text>
      <Formik
        initialValues={{ text: '', rating: 0, user_id: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.form}>
            <TextInput
              style={[styles.input, touched.text && errors.text ? styles.inputError : null]}
              placeholder="Review text"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              value={values.text}
              onChangeText={handleChange('text')}
            />
            {touched.text && errors.text && (
              <Text style={styles.errorText}>{errors.text}</Text>
            )}

            <Text style={styles.label}>Rating</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Star
                    size={30}
                    color={star <= rating ? "#FFA500" : "#9CA3AF"}
                    fill={star <= rating ? "#FFA500" : "none"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Send size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Submit Review</Text>
                </>
              )}
            </TouchableOpacity>

            {serverError ? (
              <Text style={styles.errorText}>{serverError}</Text>
            ) : null}
          </View>
        )}
      </Formik>
    </ScrollView>
  </KeyboardAvoidingView>
)
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#1F2937',
},
scrollContainer: {
  flexGrow: 1,
  padding: 16,
  alignItems: 'center',
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#FFFFFF',
  marginBottom: 24,
},
form: {
  width: '100%',
  maxWidth: 400,
},
input: {
  backgroundColor: '#374151',
  color: '#FFFFFF',
  padding: 12,
  borderRadius: 8,
  marginBottom: 16,
  fontSize: 16,
  minHeight: 120,
  textAlignVertical: 'top',
},
inputError: {
  borderColor: '#EF4444',
  borderWidth: 1,
},
label: {
  color: '#FFFFFF',
  marginBottom: 8,
  fontSize: 16,
  fontWeight: 'bold',
},
ratingContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginBottom: 24,
},
starButton: {
  padding: 4,
},
submitButton: {
  backgroundColor: '#FFA500',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 12,
  borderRadius: 8,
},
submitButtonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: 16,
  marginLeft: 8,
},
errorText: {
  color: '#EF4444',
  marginTop: 4,
  marginBottom: 16,
  textAlign: 'center',
},
})

export default BeerReviews;
