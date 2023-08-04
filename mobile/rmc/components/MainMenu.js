import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, ImageBackground, ActivityIndicator } from 'react-native';
import InternalService from '../services/internal-api';
import { useNavigation } from '@react-navigation/native';

export default function MainMenu() {
    const apiData = new InternalService();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();
    const handleNavigate = () => {
      navigation.navigate('RusMenu');
    };
  
    useEffect(() => {
        apiData.getPersonalia()
          .then((body) => {
            setData(body.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
          });
      }, []);
    
    return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/imagery/beast.png')}
          style={styles.imageBackground}
          resizeMode="cover"
        >
        </ImageBackground>
        <Text style={styles.captionMain}>Средневековая </Text>
        <Text style={[styles.captionMain, { top: '57.5%' }]}>нумизматика</Text>
      </View>

      <TouchableOpacity onPress={handleNavigate} style={styles.image}>
        <ImageBackground
          source={require('../assets/imagery/rus.jpg')}
          style={styles.sectionBackground}
          resizeMode="cover"
        >
        </ImageBackground>
        <Text style={[styles.captionMain, { fontSize: 30, paddingRight: 10 }]}>Русь </Text>
      </TouchableOpacity>

      <View style={[styles.image, { backgroundColor: '#046A38', alignItems: 'flex-start' }]}>
        <ImageBackground
          source={require('../assets/imagery/litva.jpg')}
          style={styles.sectionBackground}
          resizeMode="cover"
        >
        </ImageBackground>
        <Text style={[styles.captionMain, { fontSize: 30, paddingLeft: 10 }]}>Литва </Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    backgroundColor: '#6b2224',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captionMain: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }], // Half of the text's font size
    fontFamily: 'Roboto',
    color: 'white',
    fontSize: 40,
    lineHeight: 40,
    fontVariant: 'small-caps',
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Shadow color
    textShadowOffset: { width: 4, height: 4 }, // Shadow offset
    textShadowRadius: 5, // Shadow radius
  },

  imageBackground: {
    width: '90%',
    height: '100%',
    opacity: 0.4
  },

  sectionBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.8
  },

  image: {
    flex: 0.3,
    backgroundColor: '#6b2224',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.4)',
    borderStyle: 'dotted',
  },

  wrapper: {
    flex: 1,
    marginTop:StatusBar.currentHeight,
  }
});