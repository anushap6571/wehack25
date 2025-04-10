import { StyleSheet, SafeAreaView, Image, Pressable, TextInput, ImageBackground } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, {useState, useEffect} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';

export default function Explore() {
    const router = useRouter();
    const [likedStatus, setLikedStatus] = useState(false);
    const [dislikedStatus, setDislikedStatus] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const [currentIndex, setCurrentIndex] = useState(0);

    const addLike = () => {

    }
    
    const handleNext = () => {
        if(currentIndex < stockData.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setLikedStatus(false);
            setDislikedStatus(false);
        }
        else {
            console.log("End of recs");
        }
    }

    const heartIsPressed = () => {
        setLikedStatus(true);
        handleNext();
    }

    const xIsPressed = () => {
        setDislikedStatus(true);
        handleNext();
    }

    async function fetchData(interests: string[], price: number, token: string) {
        setLoading(true);
        setError(null);
        const recommendedURL = 'http://localhost:3000/api/stocks/recommendations';

        try {
          console.log("Sending request with:", { interests, price });
          
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
          
          // Filter stocks to only include those that match our interests
          // or have price less than our specified maximum
          const filteredStocks = data.recommendations.filter(stock => 
            stock.matchedInterests.length > 0 || stock.price <= price
          );
          
          console.log("Filtered stocks:", filteredStocks);
          setStockData(filteredStocks);
      
        } catch (error) {
          console.error("Error fetching stock recommendations:", error);
          setError("Failed to load stock recommendations");
        } finally {
          setLoading(false);
        }
    }

    useEffect(() => {
        const fetchEverything = async () => {
          try {
            const token = await SecureStore.getItemAsync("authToken");
            if (!token) {
              console.warn("No token found");
              setError("Authentication required");
              return;
            }
      
            // Try using more specific interest categories that might match your API's categorization
            const interests = ["food"];
            const amount = 100;

            await fetchData(interests, amount, token);
          } catch (error) {
            console.error("Something went wrong fetching token or data:", error);
            setError("Failed to initialize");
          }
        };
      
        fetchEverything();
    }, []);

    const currentStock = stockData[currentIndex];

    if (loading) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Loading...</Text></View>;
    if (error) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>{error}</Text></View>;
    if (!currentStock) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>No stocks to display.</Text></View>;

    return (
            <ImageBackground 
                source={{ uri: currentStock.image }}
                style={{flex: 1}}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 1)']}  // From transparent to black with opacity
                    style={{ flex: 1, padding: 20, justifyContent: 'flex-end'}}  // Take up the entire space
                >
                <View style={{backgroundColor: 'transparent', paddingBottom: 20}}> {/* Padding to give some space from the bottom */}
                    <View style={{backgroundColor: 'rgba(0,63,45,0.67)', height: 140, width: 140, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 64, fontWeight: 'bold', color: 'white'}}>{currentStock.recommendationScore ?? 0}</Text>
                    </View>
                    <Text style={{marginTop: 20, color: Colors.light.darkGreen, fontWeight: 'bold', fontSize: 35}}>{currentStock.name ?? 'Unknown Company'}</Text>
                    <View style={{flexDirection: 'row', backgroundColor: 'transparent', marginTop: 20}}>
                        <Text style={{color: 'white', paddingHorizontal: 20, backgroundColor: Colors.light.darkGreen, borderRadius: 20, paddingVertical: 10, fontWeight: 'bold', fontSize: 16}}>{currentStock.symbol ?? 'N/A'}</Text>
                        <Text style={{marginLeft: 10, color: 'white', paddingHorizontal: 20, backgroundColor: Colors.light.darkGreen, borderRadius: 20, paddingVertical: 10, fontWeight: 'bold', fontSize: 16}}>{currentStock.price}</Text>
                    </View>
                    <View style={{flexDirection: 'row', backgroundColor: 'transparent', marginTop: 15}}>
                        <Text style={{color: Colors.light.darkGray, paddingHorizontal: 40, backgroundColor: Colors.light.lightGray, borderRadius: 20, paddingVertical: 10, fontWeight: 'bold', fontSize: 16}}>{currentStock.industry ?? 'N/A'}</Text>
                        <Text style={{marginLeft: 10, color: Colors.light.darkGray, paddingHorizontal: 40, backgroundColor: Colors.light.lightGray, borderRadius: 20, paddingVertical: 10, fontWeight: 'bold', fontSize: 16}}>{currentStock.sector ?? 'N/A'}</Text>
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
