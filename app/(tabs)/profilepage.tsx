import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Profile {
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  ranking: number;
}

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Fetch the profile data from your backend or any data source
    const fetchProfile = async () => {
      const profileData: Profile = {
        name: 'John Doe',
        gamesPlayed: 50,
        gamesWon: 30,
        ranking: 5
      };
      setProfile(profileData);
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.stat}>Games Played: {profile.gamesPlayed}</Text>
      <Text style={styles.stat}>Games Won: {profile.gamesWon}</Text>
      <Text style={styles.stat}>Ranking: {profile.ranking}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  stat: {
    fontSize: 18,
    marginVertical: 5
  }
});

export default ProfileScreen;
