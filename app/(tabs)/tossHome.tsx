import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function TossHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Toss!</Text>
      <Image
        source={require('@/assets/images/dice.png')}
        style={styles.diceImage}
        //style={{ alignSelf: 'center'}}
        //<Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32, 
    textAlign: 'center',
    marginBottom: 20, 
  },
  diceImage: {
    width: 100,  // Set the width as needed
    height: 100, // Set the height as needed
    resizeMode: 'contain',  // This ensures the image scales nicely
    marginBottom: 20,
  },
});

export default TossHome;
