import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Score {
  id: string;
  teamMateOne: string;
  teamMateTwo: string;
  opponentOne: string;
  opponentTwo: string;
  yourPoints: number;
  opponentsPoints: number;
  date: string;
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
  const [showMessage, setShowMessage] = useState<boolean>(true);

  useEffect(() => {
    const initialScores: Score[] = [
      { id: '1', teamMateOne: 'Alice', teamMateTwo: 'John', opponentOne: 'Bob', opponentTwo: 'Charlie', yourPoints: 10, opponentsPoints: 5, date: '2024-05-01', reactions: {}, comments: [] },
      { id: '2', teamMateOne: 'David', teamMateTwo: 'Emma', opponentOne: 'Frank', opponentTwo: 'Grace', yourPoints: 8, opponentsPoints: 10, date: '2024-05-02', reactions: {}, comments: [] },
      { id: '3', teamMateOne: 'Henry', teamMateTwo: 'Ivy', opponentOne: 'Jack', opponentTwo: 'Kelly', yourPoints: 15, opponentsPoints: 12, date: '2024-05-03', reactions: {}, comments: [] },
      { id: '4', teamMateOne: 'Liam', teamMateTwo: 'Mia', opponentOne: 'Nathan', opponentTwo: 'Olivia', yourPoints: 7, opponentsPoints: 9, date: '2024-05-04', reactions: {}, comments: [] },
      { id: '5', teamMateOne: 'Oscar', teamMateTwo: 'Pam', opponentOne: 'Quinn', opponentTwo: 'Rita', yourPoints: 11, opponentsPoints: 8, date: '2024-05-05', reactions: {}, comments: [] },
      { id: '6', teamMateOne: 'Sam', teamMateTwo: 'Tina', opponentOne: 'Uma', opponentTwo: 'Victor', yourPoints: 13, opponentsPoints: 10, date: '2024-05-06', reactions: {}, comments: [] }
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

  const hideMessage = () => {
    setShowMessage(false);
  };

  const renderItem = ({ item }: { item: Score }) => (
    <View style={styles.item}>
      <View style={styles.teamRow}>
        <View style={styles.teamColumn}>
          <Text style={styles.team}>{item.teamMateOne}</Text>
          <Text style={styles.team}>{item.teamMateTwo}</Text>
        </View>
        <Text style={styles.vs}>vs.</Text>
        <View style={styles.teamColumn}>
          <Text style={styles.team}>{item.opponentOne}</Text>
          <Text style={styles.team}>{item.opponentTwo}</Text>
        </View>
      </View>
      <Text style={styles.score}>{`${item.yourPoints} - ${item.opponentsPoints}`}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.reactionContainer}>
        {reactionTypes.map(reaction => (
          <TouchableOpacity key={reaction} onPress={() => handleReaction(item.id, reaction)} style={styles.reactionButton}>
            <Ionicons name={item.reactions[reaction] ? 'heart' : 'heart-outline'} size={24} color={item.reactions[reaction] ? '#e91e63' : 'black'} />
            <Text style={styles.reactionCount}>{item.reactions[reaction] || 0}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.commentButton} onPress={() => toggleCommentsVisibility(item.id)}>
        <Text style={styles.commentButtonText}>Comments</Text>
      </TouchableOpacity>
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
          <TouchableOpacity style={styles.postButton} onPress={() => addComment(item.id)}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {showMessage && (
        <View style={styles.fixedMessage}>
          <Text style={styles.fixedMessageText}>Need 1!</Text>
          <TouchableOpacity onPress={hideMessage} style={styles.closeButton}>
            <Ionicons name="checkmark" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#f8f9fa',
  },
  fixedMessage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#343a40',
    padding: 10,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fixedMessageText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  list: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  team: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#343a40',
  },
  vs: {
    flex: 0.5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#495057',
  },
  score: {
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#212529',
  },
  date: {
    textAlign: 'center',
    marginVertical: 5,
    color: '#495057',
  },
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  reactionCount: {
    marginLeft: 5,
    color: '#495057',
  },
  commentButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#00aa00',
    borderRadius: 5,
  },
  commentButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  commentContainer: {
    marginTop: 10,
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 5,
  },
  input: {
    backgroundColor: '#dee2e6',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: '#00aa00',
    padding: 10,
    borderRadius: 5,
  },
  postButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  comment: {
    backgroundColor: '#dee2e6',
    padding: 10,
    marginVertical: 2,
    borderRadius: 3,
    color: '#212529',
  },
});

export default FeedScreen;
