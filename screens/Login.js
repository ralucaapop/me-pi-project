import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../firebase';
import { Alert } from 'react-native'; 


const LoginScreen = ({ navigation }) => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful!');
      navigation.navigate('Home');
    } catch (error) {
      if (error.code === 'auth/invalid-login-credentials') {
        Alert.alert('Wrong email or password. Try again');
      }else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid email. Try again');
      }
       else {
        console.error('Login error:', error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      
      <Text style={styles.logoText}>ME</Text>
  

      <View style={styles.inputContainer}>
        <AntDesign name="mail" size={24} color="black" style={styles.icon} />
        <TextInput
          placeholder="Email"
          onChangeText={text => setUsername(text)}
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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupLink}>Don't have an account? Sign up</Text>
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
  
  logoText: {
    fontSize: 94,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 50,
    color: '#3B011E',
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#C54C35', 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
  },
  icon: {
    padding: 10,
  },
  input: {
    height: 40,
    flex: 1,
  },
  passwordInput: {
    flex: 1,
  },
  signupLink: {
    marginTop: 20,
    color: '#708A81', // Hot Pink text color
  },
  loginButton: {
    backgroundColor: '#C54C35', // Hot Pink button color
    padding: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3, // for a slight shadow on Android
    shadowColor: '#000', // for a slight shadow on iOS
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

export default LoginScreen;
