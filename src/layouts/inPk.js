/**
 * 导入私钥
 */

import React, { Component } from "react";
import {
	WebView,
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableHighlight,
	Platform,
	InteractionManager
} from "react-native";
import Toast from '../components/toast'
import {setStorage,resetFP} from '../utils/common_utils'
import {toastShort} from '../utils/ToastUtil'

const websource = (Platform.OS == 'ios') ?
	require('../../web/index.html'):
	{uri: 'file:///android_asset/dist/index.html'};

export default class inPk extends Component {
	constructor(props) {
		super(props);
		this.state = {
			unableClick : {
				backgroundColor: "#ffffff",
				borderColor: "#b7b7b7",
				color: "#b7b7b7",
				disabled : true ,
			},
			enableClick : {
				backgroundColor: "#fed853",
				borderColor: "#fed853",
				color: "#231815",
				disabled : false ,
			},

			walletPk : '',
			token : '',
			addressEKT : '',

			//来自修改密码页面的privkey ，需要检验
			// privKeyfromChangePas : '' ,

			//进入导入私钥的入口页面
			inPath : '' ,
			
			//修改密码导入私钥需验证是否与当前私钥一致
			showDiffPriv : false ,
			pressText : '提示',
			DiffPrivBtnList : [
				{ pressFn: () => { this.setState({showDiffPriv:false}) }, btnTitle: '请重新输入'}
			],
			DiffPrivBtnContent : '私钥错误'
		};
	}

	componentWillMount(){
		
	}

	inPathFrom = () => {
		let {walletPk} = this.state ;
		console.log(walletPk);
		
		let rg = /^[0-9a-fA-F]{64}$/
		if (rg.test(walletPk)) {
			let {inPath,privkey,addressEKT} = this.props.navigation.state.params;
			console.log('===', inPath, typeof (inPath), walletPk, privkey)
			switch (inPath) {
				case 'changePas':
					if (privkey === walletPk) {
						//跳转到设置密码页面
						this.props.navigation.navigate('SetPass', {
							headerTitle: '设置钱包密码',
							addressEKT: addressEKT,
							inPath: inPath
						})
					} else {
						this.setState({
							showDiffPriv: true
						})
					};
					break;
					//参数和条件需要添加 不完全
				case 'wakeUp':
					if (privkey === walletPk) {
						//跳转到设置密码页面
						this.props.navigation.navigate('App')
					} else {
						this.setState({
							showDiffPriv: true
						})
					};
					break;
				case 'createWallet':
					{
						console.log('h5 go')
						this.giveh5();
						console.log('h5 end');

						break;
					}
				default:
					break;
			}
		}else{
			 toastShort('私钥错误，请重新输入！')
		}
	}
	render() {
		let {showDiffPriv ,pressText ,DiffPrivBtnContent ,DiffPrivBtnList ,walletPk ,enableClick , unableClick } = this.state ;
		let {backgroundColor ,borderColor ,color ,disabled} = walletPk ? enableClick : unableClick ;
		return (
			<View style={styles.inPk}>
				<View style={{
					position: "absolute", 
					right: 16,
					left: 16,
					marginTop : 5
				}}>
					<Text style={styles.inPkTitle}>直接复制粘贴 EKT 钱包私钥 至输入框</Text>
					<TextInput
						style={styles.inPkInput}
						multiline={true}
						placeholder='输入 EKT 钱包私钥 内容'
						textAlignVertical = "top"
						underlineColorAndroid="transparent"
						onChangeText = { (walletPk) => this.setState({walletPk}) }
						value = {walletPk}
					></TextInput>
					<TouchableHighlight
						style={{
							marginTop: 40,
							borderWidth: 1,
							borderColor: borderColor,
							borderRadius: 40,
							height: 45,
							backgroundColor: backgroundColor,
							alignItems: "center",
							justifyContent: "center",
						}}
						disabled = {disabled}
						onPress = { () => {this.inPathFrom()}}
						underlayColor = '#fed853'>
						<Text
							style={{
								fontSize: 16,
								fontFamily: "PingFangSC-Regular",
								color: color
							}}>
							导入
						</Text>
					</TouchableHighlight>
					<WebView
						source={websource}
						onLoad={this._success}
						onError={this._fail}
						ref="webview"
						onMessage={this._onMessage.bind(this)}
						javaScriptEnabled={true}
					/>
					<Toast showToast={showDiffPriv} btnList={DiffPrivBtnList} toastTitle={pressText} btnContent={DiffPrivBtnContent}></Toast>
				</View>
			</View>
		)
	}
	_onMessage = e => {
		let data = JSON.parse(e.nativeEvent.data);
		let {inPath}=this.props.navigation.state.params ;
		console.log('inPK=========>',inPath)
		setStorage("address", data.addressSha256);
		setStorage("privkey", this.state.walletPk);
		console.log("输入密码创建的数据data==》", data);
		InteractionManager.runAfterInteractions( () => {
			this.props.navigation.dispatch(resetFP(0,'SetPass', {
				headerTitle : '设置交易密码',
				showBackUp: false,
				addressEKT: data.addressSha256,
				privkey: this.state.walletPk ,
				inPath : inPath
			}))
		})	
	}
	//给 h5 发消息
	giveh5() {
		let messageObject = {
			privkey: this.state.walletPk ,
			source : 'inPK'
		}
		let message = JSON.stringify(messageObject)
		this.refs.webview.postMessage(message);
	}
	_success = () => {
		console.log('========success')
	}
	_fail = () => {
		console.log('==========fail')
	}
}

const styles = StyleSheet.create({
	inPk: {
		height : '100%' ,
		backgroundColor : '#fff',
		position: "relative"
		// alignSelf: 'center',
	},
	inPkTitle: {
		fontSize: 14,
		color: "#444444"
	},
	inPkInput: {
		marginTop: 5,
		height: 250,
		borderWidth: 0.4,
		borderColor: "#b7b7b7",
		fontSize: 12,
		color: "#444444",
		fontFamily: "PingFangSC-Regular",
		padding : 0
	}
});