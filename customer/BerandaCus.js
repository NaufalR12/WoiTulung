import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, TextInput, Dimensions, Animated } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // Menggunakan Ionicons untuk ikon
import nearMe from './assets/1.png'; // Impor gambar
import palingAndalan from './assets/2.png'; // Impor gambar
import surgaPromo from './assets/3.png'; // Impor gambar
import defaultProfile from './assets/default-profile.png'; // Impor gambar profil default

const { width } = Dimensions.get('window');

const BerandaCus = ({ route, navigation }) => {
  const { user } = route.params;
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useState(new Animated.Value(width))[0]; // Initial position for the sidebar

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      fetchServices();
    } else {
      handleSearch();
    }
  }, [searchQuery]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/services');
      setServices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/services/search?query=${searchQuery}`);
      setServices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarVisible ? width : width * 0.25,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.service_id, user })} style={styles.card}>
      <Image source={{ uri: `data:image/png;base64,${item.gambar}` }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.nama_layanan}</Text>
        <Text style={styles.price}>Rp {item.harga}</Text>
        <Text style={styles.description}>{item.deskripsi}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={user.gambar ? { uri: `data:image/png;base64,${user.gambar}` } : defaultProfile} 
          style={styles.profileImage} 
        />
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hallo!</Text>
          <Text style={styles.username}>{user.username}</Text>
        </View>
        <TouchableOpacity onPress={toggleSidebar}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari layanan..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.miniCardContainer}>
        <TouchableOpacity style={styles.miniCard}>
          <Image source={nearMe} style={styles.miniCardImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.miniCard}>
          <Image source={palingAndalan} style={styles.miniCardImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.miniCard}>
          <Image source={surgaPromo} style={styles.miniCardImage} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        keyExtractor={(item) => item.service_id.toString()}
        renderItem={renderServiceItem}
        contentContainerStyle={styles.listContent}
      />
      
      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
        <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Riwayat', { user }); }} style={styles.sidebarItem}>
          <Ionicons name="time" size={24} color="black" />
          <Text style={styles.sidebarItemText}>Riwayat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('ProfilCus', { user }) }} style={styles.sidebarItem}>
          <Ionicons name="person" size={24} color="black" />
          <Text style={styles.sidebarItemText}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Login'); }} style={styles.sidebarItem}>
          <Ionicons name="log-out" size={24} color="black" />
          <Text style={styles.sidebarItemText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10, // Add a small space between the profile image and text
  },
  greetingContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start', // Align text to the left
    flex: 1, // Adjust to take remaining space
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: '#213555',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  filterButton: {
    marginLeft: 10,
    padding: 10,
  },
  miniCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  miniCard: {
    backgroundColor: '#fff', // Set background color to white
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#213555', // Set shadow color to blue
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  miniCardImage: {
    width: '100%',
    height: 80,
    resizeMode: 'cover', // Crop the image
  },
  listContent: {
    paddingBottom: 80, // Adjust padding to make space for the footer
  },
  card: {
    backgroundColor: '#5d6f84',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  price: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 8,
  },
  description: {
    fontSize: 14,
    color: '#fff',
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  sidebarItemText: {
    marginLeft: 10,
    fontSize: 18,
    color: 'black',
  },
});

export default BerandaCus;
