import { StyleSheet, SafeAreaView, Image, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, { useState, useRef, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export default function Chat() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    // Load conversation history when component mounts
    useEffect(() => {
        loadConversationHistory();
    }, []);

    const loadConversationHistory = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            
            if (!token) {
                router.replace('/(tabs)/login');
                return;
            }

            const response = await fetch('http://localhost:3000/api/chat/history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    await SecureStore.deleteItemAsync('authToken');
                    router.replace('/(tabs)/login');
                    return;
                }
                throw new Error('Failed to load conversation history');
            }

            const data = await response.json();
            setMessages(data.messages);
            
            // Scroll to bottom after loading messages
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error('Error loading conversation history:', error);
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;
        
        setIsLoading(true);
        
        try {
            const token = await SecureStore.getItemAsync('authToken');
            
            if (!token) {
                alert('Please log in to use the chat feature');
                router.replace('/(tabs)/login');
                return;
            }

            // Add user message to the UI immediately
            const userMessage: Message = {
                role: 'user',
                content: message.trim(),
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, userMessage]);
            setMessage('');
            
            // Scroll to bottom after adding user message
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
            
            // Send the message to the API
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message: message.trim() })
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    await SecureStore.deleteItemAsync('authToken');
                    alert('Your session has expired. Please log in again.');
                    router.replace('/(tabs)/login');
                    return;
                }
                throw new Error('Failed to get response');
            }
            
            const data = await response.json();
            
            // Add assistant message to the UI
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, assistantMessage]);
            
            // Scroll to bottom after adding assistant message
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
            
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, there was an error processing your request. Please try again.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            
            if (!token) {
                router.replace('/(tabs)/login');
                return;
            }

            const response = await fetch('http://localhost:3000/api/chat/history', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to clear history');
            }

            setMessages([]);
        } catch (error) {
            console.error('Error clearing history:', error);
            alert('Failed to clear conversation history');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Financial Assistant</Text>
                <Pressable onPress={clearHistory} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear History</Text>
                </Pressable>
            </View>
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView 
                    ref={scrollViewRef}
                    style={styles.chatContainer}
                    contentContainerStyle={styles.chatContent}
                >
                    {messages.length === 0 ? (
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeText}>
                                Ask me anything about finance, investing, or stocks!
                            </Text>
                        </View>
                    ) : (
                        messages.map((msg, index) => (
                            <View 
                                key={index} 
                                style={[
                                    styles.messageContainer,
                                    msg.role === 'user' ? styles.userMessage : styles.assistantMessage
                                ]}
                            >
                                <Text style={styles.messageText}>{msg.content}</Text>
                            </View>
                        ))
                    )}
                </ScrollView>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your question here..."
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        placeholderTextColor={Colors.light.darkGray}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="send"
                        onSubmitEditing={sendMessage}
                        blurOnSubmit={false}
                    />
                    <Pressable 
                        onPress={sendMessage}
                        disabled={isLoading || !message.trim()}
                        style={({ pressed }) => [
                            styles.sendButton,
                            { opacity: (isLoading || !message.trim()) ? 0.5 : pressed ? 0.8 : 1 }
                        ]}
                    >
                        <Text style={styles.sendButtonText}>
                            {isLoading ? 'Sending...' : 'Send'}
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.lightGray,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.darkGreen,
    },
    clearButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.light.lightGray,
    },
    clearButtonText: {
        color: Colors.light.darkGray,
        fontSize: 14,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    chatContainer: {
        flex: 1,
        padding: 15,
    },
    chatContent: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    welcomeContainer: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: Colors.light.lightGray,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 16,
        color: Colors.light.darkGray,
        textAlign: 'center',
    },
    messageContainer: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: Colors.light.darkGreen,
        alignSelf: 'flex-end',
    },
    assistantMessage: {
        backgroundColor: '#66A796',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.light.lightGray,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.light.lightGray,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 16,
        maxHeight: 100,
        minHeight: 40,
        backgroundColor: '#fff',
        color: Colors.light.darkGray,
    },
    sendButton: {
        backgroundColor: Colors.light.darkGreen,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});