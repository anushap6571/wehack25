import { StyleSheet, SafeAreaView, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, {useState} from 'react';
import { Router } from 'expo-router';

export default function SignOut() {
    const router = useRouter();

    return (
        <SafeAreaView>
            <Text>Sign Out</Text>
            <Pressable
            onPress={() => {
                router.replace('/(tabs)');
            }}
            style={{marginTop: 40, backgroundColor: Colors.light.lightGreen, height: 55, width: 324, paddingHorizontal: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'white', fontWeight: '600'}}>Sign Out</Text>
            </Pressable>
        </SafeAreaView>
    )
}