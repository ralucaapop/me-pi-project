import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebase'; 

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
      navigation.navigate('ReaderScreen');
    } else if (role === 'writer') {
      navigation.navigate('WriterScreen');
    }
  };

  const handleUserProfile = () => {
    // Navigate to the UserProfileScreen
    navigation.navigate('UserProfile');
  };

  return (
    <View style={styles.container}>
        
      <Text style={styles.emailText}>Email: {userEmail}</Text>
        < TouchableOpacity style={styles.signOutButton} onPress={() => handleRoleSelection('writer')}>
            <Text style={styles.buttonText}>Writer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.signOutButton} onPress={() => handleRoleSelection('reader')}>
            <Text style={styles.buttonText}>Reader</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleUserProfile}>
            <Text style={styles.buttonText}>User Profile</Text>
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
  },
  emailText: {
    fontSize: 18,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#ff6347', // Coral color
    padding: 15,
    marginTop: 10,
    borderRadius: 8,
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

