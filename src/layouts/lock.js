/**
 * 项目初始化内容
 */

import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	CheckBox,
	TouchableOpacity,
	Alert
} from 'react-native';
import Password from '../components/passwordInput' ;

const instructions = Platform.select({
	ios: 'Press Cmd+R to reload,\n' +
		'Cmd+D or shake for dev menu',
	android: 'Double tap R on your keyboard to reload,\n' +
		'Shake or press menu button for dev menu',
});

export default class lock extends Component {
	constructor() {
		super();
	   
	}
	render() {
		return (
			<View >
				 <Text style={styles.toptitle}>
					 我的EKT钱包
				 </Text>
				<Password maxLength={6}></Password>
			</View>
		);
	}
   
}

const styles = StyleSheet.create({
	toptitle : {
		fontSize : 41 ,
		color: '#221a18' 
	}
});