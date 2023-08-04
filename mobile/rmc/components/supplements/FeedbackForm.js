import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Image, Button, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const FeedbackForm = () => {
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const handleChooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Using the new approach to access selected assets
    }
  };

  const handleSubmit = () => {
    // You can implement your logic to send the form data to the server here.
    // For demonstration purposes, we'll just log the form data.
    console.log('Image:', image);
    console.log('Email:', email);
    console.log('Comment:', comment);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView>
        <View style={styles.formGroup}>
          <View style={styles.buttonContainer}>
            <Button title="Добавить фото" onPress={handleChooseImage} color='#6b2224' />
          </View>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>

        <View style={styles.formGroup}>
          <TextInput
            placeholder="Ваш Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <TextInput
            placeholder="Комментарий"
            value={comment}
            onChangeText={setComment}
            maxLength={1000}
            multiline
            style={styles.input}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Отправить" onPress={handleSubmit} color='#6b2224' />
        </View>
      </ScrollView>
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
