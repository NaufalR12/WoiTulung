import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import BerandaCus from './BerandaCus';
import ServiceDetail from './ServiceDetail';
import PesanScreen from './PesanScreen';
import ProfilCus from './ProfilCus';
import Riwayat from './Riwayat';
import SuccessScreen from './SuccessScreen';
import ReviewScreen from './ReviewScreen'; // Tambahkan ini

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BerandaCus"
          component={BerandaCus}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ServiceDetail"
          component={ServiceDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PesanScreen"
          component={PesanScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfilCus"
          component={ProfilCus}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Riwayat"
          component={Riwayat}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuccessScreen"
          component={SuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReviewScreen"
          component={ReviewScreen} // Tambahkan ini
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
