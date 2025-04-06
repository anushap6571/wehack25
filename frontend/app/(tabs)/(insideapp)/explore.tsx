import { StyleSheet, SafeAreaView, Image, Pressable, TextInput, ImageBackground } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, {useState} from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function Explore() {
    const router = useRouter();
    const [likedStatus, setLikedStatus] = useState(false);
    const [dislikedStatus, setDislikedStatus] = useState(false);

    const heartIsPressed = () => {
        setLikedStatus(true);
    }

    const xIsPressed = () => {
        setDislikedStatus(true);
    }

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
                    <View style={{backgroundColor: 'rgba(0,63,45,0.67)', height: 140, width: 140, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 64, fontWeight: 'bold', color: 'white'}}>63</Text>
                    </View>
                    <Text style={{marginTop: 20, color: Colors.light.darkGreen, fontWeight: 'bold', fontSize: 35}}>SouthWest Airlines</Text>
                    <View style={{flexDirection: 'row', backgroundColor: 'transparent', marginTop: 20}}>
                        <Text style={{color: 'white', paddingHorizontal: 20, backgroundColor: Colors.light.darkGreen, borderRadius: 20, paddingVertical: 10, fontWeight: 'bold', fontSize: 16}}>Symbol</Text>
                        <Text style={{marginLeft: 10, color: 'white', paddingHorizontal: 20, backgroundColor: Colors.light.darkGreen, borderRadius: 20, paddingVertical: 10, fontWeight: 'bold', fontSize: 16}}>Price</Text>
                    </View>
                    <View style={{flexDirection: 'row', backgroundColor: 'transparent', marginTop: 15}}>
                        <Text style={{color: Colors.light.darkGray, paddingHorizontal: 40, backgroundColor: Colors.light.lightGray, borderRadius: 20, paddingVertical: 10, fontWeight: 'bold', fontSize: 16}}>Industry</Text>
                        <Text style={{marginLeft: 10, color: Colors.light.darkGray, paddingHorizontal: 40, backgroundColor: Colors.light.lightGray, borderRadius: 20, paddingVertical: 10, fontWeight: 'bold', fontSize: 16}}>Sector</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'center', }}>
                    <Pressable onPress={() => {xIsPressed()}}>
                    <View style={[styles.profileCircle, {marginRight: 30}]}>
                        <Image source={dislikedStatus ? require('@/assets/images/icons/selectedX.png') : require('@/assets/images/icons/unselectedX.png')} style={{height: 25, width: 25}} />
                    </View>
                    </Pressable>

                    <Pressable onPress={() => {heartIsPressed()}}>
                    <View style={styles.profileCircle}>
                        <Image source={likedStatus ? require('@/assets/images/icons/selectedHeart.png') : require('@/assets/images/icons/unselectedHeart.png')} style={{height: likedStatus ? 25 : 36, width: likedStatus ? 25 : 36}} />
                    </View>
                    </Pressable>
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
        justifyContent: 'center',
        alignItems: 'center'
    },
})
