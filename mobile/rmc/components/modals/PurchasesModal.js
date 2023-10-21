import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PurchasesModal = ({ isVisible, closeModal }) => {
  const navigation = useNavigation();

  const purchaseOptions = [ 
    { 
      id: 'all24h',
      name: 'Пробная подписка на 24 часа',
      clar: 'на все разделы',
      available: true
    },
    {
      id: 'all3M',
      name: 'Подписка на 3 месяца',
      clar: 'на все разделы',
      available: true
    },
    {
      id: 'all1Y',
      name: 'Подписка на 1 год',
      clar: 'на все разделы',
      available: false
    },
    {
      id: 'allForever',
      name: 'Подписка навсегда',
      clar: 'на все разделы',
      available: true
    },
    {
      id: 'attribute',
      name: 'Определение и оценка',
      clar: 'Вашей монеты',
      available: true
    }
  ];

  const handleItemPress = (item) => {
    console.log(item.id);
  };

  const renderListItem = ({ item }) => {
          return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleItemPress(item)}
      >
        <View style={styles.captionContainer}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemName}>
            {item.name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemClarification}>
            {item.clar}
          </Text>
          <View style={styles.horizontalLine} />
        </View>

      </TouchableOpacity>
    );
  };

  return (
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>

          <View style={styles.popup}>
          <TouchableOpacity onPress={closeModal} style={styles.rarityHeaderCloser}>
                  <Ionicons name="close-circle" size={24} color="black" />
                </TouchableOpacity>

            <View style={styles.rarityGrades}>
              <Text style={styles.rarityHeader}>Покупки</Text>
            </View>

            <FlatList
              data={purchaseOptions.filter(item => item.available)}
              numColumns={1}
              renderItem={renderListItem}
              keyExtractor={(item) => item.id}
            />


          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  //List

  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 2,
    justifyContent: 'flex-start'
  },

  itemName: {
    fontSize: 15,
    color: '#6b2224',
    marginLeft: 15,
  },

  itemClarification: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 15,
  },

  horizontalLine: {
    borderBottomColor: '#6b2224',
    borderBottomWidth: 1,
    margin: 15,
    marginRight: 50,
    opacity: 0.4
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
    marginBottom: 20,
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

export default PurchasesModal;