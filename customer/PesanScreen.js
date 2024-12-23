import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Picker, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const PesanScreen = ({ route, navigation }) => {
  const { service, user } = route.params;
  const [orderType, setOrderType] = useState('homeservice');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [shippingCost, setShippingCost] = useState(100000); // Default ongkir 100 ribu untuk homeservice
  const [totalCost, setTotalCost] = useState(parseFloat(service.harga) + 100000); // Total biaya termasuk ongkir
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (orderType === 'homeservice') {
      setShippingCost(100000); // Ongkir default 100 ribu
    } else {
      setShippingCost(0);
    }
  }, [orderType]);

  useEffect(() => {
    const total = parseFloat(service.harga) + parseFloat(shippingCost);
    setTotalCost(total);
  }, [shippingCost, service.harga]);

  const handleOrder = async () => {
    if (orderType === 'homeservice' && !address) {
      Alert.alert('Error', 'Alamat harus diisi untuk Home Service');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/check_user_complete', {
        user_id: user.user_id
      });
      const { complete } = response.data;

      if (!complete) {
        Alert.alert('Data Tidak Lengkap', 'Harap lengkapi data diri Anda terlebih dahulu.', [
          { text: 'OK', onPress: () => navigation.navigate('ProfilCus', { user }) }
        ]);
        return;
      }

      // Handle order submission
      axios.post('http://localhost:5000/orders', {
        customer_id: user.user_id,
        service_id: service.service_id,
        total_pembayaran: totalCost.toFixed(2), // Menambahkan total_pembayaran
        tanggal: selectedDate.toISOString().split('T')[0], // Menggunakan kolom 'tanggal'
        jam: `${selectedTime}:00`, // Menggunakan kolom 'jam'
        jenis: orderType,
        alamat_tujuan: orderType === 'homeservice' ? address : null,
        metode_pembayaran: paymentMethod,
        status: 'proses',
      })
        .then(response => {
          navigation.navigate('SuccessScreen', { user }); // Navigasi ke SuccessScreen dengan user prop
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error', 'Terjadi kesalahan saat membuat pesanan.');
        });

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan saat memeriksa kelengkapan data.');
    }
  };

  const onChangeDate = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pesan Sekarang</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.label}>Jenis Order</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={orderType}
            onValueChange={(itemValue) => setOrderType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Home Service" value="homeservice" />
            <Picker.Item label="Ke Tempat Langsung" value="direct" />
          </Picker>
        </View>

        {orderType === 'homeservice' && (
          <>
            <Text style={styles.label}>Alamat</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Masukkan alamat Anda"
            />
          </>
        )}

        <Text style={styles.label}>Metode Pembayaran</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Cash" value="cash" />
            <Picker.Item label="Online" value="online" />
          </Picker>
        </View>

        <Text style={styles.label}>Pilih Jadwal</Text>
        <View style={styles.scheduleContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{selectedDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()} // Sesuaikan sesuai kebutuhan
            />
          )}
          <View style={styles.pickerContainerSmall}>
            <Picker
              selectedValue={selectedTime}
              style={styles.picker}
              onValueChange={setSelectedTime}
            >
              {[...Array(11)].map((_, index) => {
                const hour = (9 + index).toString().padStart(2, '0');
                return <Picker.Item key={hour} label={`${hour}:00`} value={`${hour}:00`} />;
              })}
            </Picker>
          </View>
        </View>

        {orderType === 'homeservice' && (
          <Text style={styles.label}>Ongkir: Rp {shippingCost}</Text>
        )}

        <Text style={styles.label}>Harga Layanan: Rp {service.harga}</Text>
        <Text style={styles.label}>Total Bayar: Rp {totalCost.toFixed(2)}</Text>
      </ScrollView>
      <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
        <Text style={styles.orderButtonText}>Pesan Sekarang</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
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
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerContainerSmall: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerButton: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  datePickerText: {
    fontSize: 16,
  },
  orderButton: {
    backgroundColor: '#213555',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PesanScreen;
