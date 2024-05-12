import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { Score } from '@/.expo/types/types';
const FeedScreen: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  // Simulate fetching scores when the component mounts
  useEffect(() => {
    const initialScores: Score[] = [
      { id: '1', teamMate: 'Alice', opponentOne: 'Bob', opponentTwo: 'Charlie', yourPoints: 10, opponentsPoints: 5, reactions: [], comments: [] }
    ];
    setScores(initialScores);
  }, []);

  const handleReaction = (id: string): void => {
    setScores(currentScores =>
      currentScores.map(score =>
        score.id === id ? { ...score, reactions: [...score.reactions, '👍'] } : score
      )
    );
  };

  const addComment = (id: string, comment: string): void => {
    setScores(currentScores =>
      currentScores.map(score =>
        score.id === id ? { ...score, comments: [...score.comments, comment] } : score
      )
    );
  };

  const renderItem = ({ item }: { item: Score }) => (
    <View style={styles.item}>
      <Text>{`${item.teamMate} & team vs. ${item.opponentOne} & ${item.opponentTwo}`}</Text>
      <Text>{`Score: ${item.yourPoints} - ${item.opponentsPoints}`}</Text>
      <Button title="👍" onPress={() => handleReaction(item.id)} />
      <Button title="Comment" onPress={() => addComment(item.id, "Nice game!")} />
      <Text>Reactions: {item.reactions.join(' ')}</Text>
      <Text>Comments: {item.comments.join(', ')}</Text>
    </View>
  );

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
  }
});

export default FeedScreen;
