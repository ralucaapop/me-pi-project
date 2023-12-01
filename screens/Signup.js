
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity,KeyboardAvoidingView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../firebase';
import { getAuth, createUserWithEmailAndPassword,sendSignInLinkToEmail  } from 'firebase/auth';
import { Alert } from 'react-native'; 
import emailjs from 'emailjs-com';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const generatedCode = Math.floor(1000 + Math.random() * 9000);

  const sendEmail = async () => {
    try {
      const templateParams = {
        code: generatedCode,
        email: email,
      };
 
      const response = await emailjs.send(
        'service_xhrfr5c', 
        'template_6zs0u2a', 
        templateParams,
        'M2nZ6qEBEoijAaW4m'
      );

      console.log('Email sent successfully:', response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleSignup = async () => {
    try {
      // Create a user account with email and password
      //const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      //const user = userCredential.user;

        sendEmail();
        Alert.alert(
          'Email Verification Sent',
          'A verification email has been sent. Please check your email and follow the instructions to complete the sign-up process.'
        );
      
        navigation.navigate('Verification', { email, password, generatedCode });
      
    } catch (error) {
      console.error('Error creating user:', error.code, error.message);
    }
  };


  return (
    
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title1}>join to our beautiful comunity</Text>
      <Text style={styles.title2}>share your story and ideas with us</Text>
    
      <View style={styles.inputContainer}>
        <AntDesign name="mail" size={24} color="black" style={styles.icon} />
        <TextInput
          placeholder="Email"
          onChangeText={text => setUserEmail(text)}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

       <View style={styles.inputContainer}>
        <AntDesign name="lock" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="gray" style={styles.icon} />
        </TouchableOpacity>

      </View>

     <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#E5D1B8',
  },
  logo: {
    height: 100,
    marginBottom: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#708A81',
    marginEnd: 10,
  },
  title1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#708A81',
    textTransform: 'uppercase'
  },
  title2: {
    fontSize: 17,
    fontWeight: 'bold',
    justifyContent: 'center',
    marginBottom: 20,
    color: '#708A81',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F4F4F4',
    borderRadius: 5,
    width: '100%',
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: '#333333',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: '#333333',
  },
  signupButton: {
    backgroundColor: '#C54C35',
    padding: 15,
    borderRadius: 8,
    width: '100%',
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
    fontWeight: 'bold'
  },
});

export default SignupScreen;
