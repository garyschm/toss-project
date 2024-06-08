import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Dimensions, RefreshControl, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../firebaseConfig'; // Make sure this path is correct
import { collection, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

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

const reportReasons = [
  'Unsportsmanlike Conduct',
  'Incorrect Score',
  'Harassment',
  'Cheating'
] as const;
type ReportReason = typeof reportReasons[number];

const FeedScreen: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [userMap, setUserMap] = useState<{ [key: string]: string }>({});
  const [newComment, setNewComment] = useState<string>('');
  const [selectedScoreId, setSelectedScoreId] = useState<string | null>(null);
  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({});
  const [buttonsVisible, setButtonsVisible] = useState<boolean>(true);
  const [bannerVisible, setBannerVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<ReportReason>('Unsportsmanlike Conduct');
  const [additionalComments, setAdditionalComments] = useState<string>('');

  const fetchScores = useCallback(async () => {
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
      // Sort scores by timestamp in descending order
      scoresList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setScores(scoresList);
    } catch (error) {
      console.error("Error fetching scores: ", error);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userMap: { [key: string]: string } = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        userMap[doc.id] = data.username;
      });
      setUserMap(userMap);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  useEffect(() => {
    fetchScores();
    fetchUsers();
  }, [fetchScores]);

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

  const handleButtonClick = () => {
    setButtonsVisible(false);
    setBannerVisible(true);
  };

  const hideMessage = () => {
    setBannerVisible(false);
    setButtonsVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchScores();
    setRefreshing(false);
  };

  const handleReport = () => {
    Alert.alert("Report submitted");
    setModalVisible(false);
    setAdditionalComments('');
  };

  const renderItem = ({ item }: { item: Score }) => (
    <View style={styles.item}>
      <View style={styles.teamRow}>
        <View style={styles.teamColumn}>
          <Text style={styles.team}>{userMap[item.team1[0]]}</Text>
          <Text style={styles.team}>{userMap[item.team1[1]]}</Text>
        </View>
        <Text style={styles.vs}>vs.</Text>
        <View style={styles.teamColumn}>
          <Text style={styles.team}>{userMap[item.team2[0]]}</Text>
          <Text style={styles.team}>{userMap[item.team2[1]]}</Text>
        </View>
      </View>
      <Text style={styles.score}>{`${item.team1Score} - ${item.team2Score}`}</Text>
      <Text style={styles.date}>{item.timestamp}</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.reportButton}>
          <Ionicons name="flag-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.reactionContainer}>
          {reactionTypes.map(reaction => (
            <TouchableOpacity key={reaction} onPress={() => handleReaction(item.id, reaction)} style={styles.reactionButton}>
              <Ionicons name={item.reactions[reaction] ? 'heart' : 'heart-outline'} size={24} color={item.reactions[reaction] ? '#e91e63' : 'black'} />
              <Text style={styles.reactionCount}>{item.reactions[reaction] || 0}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Players have been notified!</Text>
          <TouchableOpacity onPress={hideMessage} style={styles.dismissButton}>
            <Ionicons name="checkmark" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={scores}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report</Text>
            <Picker
              selectedValue={selectedReason}
              onValueChange={(itemValue) => setSelectedReason(itemValue as ReportReason)}
              style={styles.picker}
            >
              {reportReasons.map((reason) => (
                <Picker.Item key={reason} label={reason} value={reason} />
              ))}
            </Picker>
            <Text style={styles.modalText}>Do you have any additional comments?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Add your comments here"
              multiline
              value={additionalComments}
              onChangeText={setAdditionalComments}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleReport}>
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 40,
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
    paddingTop: 100, // Increased padding top to create space for the Need 1 button
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
    top: 80, // Adjusted position to be below the time display
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
  notification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#00aa00',
    borderRadius: 5,
    marginHorizontal: 16,
    marginTop: 50, // Added marginTop to create space below the top
  },
  notificationText: {
    color: '#fff',
    fontSize: 16, // Increased font size
    fontWeight: 'bold',
    textAlign: 'center', // Centered text
    flex: 1, // Added flex to make the text take available space
  },
  dismissButton: {
    marginLeft: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  reportButton: {
    padding: 10,
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
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#00aa00',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FeedScreen;
