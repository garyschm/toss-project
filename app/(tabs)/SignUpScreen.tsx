import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import NativeStackNavigationProp
import { RootStackParamList } from '../../types/types'; // Adjust the path as necessary

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpScreen'>;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>(); // Initialize useNavigation hook with type
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonPressed, setButtonPressed] = useState(false);

  const handlePressIn = () => {
    setButtonPressed(true);
  };

  const handlePressOut = () => {
    setButtonPressed(false);
  };

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
        navigation.navigate('FeedScreen'); // Navigate to FeedScreen after sign up
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
      <Text style={styles.logo}>
        T<Ionicons name="dice-outline" size={50} color="black" />ss
      </Text>
      <View style={styles.inputContainer}>
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
      </View>
      <TouchableHighlight
        activeOpacity={1}
        underlayColor="#88dd88"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleSignUp}
        style={[
          styles.signupButton,
          { backgroundColor: buttonPressed ? '#007700' : '#00aa00' },
        ]}
      >
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableHighlight>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    width: '80%',
    marginTop: 30,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  signupButton: {
    backgroundColor: '#00aa00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30, // Round button
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;
