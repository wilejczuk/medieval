import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity,
  FlatList, Modal, ScrollView, StatusBar, ImageBackground, ActivityIndicator } from 'react-native';
import InternalService from '../services/internal-api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AnimatedIcon from './supplements/AnimatedIcon';
import FeedbackForm from './supplements/FeedbackForm';

export default function IssuersCoins({ route }) {
    const apiData = new InternalService();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { parameter, line } = route.params;
    const navigation = useNavigation();

    const [itemClicked, setItemClicked] = useState(null);

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = (item) => {
      setItemClicked(item.number);
      setModalVisible(!isModalVisible);
    };

    const handleBackPress = () => {
      navigation.goBack();
    };

    const handleItemPress = (item) => {
      navigation.navigate('CoinType', { parameter: item });
    };

    const [invalidImageItems, setInvalidImageItems] = useState([]);

    const processData = (body) => {
      const checkImageExistence = async () => {
        const itemsWithInvalidImages = [];
        for (const item of body.data) {
          try {
            const imageUri = `https://server.kievan-rus.online/coin_specimens/${item.jointIndex}.jpg`;
            await Image.prefetch(imageUri);
          } catch (error) {
            itemsWithInvalidImages.push(item.id);
          }
        }
        setInvalidImageItems(itemsWithInvalidImages);
      };
  
      checkImageExistence();
  
      setData(groupDataByNumber(body.data));
      setIsLoading(false);
    }

    useEffect(() => {
      setIsLoading(true);
        apiData[`get${line}Coins`]([parameter.id])
          .then((body) => {
            processData (body);         
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
          });
    }, [route.params]);

    const groupDataByNumber = (data) => {
      const groupedData = {};
      data.forEach((item) => {
        const groupValue = item.number.split(' ')[0];
        if (!groupedData[groupValue]) {
          groupedData[groupValue] = [];
        }
        groupedData[groupValue].push(item);
      });
      return groupedData;
    };
    
    const GroupedFlatList = ({ groupData }) => {
      return (
        <FlatList
          data={groupData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            renderListItem(item)
          )}
        />
      );
    };

    const forward = line === 'Wished' ? 
    (          
      <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
        <Ionicons name="mail" size={24} color="#FFFAEE" />
      </TouchableOpacity>
    )
    : (<View></View>);

    const renderGroup = (groupValue) => {
      const items = data[groupValue];
      return (
        <View style={styles.groupContainer}>
          <GroupedFlatList groupData={items} />
        </View>
      );
    };

    const renderListItem = ( item ) => {
      const imageUri = `https://server.kievan-rus.online/coin_specimens/${item.jointIndex}.jpg`;
      
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleItemPress(item)}
        >
            <View style={styles.imageBox}>
 
              {invalidImageItems.includes(item.id) ? (
                <TouchableOpacity onPress={() => toggleModal(item)}>
                <AnimatedIcon />
              </TouchableOpacity>
              ) : (
                <Image
                  style={styles.itemImage}
                  resizeMode="contain"
                  source={{ uri: imageUri }}
                />
              )}

            </View> 

            <View style={styles.descriptionContainer}>
              <Text style={styles.coinNumber}>
                {item.number}
              </Text>
              
              <Text  style={styles.itemName}>
                {item.obvText} / {item.revText}
              </Text>

              <Text style={styles.itemDenomination}>
                {item.name_ru}
              </Text>
            </View>
        </TouchableOpacity>
      );
    };

    const itemName = parameter.name.includes("невозможна") ? "Без атрибуции" : parameter.name;

    return (
      <LinearGradient
        colors={['#A43C3C', 'rgba(0, 0, 0, 0.8)']}
        style={styles.wrapper}
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFAEE" />
          </TouchableOpacity>
          
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerText}>{itemName}</Text>

          {forward}

        </SafeAreaView>
        <View style={styles.container}>
          {isLoading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            /* <FlatList
              data={data}
              numColumns={1}
              renderItem={renderListItem}
              keyExtractor={(item) => item.jointIndex.toString()}
            />
            */
          <FlatList
            data={Object.keys(data)}
            keyExtractor={(groupValue) => groupValue.toString()}
            renderItem={({ item }) => renderGroup(item)}
          />
          )}
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
                  <Text style={styles.rarityHeader}>Заполните пустоту</Text>
                </View>

                <Text>   Фото монеты с номером <Text style = {styles.rarBold}>{itemClicked}</Text> нет в каталоге. 
                Вы можете разместить на этом месте свою монету этого типа. Для этого прикрепите ее изображение и отправьте создателям приложения.</Text>
                <FeedbackForm closeModal={toggleModal} />

              </View>
            </View>
          </Modal>
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
  // Global screen
  wrapper: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#6b2224',
  },
  
  container: {
    flex: 1,
    margin: 10,
  },

  groupContainer: {
    flex: 1,
    backgroundColor: '#FFFAEE',
    margin: 10,
    borderRadius: 10, 
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

  //Particular coins

  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 2,
    flexDirection: 'row', 
  },

      imageBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        width: '50%',
        justifyContent: 'center',
        height: 100
      },
  
      itemImage: {
        flex: 1,
        height: 100,
        width: '100%',
        marginBottom: 10,
        position: 'absolute'
      },

      descriptionContainer: {
        flex: 1,
        alignItems: 'flex-start',
      },

          coinNumber: {
            fontSize: 12,
            color: 'white',
            backgroundColor: 'grey',
            marginTop: 5,
            marginLeft: 15,
            padding: 2,
            borderRadius: 5
          },

          itemName: {
            fontSize: 12,
            color: '#6b2224',
            marginTop: 5,
            marginLeft: 15,
          },

          itemDenomination: {
            fontSize: 10,
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
