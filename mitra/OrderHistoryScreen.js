import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Rating } from 'react-native-ratings';

const orderHistory = [
  {
    id: '1',
    customerName: 'John Doe',
    serviceType: 'Cleaning',
    schedule: '2024-12-21 10:00 AM',
    address: '123 Main St, Yogyakarta',
    payment: 'Rp 150,000',
    status: 'Completed',
    review: 'Great service!',
    rating: 5,
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    serviceType: 'Gardening',
    schedule: '2024-12-22 2:00 PM',
    address: '456 Oak St, Yogyakarta',
    payment: 'Rp 200,000',
    status: 'Cancelled',
    review: '',
    rating: 0,
  },
  // Tambahkan riwayat pesanan lainnya di sini
];

const OrderHistoryScreen = () => {
  useEffect(() => {
    console.log('OrderHistoryScreen mounted');
  }, []);

  const calculatePerformanceStats = () => {
    const completedOrders = orderHistory.filter(order => order.status === 'Completed');
    const totalRevenue = completedOrders.reduce((acc, order) => acc + parseFloat(order.payment.replace('Rp ', '').replace(',', '')), 0);
    const totalRating = completedOrders.reduce((acc, order) => acc + order.rating, 0);
    const averageRating = completedOrders.length ? (totalRating / completedOrders.length) : 0;
    return {
      totalOrders: orderHistory.length,
      completedOrders: completedOrders.length,
      totalRevenue: totalRevenue.toFixed(0),
      averageRating: averageRating.toFixed(1),
    };
  };

  const stats = calculatePerformanceStats();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <View style={styles.statsContainer}>
      <View style={styles.statItem3}>
        <View style={styles.statItem2}>
          <View style={styles.statItem}>
            <Text style={styles.statText}>Completed</Text>
          </View>
          <Text></Text>
          <Text style={styles.statValue}>{stats.completedOrders}</Text>
        </View>
      </View>
      <View style={styles.statItem3}>
        <View style={styles.statItem2}>
          <View style={styles.statItem}>
            <Text style={styles.statText}>Total revenue</Text>
          </View>
          <Text></Text>
          <Text style={styles.statValue}>Rp {stats.totalRevenue}</Text>
        </View>
      </View>
      <View style={styles.statItem3}>
        <View style={styles.statItem2}>
          <View style={styles.statItem}>
            <Text style={styles.statText}>Rating</Text>
          </View>
          <Text></Text>
          <Text style={styles.statValue}>{stats.averageRating}</Text>
        </View>
      </View>
      </View>
      <FlatList
        data={orderHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.orderItem}>
            <Card.Content>
              <Title>{item.serviceType}</Title>
              <Paragraph>Customer: {item.customerName}</Paragraph>
              <Paragraph>Schedule: {item.schedule}</Paragraph>
              <Paragraph>Address: {item.address}</Paragraph>
              <Paragraph>Payment: {item.payment}</Paragraph>
              <Paragraph>Status: {item.status}</Paragraph>
              {item.review ? (
                <>
                  <Paragraph>Review: {item.review}</Paragraph>
                  <Rating
                    type="star"
                    startingValue={item.rating}
                    imageSize={20}
                    readonly
                  />
                </>
              ) : (
                <Paragraph>No review available</Paragraph>
              )}
            </Card.Content>
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
  statsContainer: {
    marginBottom: 20,
  },
  statItem: {
    position: 'absolute', 
    top: -7, 
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#213555',
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 20,
    
    margin: 0,
    width: '40%',
  },
  statItem2: {
    position: 'relative',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3E5879',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  statItem3: {
    marginBottom: 15,
  },
  statText: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  orderItem: {
    marginBottom: 10,
    backgroundColor: '#F5EFE7',
  },
});

export default OrderHistoryScreen;
