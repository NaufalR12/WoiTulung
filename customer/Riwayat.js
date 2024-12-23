import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';

const Riwayat = ({ route, navigation }) => {
  const { user } = route.params;
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState({});
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/orders?customer_id=${user.user_id}`);
        const ordersData = response.data;
        setOrders(ordersData);

        const serviceIds = [...new Set(ordersData.map(order => order.service_id))];
        await fetchServices(serviceIds);
        await fetchReviews(ordersData.map(order => order.order_id));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchServices = async (serviceIds) => {
      try {
        const servicesData = await Promise.all(
          serviceIds.map(async (id) => {
            const response = await axios.get(`http://localhost:5000/services/${id}`);
            return { id, name: response.data.nama_layanan };
          })
        );
        const servicesMap = servicesData.reduce((acc, service) => {
          acc[service.id] = service.name;
          return acc;
        }, {});
        setServices(servicesMap);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchReviews = async (orderIds) => {
      try {
        const reviewsData = await Promise.all(
          orderIds.map(async (id) => {
            try {
              const response = await axios.get(`http://localhost:5000/reviews/${id}`);
              return { id, ...response.data };
            } catch (err) {
              console.error(`Error fetching review for order ${id}:`, err);
              return null;
            }
          })
        );
        const reviewsMap = reviewsData.reduce((acc, review) => {
          if (review) acc[review.order_id] = review;
          return acc;
        }, {});
        setReviews(reviewsMap);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchOrders();
  }, [user.user_id]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}/update_status`, { status: newStatus });
      setOrders(prevOrders =>
        prevOrders.map(order => (order.order_id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const renderItem = ({ item }) => {
    const review = reviews[item.order_id] || {};
    const showReviewButton = item.status === 'selesai' && (!review.status || review.status !== 'selesai');

    return (
      <View style={styles.orderContainer}>
        <Text style={styles.serviceName}>
          {services[item.service_id] || 'Nama layanan tidak tersedia'}
        </Text>
        <Text style={styles.totalCost}>Total: Rp {item.total_pembayaran}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>

        {showReviewButton && (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => navigation.navigate('ReviewScreen', { orderId: item.order_id, user })}
          >
            <Text style={styles.buttonText}>Berikan Review</Text>
          </TouchableOpacity>
        )}

        {!['selesai', 'dibatalkan'].includes(item.status) && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.completeButton]}
              onPress={() => updateOrderStatus(item.order_id, 'selesai')}
            >
              <Text style={styles.buttonText}>Selesaikan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => updateOrderStatus(item.order_id, 'dibatalkan')}
            >
              <Text style={styles.buttonText}>Batalkan</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('BerandaCus', { user })}>
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={item => item.order_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E201E',
    marginLeft: 10,
    marginRight: 'auto',
  },
  orderContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E201E',
    marginBottom: 4,
  },
  totalCost: {
    fontSize: 16,
    color: '#1E201E',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#3C3D37',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#213555',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#213555',
  },
  cancelButton: {
    backgroundColor: '#213555',
  },
  reviewButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default Riwayat;
