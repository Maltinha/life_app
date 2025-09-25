import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true); 

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.214.206.7:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.text();
      if (response.ok) Alert.alert('Sucesso', 'Login efetuado com sucesso!');
      else Alert.alert('Erro', result);
    } catch (error) {
      Alert.alert('Erro de conexão', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Life App</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        textAlign="left"  // texto à direita
      />

      <View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Password"
    placeholderTextColor="#999"
    secureTextEntry={secure}
    value={password}
    onChangeText={setPassword}
  />
  <TouchableOpacity onPress={() => setSecure(!secure)}>
    <Ionicons name={secure ? "eye-off" : "eye"} size={24} color="gray" />
  </TouchableOpacity>
</View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
        <Text style={styles.link}>Register Page</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    padding: 30,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'left',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
passwordContainer: {
  flexDirection: 'row',  // coloca input e ícone na mesma linha
  alignItems: 'center',  // centraliza verticalmente
  backgroundColor: '#fff',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#ddd',
  paddingHorizontal: 15,
  marginBottom: 20,
},

passwordInput: {
  flex: 1,             // ocupa todo o espaço restante
  paddingVertical: 15, // mantém altura consistente
  fontSize: 16,
},
  button: {
    backgroundColor: '#148d75ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    alignItems: 'right', // centraliza o link horizontalmente
  },
  link: {
    color: '#148d75ff', // cor diferente do botão
    textAlign: 'right',
    fontSize: 16,
  },
});
