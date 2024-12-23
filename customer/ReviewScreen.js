import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const ReviewScreen = ({ route, navigation }) => {
  const { orderId, user } = route.params;
  const [rating, setRating] = useState(0);
  const [ulasan, setUlasan] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Rating harus diisi');
      return;
    }

    try {
      await axios.post('http://localhost:5000/reviews', {
        order_id: orderId,
        rating,
        ulasan,
      });
      Alert.alert('Sukses', 'Review berhasil disimpan');
      navigation.goBack(); // Kembali ke halaman sebelumnya setelah menyimpan review
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan review');
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <FontAwesome
            name="star"
            size={40}
            color={i <= rating ? 'gold' : 'gray'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Berikan Review</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Rating:</Text>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
        <Text style={styles.label}>Ulasan:</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={ulasan}
          onChangeText={setUlasan}
          placeholder="Tulis ulasan Anda"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Kirim Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E201E',
    marginLeft: 10,
    marginRight: 'auto',
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#1E201E',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#213555',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewScreen;
