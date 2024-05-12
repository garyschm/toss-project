import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface ScoreSubmissionProps {
  // Define any props here if needed
}

const ScoreSubmissionScreen: React.FC<ScoreSubmissionProps> = () => {
  const [teammate, setTeammate] = useState<string>('');
  const [opponent1, setOpponent1] = useState<string>('');
  const [opponent2, setOpponent2] = useState<string>('');
  const [score, setScore] = useState<string>('');

  const handleSubmit = () => {
    // Ideally handle the submission to your database here
    console.log('Submitting:', { teammate, opponent1, opponent2, score });
    // Reset fields after submission for now
    setTeammate('');
    setOpponent1('');
    setOpponent2('');
    setScore('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Teammate's Name:</Text>
      <TextInput
        style={styles.input}
        value={teammate}
        onChangeText={setTeammate}
        placeholder="Enter your teammate's name"
      />
      <Text style={styles.label}>Opponent 1:</Text>
      <TextInput
        style={styles.input}
        value={opponent1}
        onChangeText={setOpponent1}
        placeholder="First opponent's name"
      />
      <Text style={styles.label}>Opponent 2:</Text>
      <TextInput
        style={styles.input}
        value={opponent2}
        onChangeText={setOpponent2}
        placeholder="Second opponent's name"
      />
      <Text style={styles.label}>Score:</Text>
      <TextInput
        style={styles.input}
        value={score}
        onChangeText={setScore}
        placeholder="Enter the score"
        keyboardType="numeric"
      />
      <Button title="Submit Score" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
  }
});

export default ScoreSubmissionScreen;
