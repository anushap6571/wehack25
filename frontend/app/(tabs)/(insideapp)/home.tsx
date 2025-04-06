import { StyleSheet, SafeAreaView, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, {useState} from 'react';

export default function Home() {

    const router = useRouter();
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{paddingHorizontal: 20}}>
                <Pressable
                onPress={() => {
                    router.replace('/(tabs)/signout');
                }}>
                <View style={styles.profileCircle}/>
                </Pressable>
                <Text style={[styles.header, {marginTop: 40}]} >Rising Favorites</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexDirection: 'row', marginVertical: 20}}>
                    <Pressable style={styles.boxes}>
                        <Text>Bob</Text>
                    </Pressable>
                    <Pressable style={styles.boxes}>
                        <Text>Bob</Text>
                    </Pressable>
                    <Pressable style={styles.boxes}>
                        <Text>Bob</Text>
                    </Pressable>
                </ScrollView>
                <Text style={styles.header}>Recommended for you</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexDirection: 'row', marginVertical: 20}}>
                    <Pressable style={styles.boxes}>
                        <Text>Bob</Text>
                    </Pressable>
                    <Pressable style={styles.boxes}>
                        <Text>Bob</Text>
                    </Pressable>
                    <Pressable style={styles.boxes}>
                        <Text>Bob</Text>
                    </Pressable>
                </ScrollView>
                <Text style={styles.header}>Top 10 Stocks</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexDirection: 'row', marginVertical: 20}}>
                    <Pressable style={styles.boxes}>
                        <Text>Bob</Text>
                    </Pressable>
                    <Pressable style={styles.boxes}>
                        <Text>Bob</Text>
                    </Pressable>
                    <Pressable style={styles.boxes}>
                        <Text>Bob</Text>
                    </Pressable>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    profileCircle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#D9D9D9',
        alignSelf: 'flex-end',
    },
    header: {
        color: Colors.light.darkGreen,
        fontSize: 24,
        fontWeight: 'bold',
    }, 
    boxes: {
        width: 225, height: 134, overflow: 'hidden', backgroundColor: 'black', marginRight: 20, borderRadius: 20
    }
})