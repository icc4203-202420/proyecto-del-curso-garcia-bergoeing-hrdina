import { NGROK_URL } from '@env';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import qs from 'qs'; // Asegúrate de tener esta librería instalada
import { registerForPushNotificationsAsync } from "../../util/Notifications";

// Esquema de validación con Yup
const validationSchema = Yup.object({
  first_name: Yup.string().required('El nombre es requerido'),
  last_name: Yup.string().required('El apellido es requerido'),
  email: Yup.string().email('Email no válido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
    .required('Repetir la contraseña es requerido'),
});

// Valores iniciales del formulario
const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  handle: '',
  password: '',
  password_confirmation: ''
};

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Función handleSubmit
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {

      const pushToken = await registerForPushNotificationsAsync();
      // Include the push token in the values object
      const updatedValues = {
        ...values,
        push_token: pushToken,
      };

      const response = await axios.post(
        `${NGROK_URL}/api/v1/signup`,
        qs.stringify({
          user: updatedValues // Anida los valores bajo la clave 'user'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // Cambiado a 'application/x-www-form-urlencoded'
          }
        }
      );

      const receivedToken = response.headers.authorization.split(' ')[1];

      if (receivedToken) {
        Alert.alert('Registro exitoso');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'No se recibió token. Por favor, intente de nuevo.');
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        Alert.alert('Error', 'Correo electrónico ya registrado.');
      } else {
        Alert.alert('Error', 'Error en el servidor. Intenta nuevamente más tarde.');
      }
      console.error('Error en el envío del formulario:', err);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear una cuenta</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              onChangeText={handleChange('first_name')}
              onBlur={handleBlur('first_name')}
              value={values.first_name}
            />
            {touched.first_name && errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Apellido"
              onChangeText={handleChange('last_name')}
              onBlur={handleBlur('last_name')}
              value={values.last_name}
            />
            {touched.last_name && errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Handle"
              onChangeText={handleChange('handle')}
              onBlur={handleBlur('handle')}
              value={values.handle}
            />
            {touched.handle && errors.handle && <Text style={styles.errorText}>{errors.handle}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
            />
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Repetir contraseña"
              onChangeText={handleChange('password_confirmation')}
              onBlur={handleBlur('password_confirmation')}
              value={values.password_confirmation}
              secureTextEntry
            />
            {touched.password_confirmation && errors.password_confirmation && <Text style={styles.errorText}>{errors.password_confirmation}</Text>}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isSubmitting || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Registrarse</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Volver a iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#213547'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  linkText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5
  }
});

export default SignUp;