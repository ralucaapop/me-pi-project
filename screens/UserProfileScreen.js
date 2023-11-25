// UserProfile.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc, collection, where, query, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';



const UserProfile = () => {
  const currentUser = auth.currentUser;
  const navigation = useNavigation();
  const [likedStories, setLikedStories] = useState([]);

  const [userProfile, setUserProfile] = useState({
    email: '',
    description: '',
  });
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('YourStories');
  const [showUserStories, setShowUserStories] = useState(false);
  const [showLikedStories, setShowLikedStories] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userDocRef);
  
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserProfile({
            email: currentUser.email,
            description: userData?.description || '',
          });
        } else {
          await setDoc(userDocRef, { description: '' });
          setUserProfile({
            email: currentUser.email,
            description: '',
          });
        }
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
  
    const fetchUserStories = async () => {
      try {
        const storiesQuery = query(collection(db, 'stories'), where('userId', '==', currentUser.uid));
        const storiesSnapshot = await getDocs(storiesQuery);
  
        const storiesData = storiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setUserStories(storiesData);
      } catch (error) {
        console.error('Error fetching user stories:', error);
      }
    };
  
    const fetchLikedStories = async () => {
      try {
      
        const likedStoriesQuery = query(collection(db, 'stories'), where('likedBy', 'array-contains', currentUser.uid));
        const likedStoriesSnapshot = await getDocs(likedStoriesQuery);
  
        const likedStoriesData = likedStoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setLikedStories(likedStoriesData);
      } catch (error) {
        console.error('Error fetching liked stories:', error);
      }
    };
  
    if (currentUser) {
      fetchUserData();
      fetchUserStories();
      fetchLikedStories();
    } else {
      setLoading(false);
    }
  }, [currentUser, db, activeTab]);

  const updateDescription = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { description: userProfile.description });
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };
  const toggleUserStories = () => {
    setShowUserStories(!showUserStories);
  };

  const toggleLikedStories = () => {
    setShowLikedStories(!showLikedStories);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const navigateToPostDetail = (postId) => {
    // Navigate to the PostDetail screen with the selected postId
    navigation.navigate('PostDetail', { postId });
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      
      <Text style={styles.email}>Email: {userProfile.email}</Text>
      <Text style={styles.description}>Profile Description: {userProfile.description}</Text>

      <TextInput
        style={styles.descriptionInput}
        placeholder="Enter your profile description"
        value={userProfile.description}
        onChangeText={(text) => setUserProfile({ ...userProfile, description: text })}
        multiline
      />

      <TouchableOpacity style={styles.updateButton} onPress={updateDescription}>
        <Text style={styles.updateButtonText}>Update Description</Text>
      </TouchableOpacity>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'YourStories' && styles.activeTabButton]}
            onPress={() => setActiveTab('YourStories')}
          >
            <Text style={styles.tabButtonText}>Your Stories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'LikedStories' && styles.activeTabButton]}
            onPress={() => setActiveTab('LikedStories')}
          >
            <Text style={styles.tabButtonText}>Liked Stories</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'YourStories' && (
          <>
            <Text style={styles.storiesHeader}>Your Stories:</Text>
            <FlatList
              data={userStories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.storyItem}>
                  <Text style={styles.storyTitle}>{item.title}</Text>
                  <Text style={styles.storySummary}>{item.summary}</Text>
                  <TouchableOpacity style={styles.viewDetailButton} onPress={() => navigateToPostDetail(item.id)}>
                    <Text style={styles.buttonText}>View Post Detail</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        )}

        {activeTab === 'LikedStories' && (
          <>
            <Text style={styles.storiesHeader}>Liked Stories:</Text>
            <FlatList
              data={likedStories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.storyItem}>
                  <Text style={styles.storyTitle}>{item.title}</Text>
                  <Text style={styles.storySummary}>{item.summary}</Text>
                  <TouchableOpacity style={styles.viewDetailButton} onPress={() => navigateToPostDetail(item.id)}>
                    <Text style={styles.buttonText}>View Post Detail</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#FF69B4',
  },
  activeTabButton: {
    backgroundColor: '#FF1493',
  },
  tabButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FCE4EC', // Light pink background
    padding: 16,
  },
  storiesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#FF69B4',
  },

  storyItem: {
    borderWidth: 1,
    borderColor: '#FF69B4',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
 
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FCE4EC', // Light pink background
      padding: 16,
    },
    username: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#FF69B4', // Pink color
    },
    email: {
      fontSize: 16,
      marginBottom: 10,
      color: '#333333',
    },
    description: {
      fontSize: 14,
      marginBottom: 20,
      color: '#333333',
    },
    descriptionInput: {
      borderWidth: 2,
      borderColor: '#FF69B4', // Pink border
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      width: '80%',
      textAlignVertical: 'top',
      backgroundColor: '#FFFFFF', // White background
      color: '#333333',
    },
    updateButton: {
      backgroundColor: '#FF69B4', // Pink background
      padding: 15,
      borderRadius: 8,
      marginTop: 10,
      elevation: 3, // for a slight shadow on Android
      shadowColor: '#000', // for a slight shadow on iOS
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
    },
    updateButtonText: {
      color: '#FFFFFF', // White text
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    storiesHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: '#FF69B4',
    },
  
    storyItem: {
      borderWidth: 2,
      borderColor: '#FF69B4',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
  
    storyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333333',
    },
  
    storySummary: {
      fontSize: 14,
      color: '#555555',
      marginBottom: 8,
    },
  
    viewDetailButton: {
      backgroundColor: '#FF69B4',
      padding: 10,
      borderRadius: 5,
    },
  
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
});

export default UserProfile;
