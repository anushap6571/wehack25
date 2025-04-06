import { StyleSheet, SafeAreaView, Image, Pressable, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router'; 
import Colors from '@/constants/Colors';
import React, {useState} from 'react';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailInput = (text : string) => {
        setEmail(text);
    }
    
    const handlePasswordInput = (text : string) => {
        setPassword(text);
    }

    const checkID = () => {
      if(email == "Mxiong935@gmail.com" && password == "Bob") {
        return true;
      }
      else {
        return false;
      }
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
            <Text style={{fontSize: 30, color: Colors.light.darkGreen, fontWeight: '700', marginTop: 100}}>welcome back</Text>
            <TextInput
                style={{marginTop: 60, borderWidth: 2, borderColor: Colors.light.lightGray, height: 55, width: 324, paddingHorizontal: 20, borderRadius: 100, fontSize: 14, fontWeight: '700', color: Colors.light.darkGray}}
                placeholder="enter your email"
                value={email}
                onChangeText={handleEmailInput}
            />
            <TextInput
                style={{marginTop: 20, borderWidth: 2, borderColor: Colors.light.lightGray, height: 55, width: 324, paddingHorizontal: 20, borderRadius: 100, fontSize: 14, fontWeight: '700', color: Colors.light.darkGray}}
                placeholder="enter your password"
                value={password}
                onChangeText={handlePasswordInput}
            />

            <Pressable
            onPress={() => {
              if(checkID()) {
                router.replace('/(tabs)/(insideapp)/home');
              } else {
                alert('Incorrect email or password');
              }
            }}
            style={{marginTop: 40, backgroundColor: Colors.light.darkGreen, height: 55, width: 324, paddingHorizontal: 20, borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'white', fontWeight: '600'}}>Login</Text>
            </Pressable>

            <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white', top: 30, justifyContent: 'center'}}>
                <Text style={{fontSize: 14}}>already have an account?</Text>
                <Pressable onPress={() => router.push('/signup')} style={{marginLeft: 5}}>
                    <Text style={{color: Colors.light.neonGreen, fontSize: 14}}>sign up</Text>
                </Pressable>
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
  backContainer: {
    width: '100%',
    paddingTop: 20, // Adjust padding as needed
    paddingLeft: 15, // Ensure the back button isn't too close to the edge
  },
  backButton: {
    flexDirection: 'row', // Align the icon and text horizontally
    alignItems: 'center', // Center both the image and text vertically
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
