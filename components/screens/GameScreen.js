import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

import NumberContainer from '../NumberContainer';
import Card from '../../components/Card';

const generateRandomBetween = (min, max, exclude) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	const rndNumber = Math.floor(Math.random() * (max - min)) + min;
	if (rndNumber === exclude) {
		return generateRandomBetween(min, max, exclude);
	} else {
		return rndNumber;
	}
};

const GameScreen = (props) => {
	const [currentGuess, setCurrentGuess] = useState(
		generateRandomBetween(1, 100, props.userChoice)
	);
  const [rounds, setRounds] = useState(0);
	const currentLow = useRef(1); // useRef allows you to provide a code which survives component rebuild
  const currentHigh = useRef(100);

  const {userChoice, onGameOver} = props;
  
  useEffect(() => {
    if(currentGuess === userChoice) {
      onGameOver(rounds);
    }
  }, [currentGuess, userChoice, onGameOver]); // useEffect Allows us to run logic after every render cycle this component. So after everytime this compoent renders, this useEffect function gets executed.
  // this effect will not rerun though if the component re-renders and these values of dependencies we specified in the array of seconda args remains the same, then the effect will not rerun.

	const nextGuessHandler = (direction) => {
		if (
			(direction === 'lower' && currentGuess < props.userChoice) ||
			(direction === 'greater' && currentGuess > props.userChoice)
		) {
			Alert.alert("Don't lie!", "You know that's not correct...", [
				{ text: 'Sorry!', style: 'cancel' },
			]);
			return;
		}
		if (direction === 'lower') {
			currentHigh.current = currentGuess; // set the number you just guessed as the current high. With useRef, the component doesn't rerender just because we're saving a new high.
		} else {
			currentLow.current = currentGuess;
		}
		const nextNumber = generateRandomBetween(
			currentLow.current,
			currentHigh.current,
			currentGuess
		); // current low is then set to  the min, current high is set to the max and current guess is excluded.
    setCurrentGuess(nextNumber);
    setRounds(curRounds => curRounds + 1)
	};

	return (
		<View style={styles.screen}>
			<Text>Opponent's Guess</Text>
			<NumberContainer>{currentGuess}</NumberContainer>
			<Card style={styles.buttonContainer}>
				<Button title='LOWER' onPress={nextGuessHandler.bind(this, 'lower')} />
				<Button
					title='GREATER'
					onPress={nextGuessHandler.bind(this, 'greater')}
				/>
			</Card>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 20,
		width: 300,
		maxWidth: '80%',
	},
});

export default GameScreen;
