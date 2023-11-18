import React, { useState, useEffect }  from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { addDoc, collection, serverTimestamp} from 'firebase/firestore';
import { auth } from '../firebase';
import { db } from '../firebase';


const WriterScreen = () => {
  const [storyTitle, setStoryTitle] = useState('');
  const [storySummary, setStorySummary] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Walk Of Fame');

  
    const handleSaveStory = async () => {
       try {
            // Ensure user is authenticated
            const user = auth.currentUser;
            if (!user) {
              console.error('User not authenticated');
              return;
            }
            // Add the story data to Firestore with the user ID
            await addDoc(collection(db, 'stories'), {
              userId: user.uid,
              title: storyTitle,
              summary: storySummary,
              content: storyContent,
              category: selectedCategory,
              timestamp: serverTimestamp(),
        });
        console.log('Story saved successfully to Firebase!');
      } catch (error) {
        console.error('Error saving story to Firebase:', error);
      }
    };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Write Your Story</Text>
      <RNPickerSelect
        placeholder={{ label: 'Select a category...', value: null }}
        onValueChange={(value) => setSelectedCategory(value)}
        style={styles.border}
        items={[
          { label: 'Walk of Fame', value: 'WOF' },
          { label: 'Story of my Life', value: 'LS' },
          { label: 'Book Review', value: 'BR' },
          { label: 'Movie Recommendation', value: 'MR' },
        ]}
      />
      <TextInput
        style={styles.input}
        placeholder="Story Title"
        value={storyTitle}
        onChangeText={setStoryTitle}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Story Summary"
        multiline
        numberOfLines={10} 
        value={storySummary}
        onChangeText={setStorySummary}
      />
      <TextInput
        style={[styles.input, styles.multilineInput, styles.biggerContainer]}
        placeholder="Start typing your story..."
        multiline
        numberOfLines={100} 
        value={storyContent}
        onChangeText={setStoryContent}
      />
      <Button title="Save Story" onPress={handleSaveStory} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#4caf50', // Green color
  },
  input: {
    borderWidth: 2,
    borderColor: '#4caf50',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#333333',
  },
  multilineInput: {
    height: 100,
  },
  biggerContainer: {
    height: 300,
  },
});


export default WriterScreen;