// UserProfile2.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { db } from '../firebase';
import {collection, query, where, getDocs} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 


const UserProfile2 = ({ route }) => {
  const { writerId } = route.params;
  const [writerProfile, setWriterProfile] = useState({});
  const navigation = useNavigation();
  
  const [userStories, setUserStories] = useState([]);

  useEffect(() => {
    const fetchWriterProfile = async () => {
      try {
        // Fetch details of the user with the specified writerId
        const usersCollectionRef = collection(db, 'users');
        const userQuery = query(usersCollectionRef, where('userId', '==', writerId));
        const userQuerySnapshot = await getDocs(userQuery);

        // Check if the user with the specified userId exists
        if (userQuerySnapshot.docs.length > 0) {
          const userData = userQuerySnapshot.docs[0].data();
          setWriterProfile({ id: userQuerySnapshot.docs[0].id, ...userData });
        } else {
          console.log('User not found');
        }

      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchWriterProfile();
    fetchUserStories();
  }, [writerId]);

  const fetchUserStories = async () => {
    try {
      const storiesQuery = query(collection(db, 'stories'), where('userId', '==', writerId));
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
  const navigateToPostDetail = (postId) => {
    // Navigate to the PostDetail screen with the selected postId
    navigation.navigate('PostDetail', { postId });
  };

  const handleChat = () => {
    // Assuming you have a 'ChatScreen' in your navigation stack
    navigation.navigate('ChatScreen', { writerId: writerId });
  };

  return (
    <View style={styles.container}>
      
    <Text style={styles.username}>Writer's account description: {writerProfile.description}</Text>

    <TouchableOpacity style={styles.chat} onPress={handleChat}>
      <FontAwesome name="comments" size={24} color="#FFF" />
        <Text style={styles.chatButton}>Chat with writer</Text>
    </TouchableOpacity>

    <Text style={styles.storiesHeader}>Writer's stories:</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#E5D1B8',
    },
    username: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#3D0012',
      marginTop: 30,
    },
    storiesHeader: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: '#FFF',
    },
    storyItem: {
      borderWidth: 2,
      borderColor: '#708A81',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      backgroundColor: '#FFF',
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
      backgroundColor: '#C54C35',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    chat: {
      backgroundColor: '#708A81',
      padding: 15,
      borderRadius: 25,
      alignItems: 'center',
    },
    chatButton: {
      fontSize: 18,
      color: '#EBE4F0',
      marginTop: 1,
    },
  });
  
export default UserProfile2;
