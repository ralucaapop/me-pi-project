
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, {useState} from 'react'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, serverTimestamp} from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';

const VerificationScreen = ({ route, navigation }) => {
  const { email, password, generatedCode } = route.params;
  const [verificationCode, setVerificationCode] = useState();
  
  const handleVerify = async () => {
    const codeAsNumber = parseInt(verificationCode, 10);
    console.log(generatedCode);
    console.log(verificationCode);
    if (codeAsNumber === generatedCode) {
      Alert.alert('Verification Successful', 'Your account has been successfully verified!');
     
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        await addDoc(collection(db, 'users'), {
          userId: user.uid,
          email: email,
          description: "profile description",
          timestamp: serverTimestamp(),
    });
        navigation.navigate('Home');
        console.log("Signup successfully");
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Email Already Exists', 'This email address is already associated with an account. Please sign in or use a different email address.');
          navigation.navigate('Signup');
        }else if (error.code === 'auth/weak-password') {
          Alert.alert('Weak Password', 'Please choose a stronger password(minimum 7 characters).');
          navigation.navigate('Signup');
        }else { Alert.alert("Somethig went wrong, try aiagin")
          console.error('Error creating user:', error.code, error.message);
        }
      }
    } else {
      // Code is invalid
      Alert.alert('Invalid Code', 'Please enter the correct verification code.');
    }
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        Please check your email ({email}) for the verification code.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={(text) => setVerificationCode(text)}
        keyboardType='numeric'
      />
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#E6C2D1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF69B4',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F4F4F4',
    borderRadius: 5,
  },
  verifyButton: {
    backgroundColor: '#FF69B4',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VerificationScreen;
