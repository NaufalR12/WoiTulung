import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const orders = [
  {
    id: '1',
    customerName: 'John Doe',
    serviceType: 'Cleaning',
    schedule: '2024-12-21 10:00 AM',
    address: '123 Main St, Yogyakarta',
    payment: 'Rp 150,000',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    serviceType: 'Gardening',
    schedule: '2024-12-22 2:00 PM',
    address: '456 Oak St, Yogyakarta',
    payment: 'Rp 200,000',
  },
  // Tambahkan pesanan lainnya di sini
];

const IncomingOrdersScreen = () => {
  const handleAcceptOrder = (orderId) => {
    // Logika untuk menerima pesanan
    console.log('Order accepted:', orderId);
  };

  const handleRejectOrder = (orderId) => {
    // Logika untuk menolak pesanan
    console.log('Order rejected:', orderId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incoming Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.orderItem}>
            <Card.Content>
              <Title>{item.serviceType}</Title>
              <Paragraph>Customer: {item.customerName}</Paragraph>
              <Paragraph>Schedule: {item.schedule}</Paragraph>
              <Paragraph>Address: {item.address}</Paragraph>
              <Paragraph>Payment: {item.payment}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() => handleAcceptOrder(item.id)}
                mode="contained"
                style={styles.acceptButton}
              >
                Accept
              </Button>
              <Button
                onPress={() => handleRejectOrder(item.id)}
                mode="contained"
                style={styles.rejectButton}
              >
                Reject
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
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
  orderItem: {
    marginBottom: 10,
    backgroundColor: '#F5EFE7',
  },
  acceptButton: {
    margin: 10,
    backgroundColor: '#3E5879',
  },
  rejectButton: {
    margin: 10,
    backgroundColor: '#D9534F',
  },
});

export default IncomingOrdersScreen;
