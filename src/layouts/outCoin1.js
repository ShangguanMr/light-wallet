/**
 * 转出Coin
 */

import React, { Component } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	ImageBackground,
	TextInput,
	TouchableOpacity,
	Image,
	InteractionManager
} from "react-native";
import { toastShort } from "../utils/ToastUtil";

const IMG_SACNNING = require("../assets/img/scanning.png")
const IMG_LEFTROW = require('../assets/img/leftrow.png')

export default class outcoin1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//按钮变色设置
			unableClick : {
				borderColor : '#c1c1c1' ,
				color : '#c1c1c1' ,
				backgroundColor : '#ffffff',
				disabled : true ,
			},
			enableClick : {
				borderColor : '#fed853' ,
				color : '#231815' ,
				backgroundColor : '#fed853',
				disabled : false ,
			},

			//转出地址输入框
			receiveAddress : '',
			//转出地址输入框默认文本
			placeholderFirst : '请输入对方 ',
			// transToken : '',
			placeholderSecond : ' 接收地址',
			//跳转页面的headerTitle传参
			headerTitleFirst : '转出',
			//当前token的总量 为后续页面传参 默认为空
			// transTokenTotalNum : '' ,
			//按钮默认不可点击，只有输入转出地址才可点击
			
		};
	}
	componentWillMount() {
		this.props.navigation.setParams({
			navigatePress: this.navigatePress,
		})
	}
	
	navigatePress = () => { 
		// 跳转到Qr
		InteractionManager.runAfterInteractions( () => {
			this.props.navigation.navigate('Qr', {
				headerTitle: '扫描钱包二维码',
				callback: (backData) => {
					let rg = /^([a-zA-Z0-9]{64})$/;
					let isTrue = rg.test(backData);
					if (isTrue) {
						this.setState({
							receiveAddress: '0x'+backData
						})
					} else {
						//弹出toast：该钱包地址无效
						toastShort('该钱包地址无效!')
					}
				}
			})
		})
	}

	static navigationOptions = ({ navigation, screenProps }) => ({
		title: navigation.state.params ? navigation.state.params.headerTitle : null,
		headerRight:(
			<ImageBackground 
				source={IMG_SACNNING} 
				style={{
					width : 22 ,
					height : 22 ,
					marginRight : 16 ,
				}}>
				<Text style={{ width : 22 , height : 22}} onPress={navigation.state.params?navigation.state.params.navigatePress:null}></Text>
			</ImageBackground>
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
		headerStyle : {backgroundColor:'#ffffff'} ,
	});

	//校验输入地址格式是否正确
	isRight = () => {
		let {receiveAddress} = this.state ;
		let {transToken,transTokenTotalNum,addressEKT,privkey,callback} = this.props.navigation.state.params ;
		let {key} = this.props.navigation.state;
		let rg = /^0x+([a-zA-Z0-9]{64})$/;
		let isTrue = rg.test(receiveAddress);
		if (isTrue) {
			this.props.navigation.navigate('OutCoin2', {
				headerTitle: this.state.headerTitleFirst + transToken,
				transToken: transToken,
				inAddress: this.state.receiveAddress,
				transTokenTotalNum: transTokenTotalNum,
				addressEKT:addressEKT,
				privkey: privkey,
				key : key,
				callback:callback
			})
		} else {
			//弹出toast：该钱包地址无效
			toastShort('该钱包地址无效!')
		}
	}

	render() {
		let {receiveAddress,enableClick,unableClick}=this.state;
		let {transToken} = this.props.navigation.state.params ;
		let {backgroundColor,color,borderColor,disabled}=receiveAddress ? enableClick : unableClick ;
		return (
			<View style={{ backgroundColor : '#ffffff' , height : '100%' }}>
				<View style={{ 
					borderBottomColor : '#dddddd' ,
					borderBottomWidth : 1 ,
				}}>
					<TextInput
						underlineColorAndroid="transparent"
						style={{
							height : 62 ,
							fontFamily : 'PingFangSC-Regular' ,
							fontSize : 14 ,
							color : '#231815' ,
							textAlign : 'left',
							marginLeft : 16 ,
							marginTop : 30
						}}
						placeholder = {this.state.placeholderFirst + transToken + this.state.placeholderSecond}
						placeholderTextColor = '#c1c1c1'
						onChangeText = { (receiveAddress) => this.setState({receiveAddress}) }
						value = {this.state.receiveAddress}
					></TextInput>
				</View>
				<View style={{ marginTop : 25 , position : 'relative'}}>
					<TouchableOpacity 
						disabled = {disabled}
						style={{
							position : 'absolute' ,
							left : 16 ,
							right : 16 ,
							borderWidth : 1 ,
							borderColor : borderColor ,
							backgroundColor : backgroundColor ,
							height : 45 ,
							borderRadius : 22.5
						}}
						onPress = {this.isRight}
					>
						<Text 
							style={{
								color : color ,
								fontFamily : 'PingFangSC-Regular' ,
								fontSize : 16 ,
								color : this.state.color ,
								textAlign : 'center' ,
								lineHeight : 45
							}}>下一步</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
});