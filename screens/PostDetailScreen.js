// PostDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,ScrollView, TouchableOpacity} from 'react-native';
import { db, auth } from '../firebase';
import { collection, doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';

const PostDetailScreen = ({ route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState({});

  const currentUser = auth.currentUser;
  const [isLiked, setIsLiked] = useState(false);

  const likedBy = post?.likedBy || [];

  useEffect(() => {
    setIsLiked(likedBy.includes(currentUser.uid));
  }, [likedBy, currentUser.uid]);
    
  const handleLike = async () => {
    try {
      const postDocRef = doc(db, 'stories', post.id);

      // If already liked, remove user from likedBy
      if (isLiked) {
        await updateDoc(postDocRef, {
          likedBy: arrayRemove(currentUser.uid),
        });
      } else {
        // If not liked, add user to likedBy
        await updateDoc(postDocRef, {
          likedBy: arrayUnion(currentUser.uid),
        });
      }

      // Toggle the like status
      setIsLiked((prevIsLiked) => !prevIsLiked);
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Fetch details of the specific post
        const postDocRef = doc(db, 'stories', postId);
        const postDoc = await getDoc(postDocRef);

        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });

          // Fetch user email from the user's document
          const currentUser = auth.currentUser;
          if (currentUser) {
            setPost((prevPost) => ({ ...prevPost, userEmail: currentUser.email }));
          } else {
            console.log('User not signed in');
          }
        } else {
          console.log('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.userEmail}>User Email: {post.userEmail}</Text>
      <Text style={styles.title}>Title: {post.title}</Text>
      <TouchableOpacity onPress={handleLike}>
        <Text style={{ color: isLiked ? 'red' : 'black' }}>{isLiked ? '❤️' : '🖤'}</Text>
      </TouchableOpacity>
      <Text style={styles.summary}>Summary: </Text>
      <Text>{post.summary}</Text>
      <Text style={styles.content}>Content: </Text>
      <Text>{post.content}</Text>
      <Text>{post.likedBy}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF69B4', // Pink color
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#FF69B4', // Pink color
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  summary: {
    fontSize: 16,
    color: '#666', // Medium gray color
  },
  contentContainer: {
    backgroundColor: '#FFEBEC', // Light pink background
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  content: {
    color: '#FF69B4', // Pink color
  },
});
export default PostDetailScreen;
