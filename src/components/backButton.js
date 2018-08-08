import React, { Component } from 'react' ;
import {
	StyleSheet ,
	View ,
	Text ,
	Image ,
}from 'react-native' ;
const leftRow = require('../assets/img/leftrow.png');

export default class backButton extends Component {
	constructor (props) {
		super (props)
		this.state = {
		};
	}

	render () {
		return (
			<View style={{width:8,height:16,marginLeft:16}}>
				<Image source={leftRow} style={{width:8,height:16}}></Image>
			</View>
		)
	}
}
const styles = StyleSheet.create({
})