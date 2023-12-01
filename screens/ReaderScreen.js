import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';

const ReaderPage = ({ route }) => {
  const { section } = route.params;
  const [stories, setStories] = useState([]);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [isLiked, setIsLiked] = useState(false);

 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts based on the selected section
        const postsCollection = collection(db, 'stories');
        const sectionQuery = query(postsCollection, where('category', '==', section));
        const unsubscribe = onSnapshot(sectionQuery, (snapshot) => {
          setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe(); // Cleanup the subscription when the component unmounts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [section]);

const navigateToPostDetail = (postId) => {
  // Navigate to the PostDetail screen with the selected postId
  navigation.navigate('PostDetail', { postId });
};

const handleLike = async (postId) => {
  try {
    // Update the like count in the database
    const postRef = doc(db, 'stories', postId);
    await updateDoc(postRef, { likes: increment(1) });
  } catch (error) {
    console.error('Error updating likes:', error);
  }
};


  return (
    <View style={styles.container}>
      
      {section === 'WOF' && (
        <View style={styles.specialSectionContainer}>
          <Text style={styles.specialSectionText}>Walk of fame</Text>
        </View>
      )}

      {section === 'BR' && (
        <View style={styles.specialSectionContainer}>
          <Text style={styles.specialSectionText}>Book Recommendation</Text>
        </View>
      )}

      {section === 'MR' && (
        <View style={styles.specialSectionContainer}>
          <Text style={styles.specialSectionText}>Movie Recommendation</Text>
        </View>
      )}

      {section === 'LS' && (
        <View style={styles.specialSectionContainer}>
          <Text style={styles.specialSectionText}>Story of my Life</Text>
        </View>
      )}

      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.storyContainer}>
            <Text style={styles.titleText} >Title: {item.title}</Text>
            <Text style={styles.summaryText} >Summary: {item.summary}</Text>
            <TouchableOpacity onPress={() => navigateToPostDetail(item.id)}>
              <Text style={styles.buttonText}>View Post Detail</Text>
            </TouchableOpacity>
            <Text>Likes: {item.likedBy.length}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E5D1B8', // Light gray background
  },
  specialSectionContainer: {
    backgroundColor: '#708A81', 
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  specialSectionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dark text color
  },
  storyContainer: {
    backgroundColor: '#FFF', // White color
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333', // Dark text color
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666', // Medium gray text color
  },
  buttonText: {
    color: '#C54C35',
    textDecorationLine: 'none',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReaderPage;
