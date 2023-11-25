// PostDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,ScrollView, TouchableOpacity} from 'react-native';
import { db, auth } from '../firebase';
import { collection, doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const PostDetailScreen = ({ route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState({});
  const navigation = useNavigation();
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
          console.log(post.userId);
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

  const navigateToWritterProfile = (writerId) => {
    // Navigate to the PostDetail screen with the selected postId
    navigation.navigate('UserProfile2', { writerId });
  };
  return (
    <ScrollView style={styles.container}>

      <TouchableOpacity onPress={() => navigateToWritterProfile(post.userId)}>
          <Text style={styles.profileButton}>View Writer Profile</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Title: {post.title}</Text>
      <TouchableOpacity  onPress={handleLike}>
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
    backgroundColor: '#FFFFFF',
  },
  profileButton: {
    fontSize: 20,
    color: '#FF79CC', // Orange-Red color
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  summary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF79CC',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  content: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF79CC',
    marginBottom: 5,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  likedBy: {
    fontSize: 16,
    color: '#666',
  },
});
export default PostDetailScreen;