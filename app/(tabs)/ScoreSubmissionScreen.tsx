import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function ScoreSubmissionScreen() {
  const [teamMate, setTeamMate] = useState('');
  const [opponentOne, setOpponentOne] = useState('');
  const [opponentTwo, setOpponentTwo] = useState('');
  const [yourPoints, setYourPoints] = useState('');  // State for your team's points
  const [opponentsPoints, setOpponentsPoints] = useState('');  // State for the opponents' points

  const handleSubmit = () => {
    // Placeholder for submission logic
    console.log({
      teamMate,
      opponentOne,
      opponentTwo,
      yourPoints,
      opponentsPoints
    });
    // Reset fields after submission
    setTeamMate('');
    setOpponentOne('');
    setOpponentTwo('');
    setYourPoints('');
    setOpponentsPoints('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Teammate's name"
        value={teamMate}
        onChangeText={setTeamMate}
        style={styles.input}
      />
      <TextInput
        placeholder="Opponent 1's name"
        value={opponentOne}
        onChangeText={setOpponentOne}
        style={styles.input}
      />
      <TextInput
        placeholder="Opponent 2's name"
        value={opponentTwo}
        onChangeText={setOpponentTwo}
        style={styles.input}
      />
      <TextInput
        placeholder="Your Team's Points"
        value={yourPoints}
        onChangeText={setYourPoints}
        keyboardType="numeric"  // Ensures only numbers are entered
        style={styles.input}
      />
      <TextInput
        placeholder="Opponent's Points"
        value={opponentsPoints}
        onChangeText={setOpponentsPoints}
        keyboardType="numeric"  // Ensures only numbers are entered
        style={styles.input}
      />
      <Button title="Submit Score" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
  },
});
