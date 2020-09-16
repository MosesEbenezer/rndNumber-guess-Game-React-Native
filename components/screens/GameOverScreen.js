import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Button,
	Image,
	Dimensions,
	ScrollView,
	SafeAreaView
} from 'react-native';

import Colors from '../../constants/colors';
import MainButton from '../../components/MainButton';

const GameOverScreen = (props) => {
	return (
		<ScrollView>
			<View style={styles.screen}>
				<Text> The Game is Over!</Text>
				<View style={styles.imageContaner}>
					<Image
						fadeDuration={1000}
						source={require('../../assets/success.png')}
						style={styles.image}
						resizeMode='cover' // its the default anyways.
					/>
				</View>
				<Text>Number of Rounds: {props.roundsNumber}</Text>
				<Text>Number was: {props.userNumber}</Text>
				<View style={styles.button}>
					<MainButton onPress={props.onRestart}>
						PLAY AGAIN
						{/* color={Colors.accent} */}
					</MainButton>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10
	},
	button: {
		marginTop: 10,
		borderRadius: 30,
	},
	imageContaner: {
		width: Dimensions.get('window').width * 0.7,
		height: Dimensions.get('window').width * 0.7,
		borderRadius: (Dimensions.get('window').width * 0.7) / 2,
		borderWidth: 3,
		borderColor: 'grey',
		overflow: 'hidden',
		marginVertical: Dimensions.get('window').height / 30,
	},
	image: {
		width: '100%',
		height: '100%',
	},
});

export default GameOverScreen;
