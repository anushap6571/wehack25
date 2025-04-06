import { StyleSheet, SafeAreaView, Image, Pressable, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const LOGIN_URL = 'http://localhost:3000/api/auth/login';

const loginClient = axios.create({
    baseURL: LOGIN_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailInput = (text: string) => {
        setEmail(text);
        setErrorMessage(''); // Clear error message when user types
    };
    
    const handlePasswordInput = (text: string) => {
        setPassword(text);
        setErrorMessage(''); // Clear error message when user types
    };

    const validateInputs = () => {
        if (!email || !password) {
            setErrorMessage('Email and password are required');
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleLogin = async () => {
        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await loginClient.post('', {
                email,
                password,
            });
            
            // Store the authentication token
            if (response.data.token) {
                await SecureStore.setItemAsync('authToken', response.data.token);
            } else {
                throw new Error('No authentication token received');
            }
            
            console.log(response.data.message);
            setIsLoading(false);
            router.replace('/(tabs)/(insideapp)/home');
            
        } catch (error) {
            setIsLoading(false);
            console.log("Error during login:", error);
            
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Incorrect email or password');
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
            
            <Text style={styles.title}>welcome back</Text>
            
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
                onPress={handleLogin}
                disabled={isLoading}
                style={({ pressed }) => [
                    styles.loginButton,
                    { opacity: pressed || isLoading ? 0.7 : 1 }
                ]}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Text>
            </Pressable>

            <View style={styles.signupPrompt}>
                <Text style={styles.signupText}>don't have an account?</Text>
                <Pressable onPress={() => router.push('/signup')} style={styles.signupLink}>
                    <Text style={styles.signupLinkText}>sign up</Text>
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
    loginButton: {
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
    signupPrompt: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 30,
        justifyContent: 'center',
    },
    signupText: {
        fontSize: 14,
    },
    signupLink: {
        marginLeft: 5,
    },
    signupLinkText: {
        color: Colors.light.neonGreen,
        fontSize: 14,
    },
});