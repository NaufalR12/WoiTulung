import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Feather, FontAwesome } from '@expo/vector-icons';

const ServiceDetail = ({ route, navigation }) => {
  const { serviceId, user } = route.params;
  const [service, setService] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/services/${serviceId}`)
      .then(response => setService(response.data))
      .catch(error => console.error(error));
  }, [serviceId]);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleOrder = async () => {
    try {
      const response = await axios.post('http://localhost:5000/check_user_complete', {
        user_id: user.user_id
      });
      console.log(response.data); // Debugging log
      const { complete } = response.data;

      if (complete) {
        navigation.navigate('PesanScreen', { service, user });
      } else {
        // Menampilkan alert jika data tidak lengkap
        alert('Harap lengkapi data diri Anda terlebih dahulu.');
        navigation.navigate('ProfilCus', { user });
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi Kesalahan: Tidak dapat memeriksa kelengkapan data pengguna.');
    }
  };

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{service.nama_layanan}</Text>
        <TouchableOpacity>
          <Feather name="share-2" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image style={styles.image} source={{ uri: `data:image/png;base64,${service.gambar}` }} />
        <View style={styles.priceRatingContainer}>
          <Text style={styles.price}>Rp {service.harga}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={20} color="gold" />
            <Text style={styles.rating}>{service.rating}</Text>
          </View>
        </View>
        <Text style={styles.location}>Lokasi: {service.lokasi}</Text>
        <Text style={styles.description}>{service.deskripsi}</Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <FontAwesome name="heart" size={24} color={liked ? "red" : "gray"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={handleOrder}
        >
          <Text style={styles.orderButtonText}>Pesan Sekarang</Text>
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
  scrollViewContent: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    marginTop:20,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: '#697565',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 18,
    color: '#3C3D37',
    marginLeft: 4,
  },
  location: {
    fontSize: 16,
    color: '#3C3D37',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#3C3D37',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  likeButton: {
    padding: 12,
  },
  orderButton: {
    backgroundColor: '#213555',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceDetail;
