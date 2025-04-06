import { StyleSheet, FlatList, SafeAreaView, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, {useState, useEffect} from 'react';
import Input from '../input';
import * as SecureStore from 'expo-secure-store';


export default function Home() {
    const router = useRouter();
    let finalData = {};

    async function fetchData(interests: string[], price: number, token: string) {
        const recommendedURL = 'http://localhost:3000/api/stocks/recommendations';

        try {
          const response = await fetch(recommendedURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              interests: interests,
              price: 50,
            }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          finalData = data;

          console.log("Final Data", finalData);
      
          // You can update state here with the response data
          // setStockData(data);
      
        } catch (error) {
          console.error("Error fetching stock recommendations:", error);
        }
      }
      
    

    // const [interests, setInterests] = useState([]);
    // const [price, setNumber] = useState(0);

    // const setCategories = () => {
    //     setInterests(["food", "clothes"]);
    // };

    useEffect(() => {
        const fetchEverything = async () => {
          try {
            const token = await SecureStore.getItemAsync("authToken");
            if (!token) {
              console.warn("No token found");
              return;
            }
      
            const interests = ["food"];
            const amount = 100;

            await fetchData(interests, amount, token);
          } catch (error) {
            console.error("Something went wrong fetching token or data:", error);
          }
          console.log("bob");
        };
      
        fetchEverything();
      }, []);

    const renderItem = ({item}) => (
        <Pressable style={styles.boxes}>
                        <Text>{item.name}</Text>
                    </Pressable>
    );

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
                <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={finalData}
                renderItem={renderItem}/>
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