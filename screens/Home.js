import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebase'; 
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 


const HomeScreen = ({ navigation }) => {
  // Retrieve the currently authenticated user's email
  const userEmail = auth.currentUser ? auth.currentUser.email : 'No user';

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log('Sign-out successful!');
      navigation.navigate('Login'); // Navigate to the Login screen
    } catch (error) {
      console.error('Sign-out error:', error.message);
    }
  };

const handleRoleSelection = (role) => {
    console.log('Selected Role:', role);

    if (role === 'reader') {
      navigation.navigate('SectionSelection');
    } else if (role === 'writer') {
      navigation.navigate('WriterScreen');
    }
  };

  const handleUserProfile = () => {
    // Navigate to the UserProfileScreen
    navigation.navigate('UserProfile');
  };

  const handleChat = () => {
    navigation.navigate('ConversationListScreen');
  };

  return (
    <View style={styles.container}>
        
        <Text style={styles.welcomeText} >Welcome!</Text>
        <Text style={styles.descriptionText}>Choose your role</Text>
        <Text style={styles.descriptionText}>get inspired or feel creative, let your imagination take you in</Text>
        < TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelection('writer')}>
            <Text style={styles.buttonText}>Writer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelection('reader')}>
            <Text style={styles.buttonText}>Reader</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chat} onPress={handleChat}>
          <FontAwesome name="comments" size={24} color="#FCE4EC" />
          <Text style={styles.chatButton}>Keep in touch with others</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton} onPress={handleUserProfile}>
            <Text style={styles.buttonText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5D1B8', // Misty Rose color
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    color: '#C54C35', // Hot Pink color
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 15,
    marginLeft: 13,
    marginRight: 13,
    textAlign: 'center',
    color: '#24674F', // Indigo color
  },
  chatButton: {
    fontSize: 18,
    color: '#EBE4F0',
    marginTop: 1,
  },
  roleButton: {
    backgroundColor: '#3D001E', // Pink color
    padding: 15,
    marginTop: 10,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
  },
  profileButton: {
    backgroundColor: '#993520', // Hot Pink color
    padding: 15,
    marginTop: 80,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
  },
  chat: {
    backgroundColor: '#EC846F', // Hot Pink color
    padding: 15,
    marginTop: 80,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#993520', 
    padding: 15,
    marginTop: 10,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

