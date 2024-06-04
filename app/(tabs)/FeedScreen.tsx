import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../firebaseConfig'; // Make sure this path is correct
import { collection, getDocs } from 'firebase/firestore';

interface Score {
  id: string;
  team1: string[];
  team1Score: number;
  team2: string[];
  team2Score: number;
  timestamp: string;
  winnerTeam: string;
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
  const [buttonsVisible, setButtonsVisible] = useState<boolean>(true);
  const [bannerVisible, setBannerVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'games'));
        const scoresList: Score[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            team1: data.team1 ?? [],
            team1Score: data.team1Score ?? 0,
            team2: data.team2 ?? [],
            team2Score: data.team2Score ?? 0,
            timestamp: data.timestamp?.toDate().toString() ?? '',
            winnerTeam: data.winnerTeam ?? '',
            reactions: data.reactions ?? {},
            comments: data.comments ?? []
          };
        });
        setScores(scoresList);
      } catch (error) {
        console.error("Error fetching scores: ", error);
      }
    };

    fetchScores();
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
    setBannerVisible(false);
    setButtonsVisible(true);
  };

  const handleButtonClick = () => {
    setButtonsVisible(false);
    setBannerVisible(true);
  };

  const renderItem = ({ item }: { item: Score }) => (
    <View style={styles.item}>
      <View style={styles.teamRow}>
        <View style={styles.teamColumn}>
          <Text style={styles.team}>{item.team1[0]}</Text>
          <Text style={styles.team}>{item.team1[1]}</Text>
        </View>
        <Text style={styles.vs}>vs.</Text>
        <View style={styles.teamColumn}>
          <Text style={styles.team}>{item.team2[0]}</Text>
          <Text style={styles.team}>{item.team2[1]}</Text>
        </View>
      </View>
      <Text style={styles.score}>{`${item.team1Score} - ${item.team2Score}`}</Text>
      <Text style={styles.date}>{item.timestamp}</Text>
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
      {buttonsVisible && (
        <TouchableOpacity style={styles.needButton} onPress={handleButtonClick}>
          <Text style={styles.needButtonText}>Need 1</Text>
        </TouchableOpacity>
      )}
      {bannerVisible && (
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
    paddingTop: 10, // Reduced space between the button and the first game
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
  needButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00aa00', // Changed color
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000', // Added shadow properties
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  needButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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