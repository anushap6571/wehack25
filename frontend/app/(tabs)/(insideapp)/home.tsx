import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Image, Pressable, TextInput, FlatList, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const GETDATA_URL = 'http://localhost:3000/api/auth/getUserInterests';

export default function InputAndHome() {
    const router = useRouter();
    const [food, setFood] = useState(false);
    const [clothes, setClothes] = useState(false);
    const [sports, setSports] = useState(false);
    const [technology, setTech] = useState(false);
    const [travel, setTravel] = useState(false);
    const [price, setPrice] = useState('');
    const [priceFilled, setPriceFilled] = useState(false);
    const [interests, setInterests] = useState<string[]>([]);
    const [isInputDone, setIsInputDone] = useState(false);
    const [stockData, setStockData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleNumber = (money: string) => {
        setPrice(money);
        setPriceFilled(true);
    };

    const handlePressed = (category: string) => {
        if (category === "food") setFood(!food);
        else if (category === "clothes") setClothes(!clothes);
        else if (category === "sports") setSports(!sports);
        else if (category === "technology") setTech(!technology);
        else setTravel(!travel);
    };

    const clickedInterest = (category: string) => {
        handlePressed(category);
        setInterests((prevInterests) => {
            if (prevInterests.includes(category)) {
                return prevInterests;
            } else {
                return [...prevInterests, category];
            }
        });
    };

    const fetchData = async (interests: string[], price: number, token: string) => {
        setLoading(true);
        setError(null);
        const recommendedURL = 'http://localhost:3000/api/stocks/recommendations';
        try {
            const response = await fetch(recommendedURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache, no-store',
                },
                body: JSON.stringify({
                    interests: interests,
                    price: price,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const filteredStocks = data.recommendations.filter((stock: any) =>
                stock.matchedInterests.length > 0 || stock.price <= price
            );
            setStockData(filteredStocks);
        } catch (error) {
            setError('Failed to load stock recommendations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        const fetchEverything = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                // const interests = userData.interests;
                // const amount = userData.price;

                await fetchData(interests, parseInt(price), token);
            } catch (error) {
                setError(`Failed to initialize: ${error.message}`);
            }
        };

        if (isInputDone && interests.length && priceFilled) {
            fetchEverything();
        }
    }, [isInputDone, interests, priceFilled]);

    const renderItem = ({ item }: { item: any }) => (
        <Pressable
            style={styles.boxes}
            onPress={() => console.log('Selected stock:', item.symbol)}
        >
            {item.image && (
                <Image source={{ uri: item.image }} style={styles.stockImage} resizeMode="cover" />
            )}
            <View style={styles.stockInfo}>
                <Text style={styles.stockName}>{item.name}</Text>
                <Text style={styles.stockSymbol}>{item.symbol} - ${item.price}</Text>
                <Text style={styles.stockSector}>{item.sector}</Text>
            </View>
        </Pressable>
    );

    if (!isInputDone) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Pressable onPress={() => router.push('/')}>
                        <View style={{flex: 1, marginRight: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={require('@/assets/images/gobackButton.png')} style={styles.backIcon} />
                            <Text style={styles.backText}>Back</Text>
                        </View>
                    </Pressable>
                </View>

                <Pressable onPress={() => {clickedInterest("food")}} style={({pressed}) => [
                styles.categoryButton, {backgroundColor: food ? Colors.light.lightGreen : Colors.light.lightGray}, {color: food ? 'white' : Colors.light.darkGray}
            ]}>
                <Text>food</Text>
            </Pressable>

            <Pressable onPress={() => {clickedInterest("clothes")}} style={({pressed}) => [
                styles.categoryButton, {backgroundColor: clothes ? Colors.light.lightGreen : Colors.light.lightGray} 
            ]}>
                <Text>clothes</Text>
            </Pressable>

            <Pressable onPress={() => {clickedInterest("sports")}} style={({pressed}) => [
                styles.categoryButton, {backgroundColor: sports ? Colors.light.lightGreen : Colors.light.lightGray} 
            ]}>
                <Text>sports</Text>
            </Pressable>

            <Pressable onPress={() => {clickedInterest("technology")}} style={({pressed}) => [
                styles.categoryButton, {backgroundColor: technology ? Colors.light.lightGreen : Colors.light.lightGray} 
            ]}>
                <Text>technology</Text>
            </Pressable>

            <Pressable onPress={() => {clickedInterest("travel")}} style={({pressed}) => [
                styles.categoryButton, {backgroundColor: travel ? Colors.light.lightGreen : Colors.light.lightGray} 
            ]}>
                <Text>travel</Text>
            </Pressable>

                <Text style={styles.headerText}>Max price per stock?</Text>
                <TextInput
                    placeholder="20"
                    value={price}
                    onChangeText={handleNumber}
                    style={styles.priceInput}
                />

                <Pressable
                    onPress={() => {
                        if (interests.length && priceFilled) {
                            setIsInputDone(true);
                        } else {
                            alert('Incorrect input');
                        }
                    }}
                    style={styles.nextButton}
                >
                    <Text style={styles.nextText}>Next</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
              <Text>Hello, lets get saving!</Text>
                  <Pressable
                    onPress={() => {
                      router.replace('/(tabs)/signout');
                    }}>
                    <View style={styles.profileCircle}/>
                  </Pressable>
                <Text style={styles.header}>Rising Favorites</Text>
                {loading ? (
                    <Text>Loading stocks...</Text>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : stockData.length === 0 ? (
                    <Text>No matching stocks found. Try adjusting your criteria.</Text>
                ) : (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={stockData}
                        keyExtractor={(item) => item.symbol}
                        renderItem={renderItem}
                    />
                )}

                <Text style={styles.header}>Recommended for you</Text>
                {loading ? (
                    <Text>Loading stocks...</Text>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : stockData.length === 0 ? (
                    <Text>No matching stocks found. Try adjusting your criteria.</Text>
                ) : (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={stockData}
                        keyExtractor={(item) => item.symbol}
                        renderItem={renderItem}
                    />
                )}
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
    profileCircle: {
      height: 40,
      width: 40,
      borderRadius: 20,
      backgroundColor: '#D9D9D9',
      alignSelf: 'flex-end',
  },
    contentContainer: {
        paddingHorizontal: 0,
    },
    headerText: {
        marginTop: 50,
        color: Colors.light.darkGreen,
        fontSize: 24,
        fontWeight: 'bold',
    },
    priceInput: {
        textAlign: 'center',
        marginTop: 20,
        borderWidth: 2,
        borderColor: Colors.light.lightGray,
        height: 55,
        paddingHorizontal: 20,
        borderRadius: 100,
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.darkGray,
    },
    categoryButton: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 1000,
    },
    nextButton: {
        marginTop: 40,
        backgroundColor: Colors.light.darkGreen,
        height: 55,
        width: 324,
        paddingHorizontal: 20,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextText: {
        color: 'white',
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        marginVertical: 10,
    },
    header: {
        color: Colors.light.darkGreen,
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    boxes: {
        marginTop: 20,
        width: 225,
        height: 134,
        overflow: 'hidden',
        backgroundColor: Colors.light.lightGray,
        marginRight: 20,
        borderRadius: 20,
        position: 'relative',
    },
    stockImage: {
        width: '100%',
        height: '50%',
        opacity: 0.7,
    },
    stockInfo: {
        padding: 10,
        backgroundColor: 'transparent',
    },
    stockName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    stockSymbol: {
        fontSize: 12,
        marginVertical: 2,
    },
    stockSector: {
        fontSize: 10,
        opacity: 0.7,
    },
});
