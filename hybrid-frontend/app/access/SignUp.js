import { NGROK_URL } from '@env';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react-native'
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <UserPlus size={64} color="#FFA500" />
          <Text style={styles.logoText}>Create Account</Text>
        </View>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleChange('first_name')}
                  onBlur={handleBlur('first_name')}
                  value={values.first_name}
                />
              </View>
              {touched.first_name && errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}
              
              <View style={styles.inputContainer}>
                <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleChange('last_name')}
                  onBlur={handleBlur('last_name')}
                  value={values.last_name}
                />
              </View>
              {touched.last_name && errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
              
              <View style={styles.inputContainer}>
                <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Handle"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleChange('handle')}
                  onBlur={handleBlur('handle')}
                  value={values.handle}
                />
              </View>
              {touched.handle && errors.handle && <Text style={styles.errorText}>{errors.handle}</Text>}
              
              <View style={styles.inputContainer}>
                <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              
              <View style={styles.inputContainer}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                />
              </View>
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              
              <View style={styles.inputContainer}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleChange('password_confirmation')}
                  onBlur={handleBlur('password_confirmation')}
                  value={values.password_confirmation}
                  secureTextEntry
                />
              </View>
              {touched.password_confirmation && errors.password_confirmation && <Text style={styles.errorText}>{errors.password_confirmation}</Text>}
              
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('Login')}
              >
                <ArrowLeft size={20} color="#FFA500" style={styles.loginIcon} />
                <Text style={styles.loginButtonText}>Back to Login</Text>
              </TouchableOpacity>
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
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFA500',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    marginTop: -12,
    marginBottom: 12,
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: '#FFA500',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: '#FFA500',
    fontSize: 16,
  },
})

export default SignUp;