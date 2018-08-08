/**
 * 转出Coin2
 */

import React, {Component} from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ImageBackground,
	WebView,
	InteractionManager,
	Dimensions
} from "react-native";
import Password from '../components/password';
import Toast from '../components/toast';
import {getStorage,isIos,setStorage} from "../utils/common_utils";
import {toastShort} from '../utils/ToastUtil'
import {connect} from 'react-redux';
import {transactionDetails} from '../reducers/actions/wallet/wallet';

const {height,width} = Dimensions.get('window')
const IMG_CLEAN = require('../assets/img/cleanX.png')
const websource = isIos ? require('../../web/index.html') : {uri: 'file:///android_asset/dist/index.html'};

class outcoin2 extends Component {
	constructor(props) {
		super(props);
		this._onEnd = this._onEnd.bind(this);
		this.state = {
			//按钮变色设置
			enableClick : {
				borderColor: '#fed853',
				color: '#231815',
				backgroundColor: '#fed853',
				disabled: false,
			},
			unableClick: {
				borderColor: '#c1c1c1',
				color: '#c1c1c1',
				backgroundColor: '#f9f9f9',
				disabled: true,
			},
			//转出地址==》来自于前一个页面传参 默认为空
			inAddress: '',
			//拥有可用token总量 来自传参 默认为空
			transTokenTotalNum: '',
			//输入框默认样式
			placeholderFirst: '现有 ',
			placeholderSecond: ' : ',
			//当前token名字 来自传参 默认为空
			transToken: '',
			//输入交易货币数量
			transNumberInput: '',
			//按钮是否可点击 默认为true 不可点击

			wallettitle: '请输入交易密码',
			showPass: false,
			showMiddle: true,
			//备注
			notice:''

		};
	}

	componentDidMount() {

	}

	//全部转出按钮
	allIn() {
		let {transTokenTotalNum} = this.props.navigation.state.params
		this.setState({
			transNumberInput : String(transTokenTotalNum)
		});
	}

	//点击转出弹出输入交易密码框
	_confirm = () => {
		this.setState({
			showPass: true
		})
	}

	//输入交易密码返回键
	leftClick = () => {
		this.setState({
			showPass: false
		})
	}


	//输入交易密码结束调用
	async _onEnd(password) {
		let pwd = await getStorage("password");
		console.log("22222", pwd, password);
		//先判断密码是否正确
		//正确->跳转到App
		//错误->弹出提示toast
		if (password === pwd) {

			this.giveh5();
			// this.setState({
			//     showPass: false
			// }, () => {
			//     this.props.navigation.navigate('App')
			// })
		} else {
			this.setState({
				showPass: false,
			});
			toastShort('密码错误，请重试！')
		}
	}

	async _onMessage (e) {
		console.log("生验证sign", e);
		let that = this ;
		let data={};
		if(e.nativeEvent.data){
			data = JSON.parse(e.nativeEvent.data);
		}
		//处理之后的地址以及私钥存储到本地；
		setStorage("sign", data.sign);
		console.log("生成的签名验证sign", data);
		this.setState({
			showPass:false
		})
		let tx = await getStorage('tx');
		tx['EventType'] = "transaction";
		tx['sign'] = data.sign;
		let nonce = tx['nonce'];
		nonce += 1;
		setStorage("nonce", nonce);
		this.props.dispatch(transactionDetails(tx)).then( res => {
			if(res.status === 0 && res.msg === 'ok'){
				toastShort('ok')
				let {key,callback} = that.props.navigation.state.params ;
				InteractionManager.runAfterInteractions( () => {
					console.log("=======>",key,callback)
					if (callback)callback();
					that.props.navigation.goBack(key);
				})
			}else{

			}
		}).catch((err)=>{
			if(!!err){
				toastShort('转出错误请重试！');
			}
		})
	};

	//给 h5 发消息
	async giveh5() {
		let nonce= await getStorage("nonce");
		let date = new Date();
		let {transNumberInput}=this.state;
		let {addressEKT,privkey,inAddress}=this.props.navigation.state.params;
		let time = date.valueOf();
		let len = inAddress.length;
		inAddress = inAddress.substring(2,len)
		let tx= {
			from: addressEKT,
			to: inAddress,
			time: time,
			amount: parseFloat(transNumberInput),
			nonce: nonce,
			data: '',
			tokenAddress: '',
			fee: 0
		};
		console.log("xxx", tx);
		setStorage('tx',tx);
		let messageObject = {
			source: 'sign',
			tx : tx,
			privkey:privkey
		};
		console.log('messageObj to sign',messageObject);

		let message = JSON.stringify(messageObject)
		this.refs.webview.postMessage(message);
		console.log('messageObj to sign11', messageObject);
	}

	_success = () => {
		console.log('========success')
	}
	_fail = () => {
		console.log('==========fail')
	}

	render() {
		let {placeholderFirst,placeholderSecond,transNumberInput, wallettitle,showPass,showMiddle,enableClick,unableClick,notice} = this.state;
		let {transToken, inAddress, transTokenTotalNum} = this.props.navigation.state.params;
		let {borderColor,color,backgroundColor,disabled} = (transNumberInput>0&&transNumberInput<=transTokenTotalNum) ? enableClick : unableClick ;
		console.log("xxxx", transTokenTotalNum,transNumberInput);
		let _renderClean = (transNumberInput)
			? (
				<ImageBackground source={IMG_CLEAN} style={{width: 13, height: 13}}>
					<Text style={{width: 13, height: 35}} onPress={() => this.setState({transNumberInput:''})}></Text>
				</ImageBackground>
			)
			: (<View/>)
		return (
			<View style={{backgroundColor: '#f9f9f9', height: height}}>
				<View style={{backgroundColor: '#ffffff', height: 125}}>
					<Text style={{
						marginTop: 40,
						fontSize: 14,
						fontFamily: 'PingFangSC-Regular',
						textAlign: 'center',
						color: '#7d7d7d'
					}}>转入地址</Text>
					<Text style={{
						marginTop: 20,
						fontFamily: 'PingFangSC-Regular',
						fontSize: 14,
						color: '#231815',
						textAlign: 'left',
						width : width - 30 ,
						marginLeft : 15
					}}>{inAddress}</Text>
				</View>
				<View style={{marginTop: 10, backgroundColor: '#ffffff'}}>
					<View style={{marginLeft: 16, marginRight: 16}}>
						<Text style={{
							marginTop: 20,
							fontFamily: 'PingFangSC-Regular',
							fontSize: 16,
							color: '#231815',
							textAlign: 'left'
						}}>转出 {transToken} 数量</Text>
						<View style={{
							marginTop: 34,
							width: '100%',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}>
							<TextInput style={{
								fontFamily: 'PingFangSC-Regular',
								fontSize: 16,
								color: '#231815',
								height: 35,
								padding: 0,
								width: '70%'
								}}
								keyboardType={"numeric"}
								underlineColorAndroid="transparent"
								placeholder={
									placeholderFirst
									+ transToken
									+ placeholderSecond
									+ transTokenTotalNum}
								value={transNumberInput}
								onChangeText={(transNumberInput) =>{
									// console.log("adsdasdas",transNumberInput,typeof transNumberInput,transTokenTotalNum,typeof transTokenTotalNum);
									if(transNumberInput>transTokenTotalNum){
										toastShort("转出数量超出资产总和，请输入合理的数量")
									}
									// console.log("adsdasdas", transNumberInput, typeof transNumberInput, transTokenTotalNum, typeof transTokenTotalNum);
										this.setState({transNumberInput})
								}}
							></TextInput>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								{_renderClean}
								<TouchableOpacity style={{height: 35, marginLeft: 10}}>
									<Text style={{
										textAlign: 'right',
										fontSize: 12,
										lineHeight: 35,
										fontFamily: 'PingFangSC-Regular',
										color: '#ffcb00',
									}}
										  onPress={() => this.allIn()}>全部转出</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View
							style={{
								marginTop: 28,
								borderTopColor: '#dddddd',
								borderTopWidth : 1
							}}>
							<Text
								style={{
									marginTop: 5,
									fontFamily: 'PingFangSC-Regular',
									fontSize: 14,
									color: '#7d7d7d',
									textAlign: 'left'
								}}>* 请仔细核对并确认信息，转出后无法撤销</Text>
							<View style={styles.notice}>
								<TextInput
									style={{
										fontSize: 12,
										color: "#444444",
										fontFamily: "PingFangSC-Regular",
										padding: 0 ,
										lineHeight: 24,
										marginLeft : 16,
										maxHeight: 72,
									}}
									multiline={true}
									placeholder='添加备注'
									// textAlignVertical="top"
									underlineColorAndroid="transparent"
									onChangeText={(notice) => this.setState({ notice })}
									value={notice}
								></TextInput>
							</View>
						</View>
					</View>
				</View>
				<View style={{ width: width , marginTop : 20}}>
					<TouchableOpacity
						disabled={disabled}
						style={{
							marginLeft: 16,
							marginRight: 16,
							borderWidth: 1,
							borderColor: borderColor,
							backgroundColor: backgroundColor,
							height: 45,
							borderRadius: 22.5
						}}
						onPress={this._confirm}
					>
						<Text
							style={{
								color: color,
								fontFamily: 'PingFangSC-Regular',
								fontSize: 16,
								color: color,
								textAlign: 'center',
								lineHeight: 45
							}}>转出</Text>
					</TouchableOpacity>
				</View>
				<Password wallettitle={wallettitle} showPass={showPass} transToken={transToken} inAddress={inAddress} LeftFunc={this.leftClick} onEnd={this._onEnd} transNumberInput={transNumberInput} showMiddle={showMiddle}></Password>
				  <WebView source={websource}
				  onLoad={this._success}
				  onError={this._fail}
				  ref="webview"
				  onMessage={this._onMessage.bind(this)}
				  javaScriptEnabled={true}/>
			</View>
		)
	}
}

function mapStateToProps(state) {
	let {transactionData} = state.wallet;
	return {transactionData}
}

export default connect(mapStateToProps)(outcoin2);

const styles = StyleSheet.create({
notice : {
	marginTop: 5,
	borderWidth: 0.4,
	borderColor: "#b7b7b7",
	borderRadius : 1,
	height : 24,
	flexDirection : 'row',
	alignItems : 'center'
}
});
