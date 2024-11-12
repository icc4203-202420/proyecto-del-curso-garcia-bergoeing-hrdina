import { NGROK_URL } from '@env';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import qs from 'qs';
import {jwtDecode} from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
import { registerForPushNotificationsAsync } from "../../util/Notifications";
import { saveItem } from "../../util/Storage";

const validationSchema = Yup.object({
  email: Yup.string().email('Email no válido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const initialValues = {
  email: '',
  password: '',
};

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async (values) => {

    const pushToken = await registerForPushNotificationsAsync();
    // Include the push token in the values object
    const updatedValues = {
      ...values,
      push_token: pushToken,
    };

    setLoading(true);
    try {
      const response = await axios.post(`${NGROK_URL}/api/v1/login`, qs.stringify({ user: updatedValues }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
  
      const receivedToken = response.headers.authorization.split(' ')[1];
  
      if (receivedToken) {
        // Store the token in AsyncStorage
        await saveItem('authToken', receivedToken);

        const decodedToken = jwtDecode(receivedToken);
        await saveItem('user_id', decodedToken.sub.toString());

        navigation.navigate('Main');
      } else {
        Alert.alert('Error', 'No se recibió token. Por favor, intente de nuevo.');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        Alert.alert('Error', 'Correo electrónico o contraseña incorrectos.');
      } else {
        Alert.alert('Error', 'Error en el servidor. Intenta nuevamente más tarde.');
      }
      console.error('Error en el envío del formulario:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <LogIn size={64} color="#FFA500" />
        <Text style={styles.logoText}>BeerBuddy</Text>
      </View>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
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
            
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <UserPlus size={20} color="#FFA500" style={styles.signUpIcon} />
              <Text style={styles.signUpButtonText}>Create an Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1F2937',
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
    marginBottom: 8,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FFA500',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpIcon: {
    marginRight: 8,
  },
  signUpButtonText: {
    color: '#FFA500',
    fontSize: 16,
  },
})

export default LoginForm;
