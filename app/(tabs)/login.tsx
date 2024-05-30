import React, { useState } from 'react';
import {Alert} from 'react-native';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [buttonPressed, setButtonPressed] = useState(false);

    const handlePressIn = () => {
        setButtonPressed(true);
    };

    const handlePressOut = () => {
        setButtonPressed(false);
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
        });

        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Unexpected response content type: ${contentType}, response: ${text}`);
        }

        const data = await response.json();

        if (response.ok) {
            // succesful login
            Alert.alert('Success', 'User signed in succesfully!');
            // Navigate to next screen or update state as needed
        } else {
            // login error handling
            Alert.alert('Error', data.message || 'Error signing in');
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert('Error', error.message || 'Error signing in');
        } else {
            Alert.alert('Error', 'Unknown error occured');
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
                onPress={handleLogin}
                style={[
                    styles.loginButton,
                    { backgroundColor: buttonPressed ? '#007700' : '#00aa00' },
                ]}
            >
                <Text style={styles.loginButtonText}>Get Tossin'</Text>
            </TouchableHighlight>
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <Text style={styles.signupLink}>Sign up</Text>
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
    loginButton: {
        backgroundColor: '#00aa00',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30, // Round button
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    signupContainer: {
        flexDirection: 'row',
        marginTop: 40,
    },
    signupText: {
        fontSize: 14,
    },
    signupLink: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
