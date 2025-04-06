import { StyleSheet, SafeAreaView, Image, Pressable, TextInput, ImageBackground } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, {useState} from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function Explore() {
    const router = useRouter();
    return (
            <ImageBackground 
                source={require('@/assets/images/dummyImages/southwest.jpg')} 
                style={{flex: 1}}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 1)']}  // From transparent to black with opacity
                    style={{ flex: 1, padding: 20, justifyContent: 'flex-end'}}  // Take up the entire space
                >
                <View style={{backgroundColor: 'transparent', paddingBottom: 20}}> {/* Padding to give some space from the bottom */}
                    <Text style={{color: 'white', fontSize: 24}}>Name</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent'}}>
                        <Text style={{color: 'white'}}>Symbol</Text>
                        <Text style={{color: 'white'}}>Price</Text>
                    </View>
                    <Text style={{color: 'white', fontSize: 18}}>Risk #</Text>
                </View>
                <View style={{flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'center', }}>
                    <View style={[styles.profileCircle, {marginRight: 30}]}/>
                    <View style={styles.profileCircle}/>
                </View>
                </LinearGradient>
            </ImageBackground>
    );
}

const styles = StyleSheet.create({
    profileCircle: {
        height: 58,
        width: 58,
        borderRadius: 100,
        backgroundColor: '#D9D9D9',
        alignSelf: 'flex-end',
    },
})
