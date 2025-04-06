import { StyleSheet, SafeAreaView, Image, Pressable, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const SIGNUP_URL = 'http://localhost:3000/api/auth/register';

const signUpClient = axios.create({
    baseURL: SIGNUP_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default function SignUp() {
    // Frontend state
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Input handlers
    const handleEmailInput = (text: string) => {
        setEmail(text);
        setErrorMessage(''); // Clear error message when user types
    };

    const handleUsernameInput = (text: string) => {
        setUsername(text);
        setErrorMessage(''); // Clear error message when user types
    };
    
    const handlePasswordInput = (text: string) => {
        setPassword(text);
        setErrorMessage(''); // Clear error message when user types
    };

    // Validation function
    const validateInputs = () => {
        if (!email || !username || !password) {
            setErrorMessage('All fields are required');
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address');
            return false;
        }

        // Password validation (at least 6 characters)
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long');
            return false;
        }

        return true;
    };

    // Backend signup function
    const handleSignUp = async () => {
        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await signUpClient.post('', {
                email,
                password,
                username,
            });
            
            console.log("Sign up successful:", response.data.message);
            
            // Extract token from response
            const { token } = response.data;
            
            if (!token) {
                throw new Error('No token returned from server');
            }
            
            // Save token securely
            await SecureStore.setItemAsync("authToken", token);
            console.log("Token saved to SecureStore");
            
            setIsLoading(false);
            router.push('/input');
            
        } catch (error) {
            setIsLoading(false);
            console.log("Error during sign up:", error);
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("Response data:", error.response.data);
                console.log("Response status:", error.response.status);
                
                if (error.response.status === 400) {
                    // Handle validation errors from server
                    if (error.response.data && error.response.data.message) {
                        setErrorMessage(error.response.data.message);
                    } else {
                        setErrorMessage("Invalid request. Please check your information.");
                    }
                } else if (error.response.status === 409) {
                    // Handle conflict (e.g., email already exists)
                    setErrorMessage("This email or username is already registered.");
                } else {
                    setErrorMessage(`Server error (${error.response.status}). Please try again later.`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log("No response received:", error.request);
                setErrorMessage("No response from server. Please check your connection.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error setting up request:", error.message);
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
        }
    };

    // Input style with error state
    const inputStyle = (hasError) => ({
        marginTop: 20,
        borderWidth: 2,
        borderColor: hasError ? Colors.light.error || 'red' : Colors.light.lightGray,
        height: 55,
        width: 324,
        paddingHorizontal: 20,
        borderRadius: 100,
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.darkGray,
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backContainer}>
                <Pressable onPress={() => router.push('/')}>
                    <View style={styles.backButton}>
                        <Image source={require('@/assets/images/gobackButton.png')} style={styles.backIcon} />
                        <Text style={styles.backText}>Back</Text>
                    </View>
                </Pressable>
            </View>
            
            <Text style={styles.title}>get started</Text>
            
            <TextInput
                style={inputStyle(false)}
                placeholder="enter your email"
                value={email}
                onChangeText={handleEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={inputStyle(false)}
                placeholder="enter your username"
                value={username}
                onChangeText={handleUsernameInput}
                autoCapitalize="none"
            />
            
            <TextInput
                style={inputStyle(false)}
                placeholder="enter your password"
                value={password}
                onChangeText={handlePasswordInput}
                secureTextEntry
                autoCapitalize="none"
            />

            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <Pressable 
                onPress={handleSignUp}
                disabled={isLoading}
                style={({ pressed }) => [
                    styles.signupButton,
                    { opacity: pressed || isLoading ? 0.7 : 1 }
                ]}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                </Text>
            </Pressable>

            <View style={styles.loginPrompt}>
                <Text style={styles.loginText}>already have an account?</Text>
                <Pressable onPress={() => router.push('/login')} style={styles.loginLink}>
                    <Text style={styles.loginLinkText}>login</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    backContainer: {
        width: '100%',
        paddingTop: 20,
        paddingLeft: 15,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    backText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.darkGray,
    },
    title: {
        fontSize: 30,
        color: Colors.light.darkGreen,
        fontWeight: '700',
        marginTop: 100,
        marginBottom: 40,
    },
    errorText: {
        color: 'red',
        marginTop: 15,
        textAlign: 'center',
        maxWidth: 324,
        fontSize: 14,
    },
    signupButton: {
        marginTop: 40,
        backgroundColor: Colors.light.darkGreen,
        height: 55,
        width: 324,
        paddingHorizontal: 20,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    loginPrompt: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 30,
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 14,
    },
    loginLink: {
        marginLeft: 5,
    },
    loginLinkText: {
        color: Colors.light.neonGreen,
        fontSize: 14,
    },
});