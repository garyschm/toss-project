import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { db } from '../../firebaseConfig'; // Ensure the correct path
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

interface User {
  id: string;
  username: string;
}

export default function ScoreSubmissionScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [team1Player1, setTeam1Player1] = useState<string | null>(null);
  const [team1Player2, setTeam1Player2] = useState<string | null>(null);
  const [team2Player1, setTeam2Player1] = useState<string | null>(null);
  const [team2Player2, setTeam2Player2] = useState<string | null>(null);
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList: User[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          username: doc.data().username,
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const validateScores = (team1Score: number, team2Score: number): boolean => {
    const scoreDifference = Math.abs(team1Score - team2Score);

    if (team1Score === 14 || team2Score === 14) {
      return true;
    }

    if (team1Score > 14 && scoreDifference <= 2) {
      return true;
    }

    if (team2Score > 14 && scoreDifference <= 2) {
      return true;
    }

    return false;
  };

  const handleSubmit = async () => {
    if (!team1Player1 || !team1Player2 || !team2Player1 || !team2Player2 || !team1Score || !team2Score) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const team1ScoreNum = parseInt(team1Score);
    const team2ScoreNum = parseInt(team2Score);

    if (isNaN(team1ScoreNum) || isNaN(team2ScoreNum)) {
      Alert.alert("Error", "Scores must be numeric values");
      return;
    }

    if (!validateScores(team1ScoreNum, team2ScoreNum)) {
      Alert.alert("Error", "Invalid scores. The winning team must have 14 points, or if the game goes to overtime, the final score difference must be within 2 points.");
      return;
    }

    const winnerTeam = team1ScoreNum > team2ScoreNum ? 'team1' : 'team2';

    try {
      await addDoc(collection(db, 'games'), {
        team1: [team1Player1, team1Player2],
        team1Score: team1ScoreNum,
        team2: [team2Player1, team2Player2],
        team2Score: team2ScoreNum,
        winnerTeam,
        timestamp: serverTimestamp(),
        reactions: {},
        comments: []
      });
      Alert.alert("Success", "Game data submitted successfully");

      // Reset fields after submission
      setTeam1Player1(null);
      setTeam1Player2(null);
      setTeam2Player1(null);
      setTeam2Player2(null);
      setTeam1Score('');
      setTeam2Score('');
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Failed to submit game data");
    }
  };

  const getFilteredUsers = (excludedIds: string[]): { label: string; value: string }[] => {
    return users
      .filter(user => !excludedIds.includes(user.id))
      .map(user => ({ label: user.username, value: user.id }));
  };

  const exclusionList = [team1Player1, team1Player2, team2Player1, team2Player2].filter((id): id is string => id !== null);

  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={value => setTeam1Player1(value)}
        items={getFilteredUsers(exclusionList.filter(id => id !== team1Player1))}
        placeholder={{ label: 'Select Team 1 Player 1', value: null }}
        value={team1Player1}
        style={pickerSelectStyles}
      />
      <RNPickerSelect
        onValueChange={value => setTeam1Player2(value)}
        items={getFilteredUsers(exclusionList.filter(id => id !== team1Player2))}
        placeholder={{ label: 'Select Team 1 Player 2', value: null }}
        value={team1Player2}
        style={pickerSelectStyles}
      />
      <RNPickerSelect
        onValueChange={value => setTeam2Player1(value)}
        items={getFilteredUsers(exclusionList.filter(id => id !== team2Player1))}
        placeholder={{ label: 'Select Team 2 Player 1', value: null }}
        value={team2Player1}
        style={pickerSelectStyles}
      />
      <RNPickerSelect
        onValueChange={value => setTeam2Player2(value)}
        items={getFilteredUsers(exclusionList.filter(id => id !== team2Player2))}
        placeholder={{ label: 'Select Team 2 Player 2', value: null }}
        value={team2Player2}
        style={pickerSelectStyles}
      />
      <TextInput
        placeholder="Team 1 Score"
        value={team1Score}
        onChangeText={setTeam1Score}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#6c757d"
      />
      <TextInput
        placeholder="Team 2 Score"
        value={team2Score}
        onChangeText={setTeam2Score}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#6c757d"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Score</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00aa00',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputAndroid: {
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
};