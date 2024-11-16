import React, { useState, useEffect } from 'react'
import { View, Text, Image, TextInput, ScrollView, Alert, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera, Image as ImageIcon, Upload, User, X } from 'lucide-react-native'
import { getItem } from "../../util/Storage"
import { NGROK_URL } from '@env'

const EventGallery = ({ route }) => {
  const { event_id } = route.params
  const [photos, setPhotos] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [description, setDescription] = useState('')
  const [userHandles, setUserHandles] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchEventData()
  }, [event_id])

  const fetchEventData = async () => {
    await fetchEventPhotos()
    await fetchUsers()
  }

  const fetchEventPhotos = async () => {
    try {
      const response = await fetch(`${NGROK_URL}/api/v1/events/${event_id}`)
      const data = await response.json()
      setPhotos(data.event_pictures || [])
    } catch (error) {
      console.error('Error fetching photos:', error)
      setPhotos([])
    }
  }

  const handlePhotoUpload = async () => {
    if (!selectedFile || !description) {
      Alert.alert("Missing Information", "Please select an image and add a description.")
      return
    }

    setUploading(true)
    try {
      const user_id = await getItem("user_id")
      const formData = new FormData()
      formData.append('event_picture[image]', {
        uri: selectedFile.uri,
        name: selectedFile.uri.split('/').pop(),
        type: 'image/jpeg',
      })
      formData.append('event_picture[description]', description)

      const response = await fetch(`${NGROK_URL}/api/v1/events/${event_id}/event_pictures/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        body: formData,
      })

      if (response.ok) {
        await fetchEventPhotos()
        setSelectedFile(null)
        setDescription('')
        Alert.alert("Success", "Photo uploaded successfully!")
      } else {
        const errorData = await response.text()
        console.error('Failed to upload photo:', errorData)
        Alert.alert("Error", "Failed to upload photo. Please try again.")
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      Alert.alert("Error", "An error occurred while uploading the photo.")
    } finally {
      setUploading(false)
    }
  }

  const handleImageSelection = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access gallery is required!')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    })
    if (!result.canceled) {
      setSelectedFile(result.assets[0])
    }
  }

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    })
    if (!result.canceled) {
      setSelectedFile(result.assets[0])
    }
  }

  const fetchUsers = async () => {
    const user_id = await getItem("user_id")
    setLoadingUsers(true)
    try {
      const response = await fetch(`${NGROK_URL}/api/v1/users?user_id=${user_id}&event_id=${event_id}`)
      const data = await response.json()
      const handles = data.map(user => user.handle).filter(Boolean)
      const formattedHandles = handles.map((handle, index) => ({
        id: index.toString(),
        title: `@${handle}`,
      }))
      setUserHandles(formattedHandles)
    } catch (error) {
      console.error('Error fetching users:', error)
      setUserHandles([])
    } finally {
      setLoadingUsers(false)
    }
  }

  const tagUser = (user) => {
    setDescription((prev) => prev + `${user.title} `)
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Event Gallery</Text>

      <View style={styles.uploadSection}>
        <Text style={styles.subtitle}>Upload a New Photo</Text>

        <View style={styles.imagePreviewContainer}>
          {selectedFile ? (
            <>
              <Image source={{ uri: selectedFile.uri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedFile(null)}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <ImageIcon size={48} color="#9CA3AF" />
              <Text style={styles.imagePlaceholderText}>No image selected</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleImageSelection}>
            <ImageIcon size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Add a description..."
          placeholderTextColor="#9CA3AF"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />

        <Text style={styles.subtitle}>Tag Users</Text>
        {loadingUsers ? (
          <ActivityIndicator size="small" color="#FFA500" />
        ) : (
          <FlatList
            data={userHandles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => tagUser(item)} style={styles.handleItem}>
                <User size={16} color="#9CA3AF" />
                <Text style={styles.handleText}>{item.title}</Text>
              </TouchableOpacity>
            )}
            style={styles.handleList}
            ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
            horizontal
          />
        )}

        <TouchableOpacity
          style={[styles.uploadButton, (!selectedFile || !description || uploading) && styles.disabledButton]}
          onPress={handlePhotoUpload}
          disabled={!selectedFile || !description || uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Upload size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Event Photos</Text>
      <View style={styles.photoGrid}>
        {photos.map((photo) => (
          <View key={photo.id} style={styles.photoCard}>
            <Image source={{ uri: photo.image_url }} style={styles.photo} resizeMode="cover" />
            <View style={styles.photoInfo}>
              <Text style={styles.userHandle}>{photo.user_handle || 'Anonymous'}</Text>
              <Text style={styles.description}>{photo.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  uploadSection: {
    marginBottom: 24,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 4,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#9CA3AF',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#374151',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  handleList: {
    maxHeight: 50,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  handleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  handleText: {
    color: '#FFFFFF',
    marginLeft: 4,
  },
  emptyText: {
    color: '#9CA3AF',
    marginHorizontal: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  photoCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 150,
  },
  photoInfo: {
    padding: 8,
  },
  userHandle: {
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 12,
  },
})

export default EventGallery;