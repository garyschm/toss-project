import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function ScoreSubmissionScreen() {
  const [userName, setUserName] = useState('');
  const [teamMate, setTeamMate] = useState('');
  const [opponentOne, setOpponentOne] = useState('');
  const [opponentTwo, setOpponentTwo] = useState('');
  const [yourPoints, setYourPoints] = useState('');
  const [opponentsPoints, setOpponentsPoints] = useState('');

  const handleSubmit = () => {
    // Placeholder for submission logic
    console.log({
      userName,
      teamMate,
      opponentOne,
      opponentTwo,
      yourPoints,
      opponentsPoints,
    });
    // Reset fields after submission
    setUserName('');
    setTeamMate('');
    setOpponentOne('');
    setOpponentTwo('');
    setYourPoints('');
    setOpponentsPoints('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Your Name"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
        placeholderTextColor="#6c757d"
      />
      <TextInput
        placeholder="Teammate's name"
        value={teamMate}
        onChangeText={setTeamMate}
        style={styles.input}
        placeholderTextColor="#6c757d"
      />
      <TextInput
        placeholder="Opponent 1's name"
        value={opponentOne}
        onChangeText={setOpponentOne}
        style={styles.input}
        placeholderTextColor="#6c757d"
      />
      <TextInput
        placeholder="Opponent 2's name"
        value={opponentTwo}
        onChangeText={setOpponentTwo}
        style={styles.input}
        placeholderTextColor="#6c757d"
      />
      <TextInput
        placeholder="Your Team's Points"
        value={yourPoints}
        onChangeText={setYourPoints}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#6c757d"
      />
      <TextInput
        placeholder="Opponent's Points"
        value={opponentsPoints}
        onChangeText={setOpponentsPoints}
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
