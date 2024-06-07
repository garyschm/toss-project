import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import NativeStackNavigationProp
import { RootStackParamList } from '../../types/types'; // Adjust the path as necessary

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>(); // Initialize useNavigation hook with type
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
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); // Fetch the response data

            if (response.ok) {
                Alert.alert('Success', 'User signed in successfully!');
                navigation.reset({
                    index: 0,
                    routes: [{ name: '(tabs)' }],
                });
            } else {
                Alert.alert('Error', data.message || 'Error signing in');
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', error.message || 'Error signing in');
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
                <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                    <Text style={styles.signupLink}>Sign up</Text>
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
