import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserData } from '@/firestoreService';

const ProfileScreen = () => {
  // Import your profile photo from local assets
  const profilePhoto = require('@/assets/images/gary.jpeg');
  const [username, setUsername] = useState('Loading ...');
  const [elo, setElo] = useState('Loading...');
  //const username = "GaryCantPlayDie"; // Example username
  const [record, setRecord] = useState({wins: 0, losses: 0 });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = 'mWlktXPmmRePf8SuhA8H'; // Replace with dynamic user ID as necessary
        const data = await getUserData(userId);
        if (data) {
          setUsername(data.username || 'No username');
          setElo(data.elo || 'No elo');
          setRecord({ wins: data.wins || 0, losses: data.losses || 0 });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profilePhotoContainer}>
          <Image source={profilePhoto} style={styles.profilePhoto} />
          <Text style={styles.username}>{username}</Text>
        </View>
        <Ionicons name="settings" size={24} color="black" style={styles.settingsIcon} />
      </View>
      <View style={styles.userDetails}>
        <Ionicons name="podium-outline" size={24} color="white" style={styles.icon} />
        <Text style={styles.eloText}>{elo} ELO</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.recordText}>
          <Text style={styles.wins}>{record.wins}W</Text> -
          <Text style={styles.losses}>{record.losses}L</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 40
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  settingsIcon: {
    marginTop: 10,
  },
  profilePhotoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75, // Adjusted to be fully rounded
    justifyContent: 'center',
    borderColor: '#ced4da',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  username: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529', // Dark color for the username
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    backgroundColor: '#00aa00', // Changed to green
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginRight: 5,
  },
  eloText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff', // White text for the elo
  },
  profileInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  recordText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529', // Dark color for the record text
  },
  wins: {
    color: 'black',
    fontWeight: 'bold',
  },
  losses: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
