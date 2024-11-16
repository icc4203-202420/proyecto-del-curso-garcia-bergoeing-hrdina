import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { Search, UserPlus, MapPin, Beer } from 'lucide-react-native'
import { getItem } from "../../util/Storage"
import { NGROK_URL } from '@env'

const SearchUser = () => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedBar, setSelectedBar] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const userId = await getItem('user_id')
      const response = await axios.get(`${NGROK_URL}/api/v1/users`, {
        params: { user_id: userId },
      })

      const users = Array.isArray(response.data) ? response.data : [response.data]
      const userOptions = users.map(user => ({
        user_id: user.id,
        handle: user.handle,
        events: user.events.map(event => ({
          event_name: event.event_name,
          bar_name: event.bar_name,
          event_id: event.event_id,
          bar_id: event.bar_id,
        })),
      }))

      setOptions(userOptions)
    } catch (error) {
      console.error('Error fetching users:', error)
      setOptions([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddFriend = async () => {
    if (selectedUser) {
      try {
        const userId = await getItem('user_id')
        await axios.post(`${NGROK_URL}/api/v1/users/${userId}/friendships`, {
          friend_id: selectedUser.user_id,
          event_id: selectedBar?.event_id || null,
          bar_id: selectedBar?.bar_id || null,
        })
        Alert.alert('Success', 'Friend request sent!')
      } catch (error) {
        console.error('Error adding friend:', error)
        Alert.alert('Error', 'Failed to send friend request. Please try again.')
      }
    } else {
      Alert.alert('Error', 'Please select a user.')
    }
  }

  const filteredOptions = options.filter(option =>
    option.handle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Friends</Text>
      </View>
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by handle"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {filteredOptions.map(option => (
            <View key={option.user_id} style={styles.userContainer}>
              <TouchableOpacity
                style={[
                  styles.userButton,
                  selectedUser?.user_id === option.user_id && styles.selectedUserButton,
                ]}
                onPress={() => {
                  setSelectedUser(option)
                  setSelectedBar(null)
                }}
              >
                <Text style={styles.userButtonText}>@{option.handle}</Text>
              </TouchableOpacity>
              {selectedUser?.user_id === option.user_id && selectedUser.events.length > 0 && (
                <View style={styles.barContainer}>
                  <Text style={styles.barTitle}>Recent Bars:</Text>
                  <FlatList
                    data={selectedUser.events}
                    keyExtractor={(item) => item.bar_id.toString()}
                    numColumns={2}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.barButton,
                          selectedBar?.bar_id === item.bar_id && styles.selectedBarButton,
                        ]}
                        onPress={() => setSelectedBar(item)}
                      >
                        <MapPin size={16} color="#FFFFFF" style={styles.barIcon} />
                        <Text style={styles.barButtonText}>{item.bar_name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity
        style={[styles.addFriendButton, !selectedUser && styles.disabledButton]}
        onPress={handleAddFriend}
        disabled={!selectedUser}
      >
        <UserPlus size={20} color="#FFFFFF" />
        <Text style={styles.addFriendButtonText}>Add Friend</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    backgroundColor: '#374151',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userContainer: {
    marginBottom: 16,
  },
  userButton: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedUserButton: {
    backgroundColor: '#4B5563',
  },
  userButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  barContainer: {
    marginTop: 8,
  },
  barTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  barButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    flex: 1,
  },
  selectedBarButton: {
    backgroundColor: '#4B5563',
  },
  barIcon: {
    marginRight: 4,
  },
  barButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addFriendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
})

export default SearchUser;