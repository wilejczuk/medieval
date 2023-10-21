import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, TextInput, Text, Image, Button, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import InternalService from '../../services/internal-api';
import MessageModal from './MessageModal';

const FeedbackForm = ({ closeModal }) => {
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const [message, setMessage] = useState(''); 

  const [emailError, setEmailError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [imageError, setImageError] = useState('');
  const [isValidForm, setIsValidForm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const apiData = new InternalService();

  const isValidEmail = email => {
    const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return pattern.test(email);
  };

  const showMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage('');
      setIsLoading(false);
      closeModal({number:1});
    }, 2000); 
  };
  
  const isValid = () => {
    let valid = true;
  
    if (!email.trim()) {
      setEmailError('Введите email');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Введите корректный email');
      valid = false;
    } else {
      setEmailError('');
    }
  
    if (!comment.trim()) {
      setCommentError('Введите комментарий');
      valid = false;
    } else {
      setCommentError('');
    }
  
    if (!image) {
      setImageError('Добавьте изображение');
      valid = false;
    } else {
      setImageError('');
    }
  
    return valid;
  };

  const handleChooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); 
    }
  };

  const handleSubmit = () => {
    if (isValid()) {
      setIsLoading(true);
      setTimeout(() => {
        apiData.sendEmail (email, image, comment)
          .then(response => {
            showMessage('Спасибо за Ваше обращение!\nМы Вам обязательно ответим');
          })
          .catch(error => console.log(error));
      }, 400);
    }  
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      {isLoading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
      <ScrollView>
        <View style={styles.formGroup}>
          <View style={styles.buttonContainer}>
            <Button title="Добавить фото" onPress={handleChooseImage} color='#6b2224' />
          </View>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          {imageError ? <Text style={styles.errorText}>{imageError}</Text> : null}
        </View>

        <View style={styles.formGroup}>
          <TextInput
            placeholder="Ваш Email"
            value={email}
            onChangeText={text => {
              setEmail(text);
              setEmailError('');
            }}
            style={styles.input}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <View style={styles.formGroup}>
          <TextInput
            placeholder="Комментарий"
            value={comment}
            onChangeText={text => {
              setComment(text);
              setCommentError('');
            }}
            maxLength={1000}
            multiline
            style={styles.input}
          />
          {commentError ? <Text style={styles.errorText}>{commentError}</Text> : null}
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Отправить" onPress={handleSubmit} color='#6b2224' />
        </View>
      </ScrollView>
      )}  
      <MessageModal visible={message !== ''} message={message} /> 

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 4,
  },

  errorText: {
    color: 'brown'
  },

  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden', // This is important for clipping the shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
});

export default FeedbackForm;
