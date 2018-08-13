/**
 * 创建Token 2/3
 */

import React, { Component } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity
} from "react-native";

const IMG_LEFTROW = require('../assets/img/leftrow.png')


export default class createtoken2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// tokenUse : '' ,
			// tokenSuccess : false 
		};
	}

	componentWillMount() {
		// let {tokenSuccess} = this.props.navigation.state.params ;
		// this.setState({
		// 	tokenSuccess : tokenSuccess
		// })
		this.props.navigation.setParams({
			navigatePress: this.navigatePress
		})
	}
	navigatePress = () => {
		// let {tokenSuccess} = this.state ;
		// this.props.navigation.navigate('CreateToken3', {
		// 	headerTitle : tokenSuccess ? '修改Token3/3' :'创建Token3/3' ,
		// 	tokenSuccess : tokenSuccess
		// })
	}
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: navigation.state.params?navigation.state.params.headerTitle:null,
		headerRight:(
			<TouchableOpacity 
				onPress={navigation.state.params?navigation.state.params.navigatePress:null}
				disabled = {navigation.state.params.disabled === undefined ? true : navigation.state.params.disabled}
				style = {{
					borderWidth : 1 ,
					borderRadius : 2 ,
					backgroundColor: navigation.state.params.backgroundColor ? navigation.state.params.backgroundColor:'#ffffff',
					borderColor: navigation.state.params.borderColor ? navigation.state.params.borderColor : '#dddddd',
					height : 25 , 
					marginRight : 16 ,
					
			}}>
				<Text style={{
					lineHeight : 23 ,
					width : 55 ,
					textAlign : 'center' ,
					color: navigation.state.params.color ? navigation.state.params.color : '#dddddd',
					fontFamily : 'PingFangSC-Regular' ,
					fontSize : 14
				}}>下一步</Text>
			</TouchableOpacity>
		),
		headerLeft : (
			<TouchableOpacity style={{ width : 16 , marginLeft : 16 }} onPress={() => { navigation.goBack(null); }}>
				<Image source={IMG_LEFTROW} style={{ height : 16 , width : 8}}></Image>
			</TouchableOpacity>
		),

		headerTitleStyle: {
			color: '#231815',
			fontSize: 18,
			textAlign: 'center',
			letterSpacing: 2,
			fontWeight: '400',
			fontFamily: 'PingFangSC-Regular'
		},
		headerBackTitle : null ,
		headerStyle : {
			backgroundColor:'#ffffff'
		}
	});

	setUseButton (tokenUse) {
		this.setState({
			tokenUse : tokenUse ,
		})
		this.props.navigation.setParams({
			backgroundColor : tokenUse.length < 100 ? '#ffffff' : '#ffcb00'  ,
			borderColor : tokenUse.length < 100 ? '#dddddd' : '#ffcb00' ,
			color : tokenUse.length < 100 ? '#dddddd' : '#ffffff'   ,
			disabled : tokenUse.length < 100 ? true : false   ,
		})
	}
	render() {
		return (
			<View style = {{height : '100%' ,backgroundColor : '#ffffff'}}>
				<View style={styles.CTIntroduce}>
					<View style={{position : "absolute" , left : 16 ,right : 16}}>
						<Text style={styles.CTIntroduceText}>填写 Token 的简介及用途</Text>
						<TextInput
							style={styles.CTIntroduceInput}
							multiline={true}
							textAlignVertical='top'
							underlineColorAndroid = "transparent"
							placeholder='请填写此 Token 的简介及用途，100 ～ 500字。'
							onChange={ () => this.props.navigation.setParams({
								backgroundColor : '#ffcb00' ,
								borderColor : '#ffcb00',
								color : '#ffffff' ,
							})}
							onChangeText = { (tokenUse) => this.setUseButton(tokenUse) }
							value = {this.state.tokenUse}
						></TextInput>
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	CTIntroduce: {
		marginTop: 15,
		position : "relative" 
	},
	CTIntroduceText: {
		fontSize: 14,
		fontFamily : "PingFangSC-Regular" ,
		color: "#444444",
		textAlign : "left"
	},
	CTIntroduceInput: {
		marginTop : 10 ,
		height : 250 ,
		borderWidth : 1 ,
		borderColor : 'rgba(183,183,183,0.7)' ,
		fontFamily: "PingFangSC-Regular",
		color: "#444444",
		textAlign: "left",
		fontSize: 12 ,
		padding : 0
	}
});