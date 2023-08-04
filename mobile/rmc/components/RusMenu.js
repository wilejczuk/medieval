import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, SafeAreaView, ScrollView, StatusBar, ImageBackground, ActivityIndicator } from 'react-native';
import InternalService from '../services/internal-api';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function RusMenu() {
    const apiData = new InternalService();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        apiData.getCoinSections()
          .then((body) => {
            setData(body.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
          });
    }, []);

    const imageMappings = {
      6: require('../assets/imagery/sections/6.png'),
      10: require('../assets/imagery/sections/10.png'),
      3: require('../assets/imagery/sections/3.png'),
      11: require('../assets/imagery/sections/11.png'),
      12: require('../assets/imagery/sections/12.png'),
      13: require('../assets/imagery/sections/13.png')  
    };

    const test = [
      {
        id: 6,
        name_ru: "Киевская русь"
      },
      {
        id: 10,
        name_ru: "Безмонетный период"
      },
      {
        id: 3,
        name_ru: "Великое княжество Московское"
      },
      {
        id: 11,
        name_ru: "Московские удельные княжения"
      },
      {
        id: 12,
        name_ru: "Нижегородское княжество"
      },
      {
        id: 13,
        name_ru: "Малые княжения Северо-Восточной Руси"
      }
    ];

    const renderListItem = ({ item, index }) => {
      const imageSource = imageMappings[item.id];

      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleItemPress(item)}
        >
          <View style={styles.photoContainer}>
            <Image source={imageSource} style={styles.itemImage} resizeMode="center" />
          </View>

          <View style={styles.captionContainer}>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemName}>
              {item.name_ru}
            </Text>
          </View>

        </TouchableOpacity>
      );
    };

    const handleItemPress = (item) => {
      navigation.navigate('CategoryMenu', { parameter: item });
    };

    const numColumns = 3;
    const itemsPerRow = numColumns;
    const numberOfRows = Math.ceil(test.length / itemsPerRow);
    const itemsToAdd = itemsPerRow - (test.length % itemsPerRow);

    for (let i = 0; i < itemsToAdd; i++) {
      test.push({ id: -1 - i, name_ru: '' }); // Add invisible items to complete the last row
    }

    return (
      <LinearGradient
        colors={['#A43C3C', 'rgba(0, 0, 0, 0.8)']}
        style={styles.wrapper}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>РУСЬ</Text>
        </View>
        <View contentContainerStyle={styles.container}>
          {isLoading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <FlatList
              data={test}
              numColumns={numColumns}
              renderItem={renderListItem}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>
        <ImageBackground
          source={require('../assets/imagery/beast.png')}
          style={styles.imageBackground}
          resizeMode="cover"
        >
        </ImageBackground>
      </LinearGradient>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6b2224',
  },

  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFAEE',
    fontSize: 20,
    fontWeight: 'bold',
  },

  captionContainer: {
  },

  itemName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFAEE',
    fontVariant: 'small-caps',
    marginTop: 5,
  },

  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 2,
    justifyContent: 'flex-start'
  },

  itemImage: {
    width: '100%',
    height: 120
  },

  photoContainer: {
    width: '100%',
  },

  imageBackground: {
    position: 'absolute',
    bottom: -50,
    right: -100,
    width: 300, 
    height: 300, 
    opacity: 0.5
  },

  wrapper: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#6b2224',
  },
});
