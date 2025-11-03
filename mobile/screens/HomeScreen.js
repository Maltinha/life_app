import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Menu</Text>

        {/* settings button positioned at top-right */}
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={28} color="#333" />
        </TouchableOpacity>

        {/* Two menu containers side by side */}
        <View style={styles.menuRow}>
            
            <TouchableOpacity style={styles.menuContainer} onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
                <Ionicons name="person" size={40} color="#148d75ff" style={{ marginBottom: 10 }} />
                <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuContainer} onPress={() => navigation.navigate('Map')} activeOpacity={0.8}>
                <Ionicons name="map" size={40} color="#148d75ff" style={{ marginBottom: 10 }} />
                <Text style={styles.menuText}>Map</Text>
            </TouchableOpacity>
          
        </View>

        <View style={styles.menuRow}>
            
            <TouchableOpacity style={styles.menuContainer} onPress={() => navigation.navigate('Lists')} activeOpacity={0.8}>
                <Ionicons name="list" size={40} color="#148d75ff" style={{ marginBottom: 10 }} />
                <Text style={styles.menuText}>Lists</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuContainer} onPress={() => navigation.navigate('Bets')} activeOpacity={0.8}>
                <Ionicons name="logo-euro" size={40} color="#148d75ff" style={{ marginBottom: 10 }} />
                <Text style={styles.menuText}>Bets</Text>
            </TouchableOpacity>
          
        </View>

         <View style={styles.menuRow}>
            
            <TouchableOpacity style={styles.menuContainer} onPress={() => navigation.navigate('Counter')} activeOpacity={0.8}>
                <MaterialCommunityIcons name="counter" size={40} color="#148d75ff" style={{ marginBottom: 10 }} />
                <Text style={styles.menuText}>Counter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuContainer} onPress={() => navigation.navigate('Calendar')} activeOpacity={0.8}>
                <Ionicons name="calendar" size={40} color="#148d75ff" style={{ marginBottom: 10 }} />
                <Text style={styles.menuText}>Calendar</Text>
            </TouchableOpacity>
          
        </View>

         <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'left',
    color: '#333',
  },
  settingsButton: {
    position: 'absolute',
    top: 35,
    right: 30,
    zIndex: 10,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 8,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutText:{
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#148d75ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    zIndex: 10,
    elevation: 3,
  },
});
