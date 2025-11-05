import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

// Auth stack: Login & Register
function AuthStack({ setUserToken }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} setUserToken={setUserToken} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack({ setUserToken }) {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home">
        {props => <HomeScreen {...props} setUserToken={setUserToken} />}
      </Stack.Screen>

      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}


export default function App() {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // Check token on app start
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decoded = jwt_decode(token);
          const now = Date.now()/1000
          if (decoded.exp < now) {
            await AsyncStorage.removeItem('userToken');
            setUserToken(null);
          } else {
            setUserToken(token);
          }
        } else {
          setUserToken(null);
        }
      } catch (e) {
        console.log('Error reading token', e);
        setUserToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#148d75ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? (
        <AppStack setUserToken={setUserToken} />
      ) : (
        <AuthStack setUserToken={setUserToken} />
      )}
    </NavigationContainer>
  );
}
