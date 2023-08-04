import React from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MessageModal = ({ visible, message, wishList }) => {
  const navigation = useNavigation();
  
  const handleLinkPress = () => {
    navigation.navigate('IssuersCoins', { parameter: {
      id: wishList.join(), 
      name: 'Ваш список желаний'
    }, line: 'Wished' });
  };
  
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={() => {}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.messageText}>
            {message.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line === 'Cписок ваших желаний' ? (
                  <TouchableOpacity onPress={handleLinkPress}>
                    <Text style={styles.linkText}>Cписок ваших желаний</Text>
                  </TouchableOpacity>
                ) : (
                  <React.Fragment>
                    {line}
                    {'\n'}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '75%'
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default MessageModal;