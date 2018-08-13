/**
 * 设置交易密码
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableHighlight,
} from 'react-native';
import Toast from '../components/toast'
import { setStorage } from '../utils/common_utils';
import { toastShort } from '../utils/ToastUtil';

export default class changePas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldPas : '' ,
			newPas : '' ,
			againNewPas : '' ,

			//可点击样式
			enableClick : {
				borderColor : '#ffd944' ,
				backgroundColor : '#ffd944' ,
				color : '#231815' ,
				disabled : false ,
			},
			//不可点击样式
			unableClick : {
				borderColor : '#c1c1c1' ,
				backgroundColor : '#ffffff' ,
				color : '#c1c1c1' ,
				disabled : true ,
			},

			privkey : '',

			//弹出toast：密码修改成功
			// pressText : '提示' ,
			// showDiff : false ,
			// btnList : [
			// 	{ 
			// 		pressFn: () => { 
			// 			this.setState({showDiff:false});
			// 		}, 
			// 		btnTitle: '确认'
			// 	}
			// ],
			// btnContent : '前后密码不一致'
		};
	}

	componentDidMount(){
		
	}

	//设置成功跳转到App页面
	toApp = () => {
		let {newPas,againNewPas} = this.state;

		//存储交易密码
		setStorage('password',newPas);
		
		let {inPath,addressEKT,privkey,showBackUp} = this.props.navigation.state.params;
		switch (inPath) {
			case 'changePas':
				if(newPas !== againNewPas){
					toastShort('两次输入不一致，请重新输入！')
				}else{
					this.props.navigation.navigate('App',{
						addressEKT : addressEKT
					})
				}
				break;

			case 'createWallet':
				if (newPas !== againNewPas) {
					toastShort('两次输入不一致，请重新输入！')
				} else {
					this.props.navigation.navigate('App', {
						addressEKT: addressEKT ,
						showBackUp : showBackUp ,
						privkey : privkey
					})
				}
				break;

			case 'wakeUp' :
				if (newPas !== againNewPas) {
					toastShort('两次输入不一致，请重新输入！')
				} else {
					this.props.navigation.navigate('App', {
						addressEKT: addressEKT,
						privkey : privkey
					})
				}
				break;
		
			default:
				break;
		}
		
	}

	render() {
		let {
			newPas  ,
			againNewPas ,
			enableClick,
			unableClick
		} = this.state;
		let {
			borderColor,
			backgroundColor,
			color,
			disabled
		} = againNewPas&&newPas ? enableClick : unableClick
		return (
			<View style={styles.ChangePas}>
				<View 
					style={{ 
						marginTop : 10 , 
						borderTopWidth : 1 , 
						width : '100%' , 
						borderTopColor : '#c1c1c1' ,
						flexDirection : 'column' ,
						alignItems : 'center' ,
						justifyContent : 'center',
						position :'absolute' ,
						paddingLeft : 16 ,
						paddingRight : 16
				}}>
						<View style={styles.ChangePasInput}>
								<TextInput
										style={styles.ChangePasInputIn}
										maxLength = {6}
										secureTextEntry={true}
										keyboardType={"numeric"}
										underlineColorAndroid = "transparent"
										placeholderTextColor = '#c1c1c1'
										placeholder = '请设置 6 位数字，作为钱包密码'
										onChangeText = { (newPas) => this.setState({newPas}) }
										value = {newPas}>
								</TextInput>
						</View>
						<View style={styles.ChangePasInput}>
								<TextInput
										style={styles.ChangePasInputIn}
										maxLength = {6}
										underlineColorAndroid = "transparent"
										secureTextEntry={true}
										keyboardType={"numeric"}                           
										placeholderTextColor = '#c1c1c1'
										placeholder = '请重复钱包密码'
										onChangeText = { (againNewPas) => this.setState({againNewPas}) }
										value = {againNewPas}>
								</TextInput>
						</View>
						<View style={{ marginTop : 25 }}>
								<TouchableHighlight 
										onPress = {this.toApp}
										underlayColor = '#fff'
										disabled = {disabled}
										style={{
												height : 45 , 
												width : 343 , 
												borderWidth : 1 ,
												borderColor : borderColor , 
												backgroundColor : backgroundColor , 
												borderRadius : 22.5
								}}>
										<Text 
												style={{
														textAlign : 'center' , 
														lineHeight : 45 , 
														color : color , 
														fontFamily : 'PingFangSC-Regular' , 
														fontSize: 16 
										}}>完成</Text>
								</TouchableHighlight>
						</View>
				</View>
			</View>
		)
	}

	login() {
			
	}
}

const styles = StyleSheet.create({
	ChangePas: {
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		backgroundColor: '#ffffff',
		position: 'relative'
	},
	ChangePasInput : {
		flexDirection : 'row' ,
		height : 55 ,
		alignItems : 'center' ,
		borderBottomWidth : 1 ,
		borderBottomColor : '#c1c1c1' ,
		width : '100%'
	},
	ChangePasInputText : {
		marginLeft : 16 ,
		fontFamily : 'PingFangSC-Regular' ,
		fontSize : 16 ,
		color : '#231815' ,
		textAlign : 'left'
	},
	ChangePasInputIn : {
		fontFamily : 'PingFangSC-Regular' ,
		fontSize : 16 ,
		color : '#231815' ,
		textAlign : 'left',
		padding : 0 ,
		width : '70%'
	}
});
