import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const partnerData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  phone: '+62 812-3456-7890',
  address: '123 Main St, Yogyakarta',
  profileImage: 'https://via.placeholder.com/150', // Ganti dengan URL gambar profil sebenarnya
};

const PartnerProfileScreen = ({ navigation }) => {
  const handleEditProfile = () => {
    // Logika untuk mengedit profil
    console.log('Edit Profile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partner Profile</Text>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Image source={{ uri: partnerData.profileImage }} style={styles.profileImage} />
          <View>
            <Title>{partnerData.name}</Title>
            <Paragraph>Email: {partnerData.email}</Paragraph>
            <Paragraph>Phone: {partnerData.phone}</Paragraph>
            <Paragraph>Address: {partnerData.address}</Paragraph>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleEditProfile} style={styles.editButton}>
            Edit Profile
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#213555',
  },
  profileCard: {
    backgroundColor: '#F5EFE7',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#3E5879',
  },
});

export default PartnerProfileScreen;
