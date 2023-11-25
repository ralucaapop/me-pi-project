import React, { useState, useEffect }  from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { addDoc, collection, serverTimestamp} from 'firebase/firestore';
import { auth } from '../firebase';
import { db } from '../firebase';
import emailjs from 'emailjs-com';

const WriterScreen = ({navigation}) => {
  const [storyTitle, setStoryTitle] = useState('');
  const [storySummary, setStorySummary] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Walk Of Fame');

  const sendEmail = async (storyContent,storyTitle,storySummary) => {
    try {
      const templateParams = {
        email: auth.currentUser.email,
        subject: 'Your Story has been posted!',
        message: 'Thank you for posting your story. It has been successfully saved.',
        storyC: storyContent,
        storyTitle: storyTitle,
        storySummary: storySummary,
      };

      
      const response = await emailjs.send(
        'service_xhrfr5c', 
        'template_fqd0s5i', 
        templateParams,
        'M2nZ6qEBEoijAaW4m'
      );

      console.log('Email sent successfully:', response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

    const handleSaveStory = async () => {
       try {
           
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
              likedBy: [],
              timestamp: serverTimestamp(),
        });
       
        console.log('Story saved successfully to Firebase!');
        sendEmail(storyContent,storyTitle,storySummary);
      } catch (error) {
        console.error('Error saving story to Firebase:', error);
      }
      navigation.navigate('Home');
    };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Write Your Story</Text>
      <RNPickerSelect
        placeholder={{ label: 'Select a category...', value: null }}
        onValueChange={(value) => setSelectedCategory(value)}
        style={pickerSelectStyles}
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
       <TouchableOpacity style={styles.buttons} onPress={handleSaveStory}>
        <Text style={styles.buttonText}>Save Story</Text>
      </TouchableOpacity>
  
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#FCE4EC', // Light pink background
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#FF69B4', // Pink color
  },
  input: {
    borderWidth: 2,
    borderColor: '#FF69B4', // Pink border
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF', // White background
    fontSize: 16,
    color: '#333333',
  },
  multilineInput: {
    height: 100,
  },
  biggerContainer: {
    height: 300,
  },
  buttons: {
    backgroundColor: '#FF69B4', // Pink background
    color: '#FFFFFF', // White text
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3, // for a slight shadow on Android
    shadowColor: '#000', // for a slight shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#FF69B4',
    borderRadius: 8,
    color: '#333333',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#FF69B4',
    borderRadius: 8,
    color: '#333333',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
});
export default WriterScreen;