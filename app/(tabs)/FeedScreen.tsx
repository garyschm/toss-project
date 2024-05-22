import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Score {
  id: string;
  teamMate: string;
  opponentOne: string;
  opponentTwo: string;
  yourPoints: number;
  opponentsPoints: number;
  reactions: { [key: string]: number };
  comments: string[];
}

const reactionTypes = ['heart-outline'] as const;
type ReactionType = typeof reactionTypes[number];

const FeedScreen: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [selectedScoreId, setSelectedScoreId] = useState<string | null>(null);
  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const initialScores: Score[] = [
      { id: '1', teamMate: 'Alice', opponentOne: 'Bob', opponentTwo: 'Charlie', yourPoints: 10, opponentsPoints: 5, reactions: {}, comments: [] },
      { id: '2', teamMate: 'Alice', opponentOne: 'Bob', opponentTwo: 'Charlie', yourPoints: 10, opponentsPoints: 5, reactions: {}, comments: [] },
      { id: '3', teamMate: 'Alice', opponentOne: 'Bob', opponentTwo: 'Charlie', yourPoints: 10, opponentsPoints: 5, reactions: {}, comments: [] },
      { id: '4', teamMate: 'Alice', opponentOne: 'Bob', opponentTwo: 'Charlie', yourPoints: 10, opponentsPoints: 5, reactions: {}, comments: [] },
      { id: '5', teamMate: 'Alice', opponentOne: 'Bob', opponentTwo: 'Charlie', yourPoints: 10, opponentsPoints: 5, reactions: {}, comments: [] },
      { id: '6', teamMate: 'Alice', opponentOne: 'Bob', opponentTwo: 'Charlie', yourPoints: 10, opponentsPoints: 5, reactions: {}, comments: [] }
    ];
    setScores(initialScores);
  }, []);

  const handleReaction = (id: string, type: ReactionType): void => {
    setScores(currentScores =>
      currentScores.map(score =>
        score.id === id
          ? { ...score, reactions: { ...score.reactions, [type]: (score.reactions[type] || 0) + 1 } }
          : score
      )
    );
  };

  const addComment = (id: string): void => {
    if (newComment.trim()) {
      setScores(currentScores =>
        currentScores.map(score =>
          score.id === id
            ? { ...score, comments: [...score.comments, newComment.trim()] }
            : score
        )
      );
      setNewComment('');
      setSelectedScoreId(null);
      setVisibleComments(prevState => ({
        ...prevState,
        [id]: false,
      }));
    }
  };

  const toggleCommentsVisibility = (id: string) => {
    setVisibleComments(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    setSelectedScoreId(id);
  };

  const renderItem = ({ item }: { item: Score }) => (
    <View style={styles.item}>
      <View style={styles.teamRow}>
        <Text style={styles.team}>{item.teamMate}</Text>
        <Text style={styles.vs}>vs.</Text>
        <Text style={styles.team}>{`${item.opponentOne} & ${item.opponentTwo}`}</Text>
      </View>
      <Text style={styles.score}>{`${item.yourPoints} - ${item.opponentsPoints}`}</Text>
      <View style={styles.reactionContainer}>
        {reactionTypes.map(reaction => (
          <TouchableOpacity key={reaction} onPress={() => handleReaction(item.id, reaction)} style={styles.reactionButton}>
            <Ionicons name={reaction} size={30} color="black" />
            <Text style={styles.reactionCount}>{item.reactions[reaction] || 0}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Comments" onPress={() => toggleCommentsVisibility(item.id)} />
      {visibleComments[item.id] && (
        <View style={styles.commentContainer}>
          <FlatList
            data={item.comments}
            renderItem={({ item }) => <Text style={styles.comment}>{item}</Text>}
            keyExtractor={(comment, index) => index.toString()}
          />
          <TextInput
            style={styles.input}
            placeholder="Add a comment"
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Post" onPress={() => addComment(item.id)} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.fixedMessage}>
        <Text style={styles.fixedMessageText}>Need 1!</Text>
      </View>
      <FlatList
        data={scores}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedMessage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    zIndex: 1, // Ensure the message stays on top
  },
  fixedMessageText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  list: {
    paddingTop: 50, // Adjust padding to avoid overlap with the fixed message
    paddingBottom: 20,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16, // Add horizontal margin to create space on the sides
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  team: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18, // Increase the font size for the names
  },
  vs: {
    flex: 0.2,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18, // Increase the font size for the "vs."
  },
  score: {
    textAlign: 'center',
    marginVertical: 5,
    fontWeight: 'bold',
    fontSize: 18,
  },
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align reactions to the right
    marginVertical: 10,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10, // Add space between reaction buttons
  },
  reactionCount: {
    marginLeft: 5,
  },
  commentContainer: {
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  comment: {
    backgroundColor: '#e2e2e2',
    padding: 5,
    marginVertical: 2,
    borderRadius: 3,
  },
});

export default FeedScreen;
