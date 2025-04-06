import { StyleSheet, SafeAreaView, Image, Pressable, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, {useState} from 'react';

export default function Explore() {
    const router = useRouter();
    return (
        <SafeAreaView style={{flex: 1}}>
            <Text>Chat Screen</Text>
        </SafeAreaView>
    )
}