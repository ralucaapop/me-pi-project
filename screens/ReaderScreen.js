import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ReaderPage = () => {
  const [stories, setStories] = useState([]);
  const navigation = useNavigation();
  
  useEffect(() =>{
    const newPost = onSnapshot(collection(db, 'stories'), (snapshot) =>{
    setStories(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    });
    return newPost
}, []);

const navigateToPostDetail = (postId) => {
  // Navigate to the PostDetail screen with the selected postId
  navigation.navigate('PostDetail', { postId });
};

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Reader Page</Text>

      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.storyContainer}>
            <Text>Title: {item.title}</Text>
            <Text>Summary: {item.summary}</Text>
            <Text>Content: {item.content}</Text>
            <TouchableOpacity onPress={() => navigateToPostDetail(item.id)}>
              <Text style={styles.buttonText}>View Post Detail</Text>
            </TouchableOpacity>
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
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  storyContainer: {
    marginBottom: 16,
  },
});

export default ReaderPage;
