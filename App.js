// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import HomeScreen from './screens/Home'
import ReaderScreen from './screens/ReaderScreen'; 
import WriterScreen from './screens/WriterScreen'; 
import UserProfileScreen from './screens/UserProfileScreen';
import UserProfileScreen2 from './screens/UserProfile2';
import PostDetailScreen from './screens/PostDetailScreen';
import SectionSelectionScreen from './screens/SectionSelectionScreen';
import VerificationScreen from './screens/VerS';
import ChatScreen from './screens/ChatScreen';
import ConversationScreen from './screens/ConversationListScreen';



const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>

<Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ReaderScreen" component={ReaderScreen} />
        <Stack.Screen name="WriterScreen" component={WriterScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="UserProfile2" component={UserProfileScreen2} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        <Stack.Screen name="SectionSelection" component={SectionSelectionScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ConversationListScreen" component={ConversationScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
