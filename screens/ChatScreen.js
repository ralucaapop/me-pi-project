// ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, Button, StyleSheet } from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const getUserEmail = async (userId) => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const userQuery = query(usersCollectionRef, where('userId', '==', userId));
      const userQuerySnapshot = await getDocs(userQuery);
  
      if (userQuerySnapshot.docs.length > 0) {
        // Assuming there's only one user with the given userId
        const userEmail = userQuerySnapshot.docs[0].data().email;
        console.log('User Email:', userEmail);
        return userEmail;
      } else {
        console.log('User not found');
        return null; // or handle accordingly based on your use case
      }
    } catch (error) {
      console.error('Error fetching user email:', error);
      return null; // or handle accordingly based on your use case
    }
  };

  const ChatScreen = ({ route }) => {
  const { writerId } = route.params;
  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const flatListRef = useRef(null);
    
  useEffect(() => {
    const writerEmail= getUserEmail(writerId)
    const fetchConversationId = async () => {
      try {
        // Query conversations where the user is a participant
        const conversationsQuery = query(
          collection(db, 'conversations'),
          where('participants', 'array-contains', currentUser.uid)
        );

        const conversationsSnapshot = await getDocs(conversationsQuery);

        // Find the conversation with the specified writer
        const matchingConversation = conversationsSnapshot.docs.find(doc =>
          doc.data().participants.includes(writerId)
        );

        if (matchingConversation) {
          setConversationId(matchingConversation.id);
        } else {
          // If no conversation exists, create a new one
          const newConversation = await addDoc(collection(db, 'conversations'), {
            participants: [currentUser.uid, writerId],
          });

          console.log('New Conversation ID:', newConversation.id);

          setConversationId(newConversation.id);
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    fetchConversationId();
  }, [currentUser.uid, writerId]);

  useEffect(() => {
    if (conversationId) {
      const fetchMessages = async () => {
        try {
          // Query messages using the conversationId and orderBy timestamp
          const messagesQuery = query(
            collection(db, 'conversations', conversationId, 'messages'),
            orderBy('timestamp', 'asc')
          );

          const messagesSnapshot = await getDocs(messagesQuery);
          const loadedMessages = messagesSnapshot.docs.map((doc) => doc.data());
          setMessages(loadedMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [conversationId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        content: newMessage,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
      });

      setNewMessage('');

      // After sending the message, fetch the updated list of messages
      const updatedMessagesQuery = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const updatedMessagesSnapshot = await getDocs(updatedMessagesQuery);
      const updatedLoadedMessages = updatedMessagesSnapshot.docs.map((doc) => doc.data());
      setMessages(updatedLoadedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.senderId === currentUser.uid ? styles.userMessageContainer : styles.writerMessageContainer}>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
    </View>
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp?.seconds * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.timestamp.toString()}
        renderItem={renderItem}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        ref={flatListRef}
        style={styles.flatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type your message"
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          style={styles.input}
        />
        <Button style={styles.sendButton} title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5D1B8'
  },
  flatList: {
    flex: 1,
    padding: 16,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#708A81', // Green background for user messages
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: '70%',
  },
  writerMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#C54C35', // Blue background for writer messages
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: '70%',
  },
  messageText: {
    color: '#ecf0f1',
    fontSize: 16,
  },
  timestampText: {
    color: '#bdc3c7',
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#C54C35',
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
  },
  input: {
    flex: 1,
    marginRight: 8,
    color: '#E0E0E0',
    padding: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor:'#C54C35',
    color: '#FFF',
  },
});

export default ChatScreen;
