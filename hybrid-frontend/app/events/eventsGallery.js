import { NGROK_URL } from '@env';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TextInput, ScrollView, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getItem } from "../../util/Storage";

const EventGallery = ({ route }) => {
  const { event_id } = route.params;
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [userHandles, setUserHandles] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    fetchEventData();
  }, [event_id]);

  const fetchEventData = async () => {
    await fetchEventPhotos();
    await fetchUsers();
  };

  const fetchEventPhotos = async () => {
    try {
      const response = await fetch(`${NGROK_URL}/api/v1/events/${event_id}`);
      const data = await response.json();
      setPhotos(data.event_pictures || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]);
    }
  };

  const handlePhotoUpload = async () => {
    try {
      const user_id = await getItem("user_id");

      if (!selectedFile || !selectedFile.uri || !description) {
        Alert.alert("Please select an image and add a description.");
        return;
      }

      const formData = new FormData();
      formData.append('event_picture[image]', {
        uri: selectedFile.uri,
        name: selectedFile.uri.split('/').pop(),
        type: 'image/jpeg',
      });
      formData.append('event_picture[description]', description);

      const response = await fetch(`${NGROK_URL}/api/v1/events/${event_id}/event_pictures/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        fetchEventPhotos();
        setSelectedFile(null);
        setDescription('');
      } else {
        const errorData = await response.text();
        console.error('Failed to upload photo:', errorData);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleImageSelection = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access gallery is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });
    if (!result.canceled) {
      setSelectedFile(result.assets ? result.assets[0] : result);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera is required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });
    if (!result.canceled) {
      const photo = result.assets ? result.assets[0] : result;
      setSelectedFile(photo);
    }
  };

  const fetchUsers = async () => {
    const user_id = await getItem("user_id");
    setLoadingUsers(true);
    try {
      const response = await fetch(`${NGROK_URL}/api/v1/users?user_id=${user_id}&event_id=${event_id}`);
      const data = await response.json();

      const handles = data.map(user => user.handle).filter(Boolean);
      const formattedHandles = handles.map((handle, index) => ({
        id: index.toString(),
        title: `@${handle}`,
      }));
      setUserHandles(formattedHandles);
      console.log("userHandles loaded:", formattedHandles);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUserHandles([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const tagUser = (user) => {
    if (user && user.title) {
      setDescription((prev) => prev + `${user.title} `);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Photo Gallery</Text>

      <View style={styles.uploadSection}>
        <Text style={styles.subtitle}>Upload a New Photo</Text>

        <View style={styles.buttonContainer}>
          <Button title="Select from Gallery" onPress={handleImageSelection} />
          <Button title="Take a Photo" onPress={handleTakePhoto} />
        </View>

        {selectedFile && (
          <Text style={styles.fileName}>{selectedFile.fileName}</Text>
        )}

        <TextInput
          placeholder="Description"
          placeholderTextColor="gray"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />

        <FlatList
          data={userHandles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => tagUser(item)} style={styles.handleItem}>
              <Text style={styles.handleText}>{item.title}</Text>
            </TouchableOpacity>
          )}
          style={styles.handleList}
          ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
        />

        <Button
          title="Upload Photo"
          onPress={handlePhotoUpload}
          disabled={!selectedFile || !description}
          color="#1e88e5"
        />
      </View>

      <View style={styles.photoGrid}>
        {photos.map((photo) => (
          <View key={photo?.id || Math.random()} style={styles.photoCard}>
            <Text style={styles.userHandle}>{photo.user_handle || 'Anon'}</Text>
            <Text style={styles.description}>{photo.description || ''}</Text>
            {photo?.image_url ? (
              <Image
                source={{ uri: photo.image_url }}
                style={styles.photo}
                resizeMode="cover"
              />
            ) : (
              <Text>No image available</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#222',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 16,
  },
  uploadSection: {
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fileName: {
    color: 'white',
    marginBottom: 8,
  },
  input: {
    height: 80,
    backgroundColor: '#333',
    color: 'white',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  handleList: {
    maxHeight: 150,
    marginBottom: 16,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  handleItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  handleText: {
    color: 'white',
  },
  emptyText: {
    color: 'gray',
    padding: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoCard: {
    width: '48%',
    backgroundColor: '#444',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  userHandle: {
    color: 'white',
    marginBottom: 4,
  },
  description: {
    color: 'white',
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: 150,
    borderRadius: 4,
  },
});

export default EventGallery;