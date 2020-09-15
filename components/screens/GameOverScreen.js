import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import Colors from '../../constants/colors';

const GameOverScreen = (props) => {
	return (
		<View style={styles.screen}>
			<Text> The Game is Over!</Text>
			<Text>Number of Rounds: {props.roundsNumber}</Text>
			<Text>Number was: {props.userNumber}</Text>
			<View style={styles.button}>
				<Button title='PLAY AGAIN' color={Colors.accent} onPress={props.onRestart} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
  },
  button: {
    marginTop: 10,
    borderRadius: 30
  }
});

export default GameOverScreen;
