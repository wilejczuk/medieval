import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, SafeAreaView, ScrollView, StatusBar, ImageBackground, ActivityIndicator } from 'react-native';
import InternalService from '../services/internal-api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function CategoryMenu({ route }) {
    const apiData = new InternalService();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { parameter } = route.params;
    const navigation = useNavigation();

    const handleBackPress = () => {
      navigation.goBack();
    };

    useEffect(() => {
        apiData.getCoinIssuers([parameter.id])
          .then((body) => {
            setData(body.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
          });
    }, []);


    const renderListItem = ({ item }) => {
      
      const itemName = item.name.includes("невозможна") ? "Без атрибуции" : item.name;
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleItemPress(item)}
        >
          <View style={styles.captionContainer}>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemName}>
              {itemName}
            </Text>
            <View style={styles.horizontalLine} />
          </View>

        </TouchableOpacity>
      );
    };

    const handleItemPress = (item) => {
      navigation.navigate('IssuersCoins', { parameter: item, line: 'Issuers' });
    };

    return (
      <LinearGradient
        colors={['#A43C3C', 'rgba(0, 0, 0, 0.8)']}
        style={styles.wrapper}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFAEE" />
          </TouchableOpacity>
          
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerText}>{parameter.name_ru}</Text>

          <View>

          </View>
        </View>
        <View style={styles.container}>
          {isLoading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <FlatList
              data={data}
              numColumns={1}
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
    backgroundColor: '#FFFAEE',
    margin: 10,
    borderRadius: 10, 
  },

  header: {
    height: 50,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },

  headerText: {
    color: '#FFFAEE',
    fontSize: 20,
    fontWeight: 'bold',
    fontVariant: 'small-caps',
    justifyContent: 'center' 
  },

  headerButton: {
    marginLeft: 10,
    marginRight: 5
  },

  itemName: {
    fontSize: 15,
    color: '#6b2224',
    marginTop: 15,
    marginLeft: 15,

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

  horizontalLine: {
    borderBottomColor: '#6b2224',
    borderBottomWidth: 1,
    margin: 15,
    marginRight: 50,
    opacity: 0.4
  },

  wrapper: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#6b2224',
  },
});
