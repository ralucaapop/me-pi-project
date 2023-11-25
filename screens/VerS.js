
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, {useState} from 'react'; 


const VerificationScreen = ({ route, navigation }) => {
  const { email, generatedCode } = route.params;
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = () => {
    // Validate the entered code against the generated code
    if (verificationCode === generatedCode) {
      // Code is valid, you can proceed with account creation
      Alert.alert('Verification Successful', 'Your account has been successfully verified!');
      const userCredential = createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      // Navigate to the Home screen or any other screen
      navigation.navigate('Home');
      console.log("Signup succesfully")
      sendSignInLinkToEmail(auth, email, actionCodeSettings, emailTemplate);

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
        keyboardType="numeric"
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
