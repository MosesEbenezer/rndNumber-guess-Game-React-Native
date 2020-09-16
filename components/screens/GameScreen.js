import React, { useState, useRef, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Button,
	Alert,
	ScrollView,
	Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import NumberContainer from '../NumberContainer';
import Card from '../../components/Card';
import MainButton from '../MainButton';

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

const renderListItem = (value, numOfRound) => (
	<View key={value} style={styles.listItem}>
		<Text># {numOfRound}</Text>
		<Text>{value}</Text>
	</View>
);

const GameScreen = (props) => {
	const initialGuess = generateRandomBetween(1, 100, props.userChoice);
	const [currentGuess, setCurrentGuess] = useState(initialGuess);
	const [pastGuesses, setPastGuesses] = useState([initialGuess]);
	const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width)
	const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height)
	const currentLow = useRef(1); // useRef allows you to provide a code which survives component rebuild
	const currentHigh = useRef(100);

	const { userChoice, onGameOver } = props;

	useEffect(() => {

		const updateLayout = () => {
			setAvailableDeviceWidth(Dimensions.get('window').width);
			setAvailableDeviceHeight(Dimensions.get('window').height);
		}
		Dimensions.addEventListener('change', updateLayout)

		return () => {
			Dimensions.removeEventListener('change', updateLayout)
		}
	});

	useEffect(() => {
		if (currentGuess === userChoice) {
			onGameOver(pastGuesses.length);
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
			currentLow.current = currentGuess + 1;
		}
		const nextNumber = generateRandomBetween(
			currentLow.current,
			currentHigh.current,
			currentGuess
		); // current low is then set to  the min, current high is set to the max and current guess is excluded.
		setCurrentGuess(nextNumber);
		setPastGuesses((curPassGuesses) => [nextNumber, ...curPassGuesses]);
	};

	if (availableDeviceHeight < 500) {
		return (
			<ScrollView>
				<View style={styles.screen}>
					<Text>Opponent's Guess</Text>
					<View style={styles.controls}>
						<MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
							<Ionicons name='md-remove' size={24} color='white' />
						</MainButton>
						<NumberContainer>{currentGuess}</NumberContainer>
						<MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
							<Ionicons name='md-add' size={24} color='white' />
						</MainButton>
					</View>
					<View style={styles.listContainer}>
						<ScrollView contentContainerStyle={styles.list}>
							{pastGuesses.map((guess, index) =>
								renderListItem(guess, pastGuesses.length - index)
							)}
						</ScrollView>
					</View>
				</View>
			</ScrollView>
		);
	}

	return (
		<ScrollView>
			<View style={styles.screen}>
				<Text>Opponent's Guess</Text>
				<NumberContainer>{currentGuess}</NumberContainer>
				<Card style={styles.buttonContainer}>
					<MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
						<Ionicons name='md-remove' size={24} color='white' />
					</MainButton>
					<MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
						<Ionicons name='md-add' size={24} color='white' />
					</MainButton>
				</Card>
				<View style={styles.listContainer}>
					<ScrollView contentContainerStyle={styles.list}>
						{pastGuesses.map((guess, index) =>
							renderListItem(guess, pastGuesses.length - index)
						)}
					</ScrollView>
				</View>
			</View>
		</ScrollView>
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
		marginTop: Dimensions.get('window').height > 600 ? 20 : 5,
		width: 400,
		maxWidth: '100%',
	},
	listContainer: {
		flex: 1,
		width: Dimensions.get('window').width > 350 ? '80%' : '90%',
		// width: '80%'
	},
	list: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	listItem: {
		borderColor: '#ccc',
		borderWidth: 1,
		width: Dimensions.get('window').width > 350 ? '80%' : '90%',
		padding: 15,
		marginVertical: 10,
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	controls: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '80%'
	}
});

export default GameScreen;
