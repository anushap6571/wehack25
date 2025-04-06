import { StyleSheet, Image, Button, Pressable} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View} from '@/components/Themed';
import Colors from '@/constants/Colors';

import { useRouter } from 'expo-router'; 

export default function TabOneScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/Frame.png')} style={{top: 20, width: 125, height: 125, marginTop: 60}}/>
      <Text style={{color: Colors.light.darkGreen, fontSize: 48, fontWeight: '500',  marginTop: 46}}>finterest</Text>
      <Text style={{fontSize: 24, color: Colors.light.lightGreen, height: 60, width: 260, textAlign: 'center', marginTop: 26}}>noun: a way to invest in your interests</Text>
      <View style={{width: 264, marginTop: 26, height: 5, borderRadius: 100, backgroundColor: Colors.light.lightGray}}/>
      <Pressable onPress={() => router.push('/signup')}
      style={{backgroundColor: Colors.light.lightGreen, width: 204, height: 46, borderRadius: 100, marginTop: 60, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'white', fontWeight: '600', fontSize: 20}}>lets begin</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.lightGreen,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
