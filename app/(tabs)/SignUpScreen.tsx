// app/(tabs)/SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Unexpected response content type: ${contentType}, response: ${text}`);
      }

      const data = await response.json();

      if (response.ok) {
        // Successful sign up
        Alert.alert('Success', 'User signed up successfully!');
        // Navigate to next screen or update state as needed
      } else {
        // Sign up error handling
        Alert.alert('Error', data.message || 'Error signing up');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message || 'Error signing up');
      } else {
        Alert.alert('Error', 'Unknown error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        autoCorrect={false}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#00aa00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
