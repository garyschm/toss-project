import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

const RankingsScreen = () => {
  // Sample data array
  const data = [
    { id: 1, name: 'Gary Schmidt', score: 300, record: '5-0' },
    { id: 2, name: 'Akea Pavel', score: 250, record: '4-1' },
    { id: 3, name: 'Graham Gunderson Griffin', score: 245, record: '4-1' },
    { id: 4, name: 'Gordon Martinez-Piedra', score: 245, record: '4-1' },
    { id: 5, name: 'Willard Dorsey Gibson IV', score: 230, record: '3-2' },
    { id: 6, name: 'Christo Hristov', score: 215, record: '3-2' },
    { id: 7, name: 'Helen Hill', score: 200, record: '1-4' },
    // Add more sample data as needed
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rankings</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {data.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.rank}>#{item.id}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>ELO Score: {item.score}</Text>
            <Text style={styles.record}>Record: {item.record}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 10,
    backgroundColor: '#00aa00',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  item: {
    backgroundColor: '#ffffff',  // Using a white background for each item
    borderRadius: 8,             // Rounded corners
    padding: 16,                 // Adequate padding inside each item
    marginBottom: 10,            // Space between items
    shadowColor: '#000',         // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,          // Light shadow for depth
    shadowRadius: 6,             // Soften the shadow
    elevation: 3,                // Elevation for Android
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',  // Darker color for better readability
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    color: '#495057',
    marginTop: 4,   // Space between the rank and name
  },
  score: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  record: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});

export default RankingsScreen;
