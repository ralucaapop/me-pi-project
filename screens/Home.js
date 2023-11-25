import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebase'; 
import LinearGradient from 'react-native-linear-gradient';

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

  return (
    <View style={styles.container}>
        
        <Text style={styles.welcomeText} >Welcome!</Text>
        <Text style={styles.descriptionText}>Choose your roll</Text>
        <Text style={styles.descriptionText}>get inspired or feel creative, let your imagination take you in</Text>
        < TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelection('writer')}>
            <Text style={styles.buttonText}>Writer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelection('reader')}>
            <Text style={styles.buttonText}>Reader</Text>
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
    backgroundColor: '#FCE4EC', // Misty Rose color
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    color: '#FF69B4', // Hot Pink color
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 15,
    marginLeft: 13,
    marginRight: 13,
    textAlign: 'center',
    color: '#4B0082', // Indigo color
  },
  roleButton: {
    backgroundColor: '#FFC0CB', // Pink color
    padding: 15,
    marginTop: 10,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
  },
  profileButton: {
    backgroundColor: '#FF69B4', // Hot Pink color
    padding: 15,
    marginTop: 80,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#E75B97', 
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

