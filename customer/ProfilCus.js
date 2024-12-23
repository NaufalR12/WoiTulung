import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import defaultProfile from './assets/default-profile.png'; // Impor gambar profil default

const ProfilCus = ({ route, navigation }) => {
  const { user } = route.params;
  const [nama, setNama] = useState(user.nama || '');
  const [noHp, setNoHp] = useState(user.no_hp || '');
  const [email, setEmail] = useState(user.email || '');
  const [alamat, setAlamat] = useState(user.alamat || '');
  const [profileImage, setProfileImage] = useState(user.gambar ? `data:image/png;base64,${user.gambar}` : null);

  const handleSave = () => {
    if (!nama || !noHp || !email || !alamat) {
      alert('Semua data harus diisi!');
      return;
    }

    axios.put(`http://localhost:5000/users/${user.user_id}`, {
      nama,
      no_hp: noHp,
      email,
      alamat,
      gambar: profileImage ? profileImage.split(',')[1] : null,
    })
      .then(response => {
        alert('Data berhasil disimpan!');
        navigation.goBack();
      })
      .catch(error => {
        alert('Terjadi kesalahan saat menyimpan data.');
      });
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const base64Image = await getBase64(result.uri);
      setProfileImage(base64Image);

      // Unggah gambar ke server
      axios.post('http://localhost:5000/upload_profile_image', {
        user_id: user.user_id,
        image: base64Image.split(',')[1],
      })
        .then(response => {
          // Setelah berhasil mengunggah gambar, dapatkan data pengguna terbaru dari server
          axios.get(`http://localhost:5000/users/${user.user_id}`)
            .then(response => {
              const updatedUser = response.data;
              setProfileImage(`data:image/png;base64,${updatedUser.gambar}`);
              alert('Gambar profil berhasil diperbarui!');
            })
            .catch(error => {
              alert('Terjadi kesalahan saat mendapatkan data pengguna terbaru.');
            });
        })
        .catch(error => {
          alert('Terjadi kesalahan saat mengunggah gambar.');
        });
    }
  };

  const getBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Anda</Text>
        <TouchableOpacity>
          <Feather name="share-2" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.profilePictureContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profilePicture} />
        ) : (
          <Image source={defaultProfile} style={styles.profilePicture} />
        )}
        <TouchableOpacity onPress={handlePickImage}>
          <Text style={styles.changePictureText}>Ganti Gambar</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nama"
        value={nama}
        onChangeText={setNama}
      />
      <TextInput
        style={styles.input}
        placeholder="No HP"
        value={noHp}
        onChangeText={setNoHp}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Alamat"
        value={alamat}
        onChangeText={setAlamat}
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Simpan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#213555',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePictureText: {
    color: '#213555',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#213555',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilCus;
