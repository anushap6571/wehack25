import { StyleSheet, SafeAreaView, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, {useState} from 'react';
import { Router } from 'expo-router';

export default function SignOut() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <SafeAreaView style={styles.container}>
            <View style={{marginTop: 50, borderRadius: 150, height: 215, width: 215, backgroundColor: Colors.light.lightGray, alignSelf: 'center'}}/>
            <Text style={{alignSelf: 'center', fontSize: 35, color: Colors.light.darkGreen, fontWeight: 'bold', marginTop: 20}}>Username</Text>
            <Text style={{alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 24, color: Colors.light.lightGreen, marginTop: 20}}>Favorites</Text>
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

            <Pressable
            onPress={() => {
                router.replace('/');
            }}
            style={{marginTop: 40, backgroundColor: Colors.light.darkGreen, height: 55, width: 324, paddingHorizontal: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'white', fontWeight: '600'}}>Sign Out</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 40,
    }
})