// PostDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { db } from '../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

const PostDetailScreen = ({ route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState({});
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Fetch details of the specific post
        const postDocRef = doc(db, 'stories', postId);
        const postDoc = await getDoc(postDocRef);

        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });

          // Fetch user email from the user's document
          const userId = postDoc.data().userId;
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserEmail(userDoc.data().email);
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
    <View>
      <Text>Post Detail Screen</Text>
      <Text>User Email: {userEmail}</Text>
      <Text>Title: {post.title}</Text>
      <Text>Summary: {post.summary}</Text>
      <Text>Content: {post.content}</Text>
    </View>
  );
};

export default PostDetailScreen;
