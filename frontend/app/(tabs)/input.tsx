import { StyleSheet, SafeAreaView, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, {useState} from 'react';



export default function Input() {
    const router = useRouter();

    const [food, setFood] = useState(false);
    const [clothes, setClothes] = useState(false);
    const [sports, setSports] = useState(false);
    const [technology, setTech] = useState(false);
    const [travel, setTravel] = useState(false);
    const [price, setNumber] = useState("");
    const [priceFilled, setPriceFilled] = useState(false);

    const [interests, setInterests] = useState([]);  // Use state to keep track of interests

    const handleNumber = (money : string) => {
        setPriceFilled(true);
        setNumber(money);
    }

    const handlePressed = (category : string) => {
        if(category == "food") {
            setFood(!food);
        }
        else if(category == "clothes") {
            setClothes(!clothes);
        }
        else if(category == "sports") {
            setSports(!sports);
        }
        else if(category == "technology") {
            setTech(!technology);
        }
        else {
            setTravel(!travel);
        }
    }

    const clickedInterest = (category : string) => {
        handlePressed(category);
        // Check if the category is already in the interests array, if not, add it
        setInterests(prevInterests => {
            if (prevInterests.includes(category)) {
                return prevInterests; // Don't add if it's already there
            } else {
                return [...prevInterests, category]; // Add category to the array
            }
        });
    }

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

            <Text style={{marginTop: 50, color: Colors.light.darkGreen, fontSize: 24, fontWeight: 'bold'}}>what interests you?</Text>
            <Pressable onPress={() => {clickedInterest("food")}} style={({pressed}) => [
                styles.categoryButton, {backgroundColor: food ? Colors.light.darkGreen : Colors.light.lightGray}, {color: food ? 'white' : Colors.light.darkGray}
            ]}>
                <Text>food</Text>
            </Pressable>

            <Pressable onPress={() => {clickedInterest("clothes")}} style={({pressed}) => [
                styles.categoryButton, {backgroundColor: clothes ? Colors.light.darkGreen : Colors.light.lightGray} 
            ]}>
                <Text>clothes</Text>
            </Pressable>

            <Pressable onPress={() => {clickedInterest("sports")}} style={({pressed}) => [
                styles.categoryButton, {backgroundColor: sports ? Colors.light.darkGreen : Colors.light.lightGray} 
            ]}>
                <Text>sports</Text>
            </Pressable>

            <Pressable onPress={() => {clickedInterest("technology")}} style={({pressed}) => [
                styles.categoryButton, {backgroundColor: technology ? Colors.light.darkGreen : Colors.light.lightGray} 
            ]}>
                <Text>technology</Text>
            </Pressable>

            <Pressable onPress={() => {clickedInterest("travel")}} style={({pressed}) => [
                styles.categoryButton, {backgroundColor: travel ? Colors.light.darkGreen : Colors.light.lightGray} 
            ]}>
                <Text>travel</Text>
            </Pressable>

            <Text style={{marginTop: 50, color: Colors.light.darkGreen, fontSize: 24, fontWeight: 'bold'}}>max price per stock?</Text>
            <TextInput
                placeholder="20"
                value={price}
                onChangeText={handleNumber}
                style={{textAlign: 'center', marginTop: 20, borderWidth: 2, borderColor:  Colors.light.lightGray, height: 55, paddingHorizontal: 40, borderRadius: 100, fontSize: 14, fontWeight: '700', color: priceFilled ? Colors.light.darkGreen : Colors.light.darkGray}}
            />

            <Pressable
            onPress={() => {
              if(interests.length != 0 && priceFilled) {
                router.replace('/(tabs)/(insideapp)/home');
              } else {
                alert('Incorrect input');
              }
            }}
            style={{marginTop: 40, backgroundColor: Colors.light.darkGreen, height: 55, width: 324, paddingHorizontal: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'white', fontWeight: '600'}}>Login</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white',
    },
    backContainer: {
      width: '100%',
      paddingTop: 20, // Adjust padding as needed
      paddingLeft: 15, // Ensure the back button isn't too close to the edge
    },
    backButton: {
      flexDirection: 'row', // Align the icon and text horizontally
      alignItems: 'center', // Center both the image and text vertically
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 1000,
    },
    backIcon: {
      width: 20, // Set the width of the icon
      height: 20, // Set the height of the icon
      marginRight: 8, // Add space between icon and text
    },
    backText: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.light.darkGray, // Adjust text color if needed
    },
});
