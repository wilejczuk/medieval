import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, StatusBar, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MessageModal from './supplements/MessageModal';

export default function CoinType({ route }) {

    const { parameter } = route.params;
    const navigation = useNavigation();
    const [wishList, setWishList] = useState([]);
    const [message, setMessage] = useState(''); 

    const handleBackPress = () => {
      navigation.goBack();
    };

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    useEffect(() => {
      loadWishlist();
    }, []);

    const loadWishlist = async () => {
      try {
        const savedWishlist = await AsyncStorage.getItem('wishList');
        if (savedWishlist !== null) {
          setWishList(JSON.parse(savedWishlist));
          console.log(savedWishlist);
        }
      } catch (error) {
        console.log('Error loading wishlist:', error);
      }
    };

    const handleShowWishList = () => {
      navigation.navigate('IssuersCoins', { parameter: {
        id: wishList.join(), 
        name: 'Ваш список желаний'
      }, line: 'Wished' });
    };

    const wishListStatus = wishList.includes(parameter.jointIndex.toString()) ? 
        ( 
          <View style={styles.wishListSelected}>
            <TouchableOpacity onPress={handleShowWishList} style={styles.inWishList}>
              <Text style={styles.inWishList}><Ionicons name="checkmark" size={14} color="#3CA4A4" />В списке желаний</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.wishList}>
            <TouchableOpacity onPress={()=>handleAddWishAndSave(parameter.jointIndex.toString())}>
            <Text style={styles.rarityDetail}>Хочу такую!</Text>
            </TouchableOpacity>
          </View>
        );

    const saveWishlist = async (wishlist) => {
      try {
        const jsonWishlist = JSON.stringify(wishlist);
        await AsyncStorage.setItem('wishList', jsonWishlist);
        //await AsyncStorage.removeItem('wishList');  //--- to cleanup quickly
        console.log('Wishlist saved successfully!');
      } catch (error) {
        console.log('Error saving wishlist:', error);
      }
    };
  
    const handleAddWishAndSave = (newWish) => {
      if ((newWish.trim() !== '') && (!wishList.includes(newWish))) {
        const updatedWishlist = [...wishList, newWish];
        setWishList(updatedWishlist);
        saveWishlist(updatedWishlist); // Save the updated wishlist to AsyncStorage
        showMessage(`Добавлено в\nCписок ваших желаний`); // Show the message when wishlist is saved
      }
    };

    const showMessage = (message) => {
      setMessage(message);
      setTimeout(() => setMessage(''), 3000); 
    };

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('wishList');
        console.log(value);
      } catch (error) {
        console.log(error);
      }
    };

    const handleItemPress = (itemId) => {
      // Logic to navigate to the appropriate screen based on the itemId
      console.log('Item clicked:', itemId);
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

          <View style={styles.headerCenter}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerTextSmall}>{parameter.name}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerText}>{parameter.obvText} / {parameter.revText}</Text>
          </View>
          <View>

          </View>
        </View>

          <View style={styles.container}>

            <ImageBackground
              source={require('../assets/imagery/beast.png')}
              style={styles.imageBackground}
              resizeMode="cover"
            >
            </ImageBackground>

            <View style={styles.groupContainer}>
            <TouchableOpacity onPress={getData}>

              <Text style={styles.coinNumber}>
                {parameter.number}
              </Text>
              </TouchableOpacity>
              <Text style={styles.itemDenomination}>
                {parameter.name_ru}
              </Text>
            </View>
            <View style={styles.imageBox}>
              <Image style={styles.itemImage} resizeMode="contain"
                source={{ uri: `https://server.kievan-rus.online/coin_specimens/${parameter.jointIndex}.jpg`}}/>
            </View>
            <View> 
                <Text style={styles.itemName}>
                    Аверс: {parameter.obvText} 
                </Text>
                <Text style={styles.itemDetail}>
                    {parameter.obvDetail} 
                </Text>
                <Text style={styles.itemName}>
                    Реверс: {parameter.revText}
                </Text>
                <Text style={styles.itemDetail}>
                    {parameter.revDetail} 
                </Text>
            </View>

            <View style={styles.rarityBox}>
                <Text style={styles.rarityDetail}>
                  Редкость: {parameter.rarityMark}{'   '}
                  <TouchableOpacity onPress={toggleModal}>
                    <Ionicons name="information-circle-outline" size={16} color="#FFFAEE" />
                  </TouchableOpacity>
                </Text>
            </View>

            <MessageModal visible={message !== ''} message={message} wishList={wishList} /> 

            <View style={styles.wishList}>
                {wishListStatus}
            </View>

          </View>
          
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleModal}
          >
            <View style={styles.modalContainer}>

              <View style={styles.popup}>
                <TouchableOpacity onPress={toggleModal} style={styles.rarityHeaderCloser}>
                  <Ionicons name="close-circle" size={24} color="black" />
                </TouchableOpacity>

                <View style={styles.rarityGrades}>
                  <Text style={styles.rarityHeader}>Оценки редкости</Text>
                </View>

                <Text style={styles.justText}>   Монетам, представленным в каталоге, исходя из данных о количестве известных экземпляров в публикациях, музейных собраниях и частных коллекциях, присвоены степени редкости. Они призваны дать приблизительное представление о редкости, являясь при этом ориентировочными и отражая в том числе субъективное мнение авторов. Варианты монет массовых типов могут иметь более высокую категорию редкости при наличии у них заметных штемпельных отличий, позволяющих легко визуально отделить их от остального массива монет типа.</Text>

                <Text style={styles.rarText}>   <Text style={styles.rarBold}>I</Text> – уникальные монеты, либо монеты, известные в единичных экземплярах; </Text>
                <Text style={styles.rarText}>   <Text style={styles.rarBold}>II</Text> – крайне редкие монеты; </Text>
                <Text style={styles.rarText}>   <Text style={styles.rarBold}>III</Text> – очень редкие монеты, известные и опубликованные в незначительном количестве; </Text>
                <Text style={styles.rarText}>   <Text style={styles.rarBold}>IV</Text> – редкие монеты; </Text>
                <Text style={styles.rarText}>   <Text style={styles.rarBold}>V</Text> – относительно редкие монеты; </Text>
                <Text style={styles.rarText}>   <Text style={styles.rarBold}>VI-VII</Text> – не совсем обычные монеты; </Text>
                <Text style={styles.rarText}>   <Text style={styles.rarBold}>VIII</Text> – относительно распространённые монеты; </Text>
                <Text style={styles.rarText}>   <Text style={styles.rarBold}>IX и выше</Text> – массовые монеты, хорошо изученные и неоднократно опубликованные.</Text>

              </View>
            </View>
          </Modal>


      </LinearGradient>
    );
}

const styles = StyleSheet.create({
  // Global screen
  wrapper: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#6b2224',
  },
  
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: '#FFFAEE',
    borderRadius: 10, 
  },

  groupContainer: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },

  imageBackground: {
    position: 'absolute',
    bottom: -50,
    right: -100,
    width: 300, 
    height: 300, 
    opacity: 0.5
  },

  // Header
  header: {
    height: 50,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },

  headerCenter: {
    width: 300,
    alignItems: 'center',
    justifyContent: 'center' 
  },

  headerText: {
    color: '#FFFAEE',
    fontSize: 20,
    fontWeight: 'bold',
    fontVariant: 'small-caps',
    justifyContent: 'center' 
  },

  headerTextSmall: {
    color: '#FFFAEE',
    fontSize: 10,
    fontWeight: 'bold',
    fontVariant: 'small-caps',
    justifyContent: 'center' 
  },

  headerButton: {
    marginLeft: 10,
    marginRight: 5
  },

  //Particular coins

  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 2,
    flexDirection: 'row', 
  },

      imageBox: { 
        alignItems: 'center',
        height: 200,
        borderRadius: 10
      },

      rarityBox: {
        position: 'absolute',
        bottom: 0,
        width: 180,
        height: 50,
        left: 0,
        backgroundColor: '#A43C3C',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
      },

      wishList: {
        position: 'absolute',
        bottom: 0,
        width: 180,
        height: 50,
        right: 0,
        backgroundColor: '#3CA4A4',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
      },

      wishListSelected: {
        position: 'absolute',
        bottom: 0,
        width: 180,
        height: 50,
        right: 0,
        backgroundColor: '#FFFAEE',
        borderColor: '#3CA4A4',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
      },

      inWishList: {
        backgroundColor: '#FFFAEE',
        fontSize: 12,
        color: '#3CA4A4'
      },

      rarityDetail: {
        fontSize: 12,
        color: 'white',
      },
  
      itemImage: {
        height: '100%',
        width: '90%',
        marginBottom: 10,
      },

      imagePlaceholder: {
        fontSize: 12,
        color: 'grey',
        textTransform: 'lowercase',
      },

      descriptionContainer: {
        flex: 1,
        alignItems: 'flex-start',
      },

          coinNumber: {
            fontSize: 16,
            color: 'white',
            backgroundColor: 'grey',
            marginTop: 5,
            marginLeft: 15,
            padding: 8,
            borderRadius: 5
          },

          itemName: {
            fontSize: 16,
            marginTop: 5,
            marginLeft: 15,
          },

          itemDetail: {
            fontSize: 12,
            marginTop: 5,
            marginLeft: 15,
          },

          itemDenomination: {
            fontSize: 16,
            color: 'grey',
            textTransform: 'lowercase',
            marginTop: 5,
            marginLeft: 15,
          },

  //Modal window

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  popup: {
    width: '90%',
    height: '90%',
    backgroundColor: '#FFFAEE',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },

  rarityGrades: {
    backgroundColor: '#A43C3C',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    borderRadius: 10,
    padding: 10,
  },

  rarityHeader: {
    fontSize: 20,
    color: '#FFFAEE',
    fontWeight: 'bold',
    fontVariant: 'small-caps'
  },

  rarityHeaderCloser: {
    position: 'absolute',
    top: 0,
    right: 0
  },

  rarityMainText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'space-evenly'
  },

  justText: {
    textAlign: 'justify',
  },

  rarText: {
    marginBottom: 4
  },

  rarBold: {
    fontWeight: 'bold',
  },

});
