import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SuccessScreen = ({ route, navigation }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Pesanan berhasil dibuat!</Text>
      <TouchableOpacity
        style={styles.okButton}
        onPress={() => navigation.navigate('Riwayat', { user })}
      >
        <Text style={styles.okButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: '#213555',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessScreen;
