import { StyleSheet, FlatList, SafeAreaView, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter} from 'expo-router';
import Colors from '@/constants/Colors';
import React, {useState, useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';
import { HomeScreenParams } from './types';

export default function Home() {
    const router = useRouter();
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Inside Home.tsx
    const { interestsQuery, price } = router.query as HomeScreenParams || {};  // Safe access with fallback to an empty object

    useEffect(()=>{
      if(!router.isReady) return;
  
      // codes using router.query
  
  }, [router.isReady]);

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
      console.log("Router query:", router.query);
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
            const amount = 200;

            await fetchData(interests, amount, token);
          } catch (error) {
            console.error("Something went wrong fetching token or data:", error);
            setError("Failed to initialize");
          }
        };
        fetchEverything();
    }, []);

    const renderItem = ({item}) => (
        <Pressable
          style={styles.boxes}
          onPress={() => console.log("Selected stock:", item.symbol)}
        >
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={styles.stockImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.stockInfo}>
            <Text style={styles.stockName}>{item.name}</Text>
            <Text style={styles.stockSymbol}>{item.symbol} - ${item.price}</Text>
            <Text style={styles.stockSector}>{item.sector}</Text>
          </View>
        </Pressable>
    );
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{paddingHorizontal: 20}}>
                <Text>Hello, lets get saving!</Text>
                <Pressable
                  onPress={() => {
                    router.replace('/(tabs)/signout');
                  }}>
                  <View style={styles.profileCircle}/>
                </Pressable>
                <Text style={[styles.header, {marginTop: 40}]}>Rising Favorites</Text>
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
                
                <Text style={styles.header}>Top 10 Stocks</Text>
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
        width: 225,
        height: 134,
        overflow: 'hidden',
        backgroundColor: Colors.light.lightGray,
        marginRight: 20,
        borderRadius: 20,
        position: 'relative'
    },
    stockImage: {
        width: '100%',
        height: '50%',
        opacity: 0.7
    },
    stockInfo: {
        padding: 10,
        backgroundColor: 'transparent'
    },
    stockName: {
        fontWeight: 'bold',
        fontSize: 14
    },
    stockSymbol: {
        fontSize: 12,
        marginVertical: 2
    },
    stockSector: {
        fontSize: 10,
        opacity: 0.7
    },
    errorText: {
        color: 'red',
        marginVertical: 10
    }
})