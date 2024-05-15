import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = () => {
  // Import your profile photo from local assets
  const profilePhoto = require('@/assets/images/gary.jpeg');
  const username = "GaryCantPlayDie"; // Example username

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
        <Ionicons name="podium-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.eloText}>1350 elo</Text>
      </View>
      <View style={styles.profileInfo}>
        {/* Your profile information goes here */}
        <Text>
          <Text style={styles.wins}>66W</Text> -
          <Text style={styles.draws}> 30D</Text> -
          <Text style={styles.losses}> 15L</Text>
        </Text>
        {/* Add more profile info as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingsIcon: {
    marginTop: 10,
  },
  profilePhotoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flex: 1,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 50,
    justifyContent: 'center',
  },
  username: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center'
  },
  icon: {
    marginRight: 5,
    marginTop: 0.5,
  },
  eloText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  wins: {
    color: 'green',
    fontWeight: 'bold',
  },
  draws: {
    color: 'black', // Assuming draws are in black
    fontWeight: 'bold',
  },
  losses: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
