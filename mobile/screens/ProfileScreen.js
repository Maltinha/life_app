import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';


export default function ProfileScreen({navigation}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('No profile info available.');
        return;
      }

      // --- Get user info ---
      const response = await fetch('http://192.168.1.120:8080/api/profile/getInfo', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Error fetching profile.");
        return;
      }

      const data = await response.json();
      setUser({
        username: data.username,
        email: data.email,
      });

      // --- Get user image ---
      const imageResponse = await fetch('http://192.168.1.120:8080/api/profile/getImage', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (imageResponse.ok) {
        const blob = await imageResponse.blob();
        const reader = new FileReader();
        reader.onloadend = () => setImageBase64(reader.result);
        reader.readAsDataURL(blob);
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Call it once when component mounts
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Now update uploadImage to call it again after upload
  const uploadImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access gallery was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;

      const image = result.assets[0];
      const token = await AsyncStorage.getItem('userToken');

      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: 'image/jpeg',
        name: user.username + '.jpg'
      });

      const response = await fetch('http://192.168.1.120:8080/api/profile/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await response.text();

      if (!response.ok) {
        setError(text || 'Error uploading image.');
        return;
      }

      alert('Profile image updated successfully!');
      await fetchProfile(); //Re-fetch updated profile immediately
    } catch (err) {
      setError('Connection error: ' + err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#148d75ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileRow}>
        {imageBase64 ? (
          <Image source={{ uri: imageBase64 }} style={styles.image} />
        ) : (
          <ActivityIndicator size="small" color="#148d75ff" />
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.username}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
        <Text style={styles.uploadText}>Change Profile Image</Text>
      </TouchableOpacity>

       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
         <Ionicons name="home" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
    borderColor: '#148d75ff',
    borderWidth: 3
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
    profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText:{
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#148d75ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    zIndex: 10,
    elevation: 3,
  },   
  backButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#148d75ff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 4,
  }
});
