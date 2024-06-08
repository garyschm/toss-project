import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types'; // Adjust the path as necessary
import { auth } from '../../firebaseConfig'; // Adjust the path as necessary
import { createUserWithEmailAndPassword } from 'firebase/auth';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpScreen'>;

const SignUpScreen = () => {
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [buttonPressed, setButtonPressed] = useState(false);

    const handlePressIn = () => {
        setButtonPressed(true);
    };

    const handlePressOut = () => {
        setButtonPressed(false);
    };

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            Alert.alert('Success', 'User registered successfully!');
            navigation.reset({
                index: 0,
                routes: [{ name: '(tabs)' }],
            });
            navigation.navigate('FeedScreen');
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
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
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
                    <Text style={styles.loginLink}>Log in</Text>
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
