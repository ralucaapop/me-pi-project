// SectionSelectionScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SectionSelectionScreen = ({ navigation }) => {
  const navigateToReader = (section) => {
    // Navigate to the ReaderPage with the selected section
    navigation.navigate('ReaderScreen', { section });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>CHOOSE A SECTION</Text>
      <TouchableOpacity onPress={() => navigateToReader('WOF')}>
        <Text style={styles.sectionButton}>Walk of Fame</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToReader('BR')}>
        <Text style={styles.sectionButton}>Book Recommendation</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToReader('LS')}>
        <Text style={styles.sectionButton}>Story of my Life</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToReader('MR')}>
        <Text style={styles.sectionButton}>Movie Recommendation</Text>
      </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E5D1B8', // Light gray background
  },
  headerText: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#708A81', // Dark text color
    paddingBottom: 20,
  },
  sectionButton: {
    paddingBottom: 13,
    fontSize: 18,
    marginBottom: 12,
    color: '#C54C35', // Blue color
    textDecorationLine: 'none',
  },
});


export default SectionSelectionScreen;
