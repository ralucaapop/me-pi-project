// ConversationsListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';

const ConversationsListScreen = () => {
  const currentUser = auth.currentUser;
  const [conversations, setConversations] = useState([]);
  const [usersDetails, setUsersDetails] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Query conversations where the user is a participant
        const conversationsQuery = query(
          collection(db, 'conversations'),
          where('participants', 'array-contains', currentUser.uid)
        );

        const conversationsSnapshot = await getDocs(conversationsQuery);
        const loadedConversations = conversationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          participants: doc.data().participants,
        }));

        setConversations(loadedConversations);

        // Fetch user details for each participant
        const participantsIds = loadedConversations
          .flatMap(conversation => conversation.participants)
          .filter(id => id !== currentUser.uid);

        const usersDetailsQuery = query(
          collection(db, 'users'),
          where('userId', 'in', participantsIds)
        );

        const usersDetailsSnapshot = await getDocs(usersDetailsQuery);
        const loadedUsersDetails = {};
        
        usersDetailsSnapshot.forEach(userDoc => {
          loadedUsersDetails[userDoc.data().userId] = userDoc.data().email;
        });

        setUsersDetails(loadedUsersDetails);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [currentUser.uid]);

  const navigateToChat = (participantId) => {
    // Navigate to the ChatScreen with the selected participantId and email
    navigation.navigate('ChatScreen', { writerId: participantId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToChat(item.participants.find(id => id !== currentUser.uid))}>
      <View style={styles.conversationItem}>
        <Text style={styles.conversationText}>{usersDetails[item.participants.find(id => id !== currentUser.uid)]}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ALL MY CONTACTS</Text>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E5D1B8',
  },
  conversationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  conversationText: {
    fontSize: 16,
    color: '#708A81',

  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#C54C35',
    marginEnd: 10,
    textAlign: 'center',
  },
});

export default ConversationsListScreen;
