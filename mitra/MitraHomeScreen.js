import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Card, Title, Paragraph, Button, BottomNavigation } from 'react-native-paper';
import IncomingOrdersScreen from './IncomingOrdersScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import PartnerProfileScreen from './PartnerProfileScreen';

// Route untuk Dashboard
const DashboardRoute = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Dashboard</Text>
    <View style={styles.summaryContainer}>
      <Card style={[styles.card, styles.ordersCard]}>
        <Card.Content> 
          <Title style={styles.whiteText}>Total Orders</Title>
          <Paragraph style={styles.whiteText}>120</Paragraph>
        </Card.Content>
      </Card>
      <Card style={[styles.card, styles.revenueCard]}>
        <Card.Content>
          <Title style={styles.whiteText}>Total Revenue</Title>
          <Paragraph style={styles.whiteText}>Rp 15,000,000</Paragraph>
        </Card.Content>
      </Card>
      <Card style={[styles.card, styles.reviewsCard]}>
        <Card.Content>
          <Title style={styles.whiteText}>Total Reviews</Title>
          <Paragraph style={styles.whiteText}>45</Paragraph>
        </Card.Content>
      </Card>
    </View>
    <Text style={styles.title}>Manage Services</Text>
    <FlatList
      data={services}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={styles.serviceItem}>
          <Card.Content>
            <Title>{item.name}</Title>
            <Paragraph>{item.description}</Paragraph>
            <Paragraph>{item.price}</Paragraph>
            <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => handleEditService(item.id)} mode="contained" style={styles.editButton}>Edit</Button>
            <Button onPress={() => handleDeleteService(item.id)} mode="contained" style={styles.deleteButton}>Delete</Button>
          </Card.Actions>
        </Card>
      )}
    />
    <Button mode="contained" onPress={handleAddService} style={styles.addButton}>Add Service</Button>
  </View>
);

const services = [
  { id: '1', name: 'Service 1', description: 'Description of Service 1', price: 'Rp 100,000', imageUrl: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Service 2', description: 'Description of Service 2', price: 'Rp 200,000', imageUrl: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Service 3', description: 'Description of Service 3', price: 'Rp 300,000', imageUrl: 'https://via.placeholder.com/150' },
];

const handleAddService = () => {
  // Logika untuk menambahkan layanan
  console.log('Add Service');
};

const handleEditService = (serviceId) => {
  // Logika untuk mengedit layanan
  console.log('Edit Service:', serviceId);
};

const handleDeleteService = (serviceId) => {
  // Logika untuk menghapus layanan
  console.log('Delete Service:', serviceId);
};

const MitraHomeScreen = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'dashboard', title: 'Dashboard', icon: 'home' },
    { key: 'incomingOrders', title: 'Incoming', icon: 'inbox' },
    { key: 'orderHistory', title: 'History', icon: 'history' },
    { key: 'partnerProfile', title: 'Profile', icon: 'account' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'dashboard':
        return <DashboardRoute key="dashboard" />;
      case 'incomingOrders':
        return <IncomingOrdersScreen key="incomingOrders" />;
      case 'orderHistory':
        return <OrderHistoryScreen key="orderHistory" />;
      case 'partnerProfile':
        return <PartnerProfileScreen key="partnerProfile" />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={(newIndex) => {
        console.log('Index Changed:', newIndex);
        setIndex(newIndex);
      }}
      renderScene={renderScene}
      barStyle={{ backgroundColor: '#213555' }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#213555',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    margin: 5,
  },
  ordersCard: {
    backgroundColor: '#3E5879',
  },
  revenueCard: {
    backgroundColor: '#3E5879',
  },
  reviewsCard: {
    backgroundColor: '#3E5879',
  },
  serviceItem: {
    marginBottom: 10,
    backgroundColor: '#F5EFE7',
  },
  serviceImage: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#213555',
  },
  editButton: {
    margin: 10,
    backgroundColor: '#3E5879',
  },
  deleteButton: {
    margin: 10,
    backgroundColor: '#D9534F',
  },
  whiteText: { 
    color: '#FFFFFF',
    fontSize: 15,
  }, 
});



export default MitraHomeScreen;
