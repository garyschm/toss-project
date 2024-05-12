import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet } from 'react-native';
import { Score } from '@/.expo/types/types'; // Ensure the path to types is correct

const FeedScreen: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const initialScores: Score[] = [
      {
        id: '1',
        teamMate: 'Graham',
        opponentOne: 'Akea',
        opponentTwo: 'Chris',
        yourPoints: 14,
        opponentsPoints: 0,
        reactions: [],
        comments: []
      }
    ];
    setScores(initialScores);
  }, []);

  const handleReaction = (id: string, reaction: string): void => {
    setScores(currentScores =>
      currentScores.map(score =>
        score.id === id ? { ...score, reactions: [...score.reactions, reaction] } : score
      )
    );
  };

  const addComment = (id: string, comment: string): void => {
    if (comment.trim() === '') return; // Prevent empty comments
    setScores(currentScores =>
      currentScores.map(score =>
        score.id === id ? { ...score, comments: [...score.comments, comment] } : score
      )
    );
  };

  const renderItem = ({ item }: { item: Score }) => {
    const [comment, setComment] = useState('');
    
    return (
      <View style={styles.item}>
        <Text>{`${item.teamMate} & Gary vs. ${item.opponentOne} & ${item.opponentTwo}`}</Text>
        <Text>{`Score: ${item.yourPoints} - ${item.opponentsPoints}`}</Text>
        <View style={styles.reactions}>
          <Button title="👍" onPress={() => handleReaction(item.id, '👍')} />
          <Button title="❤️" onPress={() => handleReaction(item.id, '❤️')} />
          <Button title="😂" onPress={() => handleReaction(item.id, '😂')} />
        </View>
        <TextInput
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
          style={styles.input}
        />
        <Button title="Submit Comment" onPress={() => { addComment(item.id, comment); setComment(''); }} />
        <Text>Reactions: {item.reactions.join(' ')}</Text>
        <Text>Comments: {item.comments.join(', ')}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={scores}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  reactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10
  }
});

export default FeedScreen;
