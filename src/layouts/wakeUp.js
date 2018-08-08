/**
 * 钱包唤醒
 */

import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	InteractionManager
} from 'react-native';
import Toast from '../components/toast';
import { getStorage } from '../utils/common_utils';
import { toastShort } from '../utils/ToastUtil';

export default class wakeUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//应该是进入后台页面跳转时传过来的参数
			walletAddress: 'QUstVAm1nwLzAfXDtLvCgaCWUA1Yrqavjv',

			walletPas : '' ,
			//可点击按钮样式
			enableClick : {
				backgroundColor : '#fed853' ,
				borderColor : '#fed853' ,
				disabled : false ,
				color : '#231815'
			},
			//不可点击按钮样式
			unableClick : {
				backgroundColor : '#ffffff' ,
				borderColor : '#b7b7b7' ,
				disabled : true ,
				color : '#b7b7b7'
			}
		};
	}

	useStar(vl) {
		var hideVl = vl.substr(10, vl.length-20);
		var showVl = vl.replace(hideVl, "***");
		return showVl;
	}

	async getPas (key) {
		try {
			let password = await getStorage(key);
			this.setState({
				passwordFromStorage: password
			})
			console.log('i am in wakeUp page get password',password);		
		}catch(e){

		}
	}
	//验证密码
	confirmPas = () => {
		this.getPas('password');
		InteractionManager.runAfterInteractions( () => {
			let {walletPas,passwordFromStorage} = this.state ;
			console.log(walletPas,passwordFromStorage,'hahhah');
			
			if (walletPas === passwordFromStorage) {
				this.props.navigation.navigate('App', {
					showBackUp: false ,
					//需要继续回传地址
				})
			} else {
				this.setState({
					showBackUp: false,
				})
				toastShort('密码输入错误，请重新输入！')
			}
		})
	}

	render() {
		let { walletAddress ,walletPas ,enableClick ,unableClick} = this.state ;
		let { backgroundColor , borderColor , color , disabled} = walletPas ? enableClick : unableClick ;
		return (
			<View style={styles.wakeUp}>
				<View style={styles.wakeUpContainer}>
					<Text
						style={{
							// fontFamily:'MicrosoftYaHei',
							fontSize: 18,
							color: '#231815',
							fontWeight: 'bold',
							textAlign: 'center'
						}}
					>我的EKT钱包</Text>
					<Text
						style={{
							marginTop: 30,
							// fontFamily:'MicrosoftYaHei',
							fontSize: 14,
							color: '#444444',
							textAlign: 'center'
						}}
					>{this.useStar(walletAddress)}</Text>
				</View>
				<View style={styles.wakeUpPassword}>
					<TextInput
						placeholder='输入钱包密码，解锁密码'
						placeholderTextColor='#b7b7b7'
						style={styles.wakeUpPasswordInput}
						maxLength={6}
						keyboardType={'numeric'}
						underlineColorAndroid = "transparent"
						secureTextEntry={true}
						onChangeText = { (walletPas) => this.setState({walletPas}) }
						value = {this.state.walletPas}
					></TextInput>
					<TouchableOpacity 
						style={{
							marginTop: 80,
							width: 325,
							height: 45,
							borderWidth: 1,
							backgroundColor : backgroundColor,
							borderColor : borderColor,
							justifyContent : 'center',
							borderRadius : 40
						}} 
						disabled = { disabled }
						onPress={this.confirmPas} 
						underlayColor='#feca2e'>
						<Text
							style={{
								textAlign: 'center',
								// fontFamily:'MicrosoftYaHei',
								fontSize: 15,
								color: color
							}}
						>登录</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.wakeUpFooter}>
					<Text
						style={{
							fontFamily: 'PingFangSC-Regular',
							fontSize: 12,
							color: '#c1c1c1',
							textAlign: 'center'
						}}
					>忘记密码？可导入私钥重置密码</Text>
					<TouchableOpacity style={{ marginTop: 15 }} onPress={() => this.props.navigation.navigate('InPk',{
						headerTitle : '导入私钥' ,
						inPath : 'wakeUp'
					})}>
						<Text
							style={{
								fontFamily: 'PingFangSC-Regular',
								fontSize: 14,
								color: '#feca2e',
								textAlign: 'center'
							}}
						>导入私钥</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	login() {
		
	}
}

const styles = StyleSheet.create({
	wakeUp: {
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		backgroundColor: '#ffffff',
		position: 'relative'
	},
	wakeUpContainer: {
		marginTop: 115
	},
	wakeUpPassword: {
		marginTop: 42
	},
	wakeUpPasswordInput: {
		height: 50,
		width: 326,
		borderBottomWidth: 1,
		borderBottomColor: '#dddddd',
		textAlign: 'center',
		fontSize: 14,
		lineHeight: 18,
		padding : 0
		// fontFamily:'MicrosoftYaHei',
	},
	wakeUpFooter: {
		position: 'absolute',
		bottom: 40
	}
});
