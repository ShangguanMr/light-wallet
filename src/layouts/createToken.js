/**
 * 创建Token 1/3
 */

import React, { Component } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	ImageBackground,
	TextInput,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
	InteractionManager
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import Toast from '../components/toast';
import Password from '../components/password.js';
import {getStorage} from '../utils/common_utils'
import { toastShort } from "../utils/ToastUtil";
import CircleCheckBox, { LABEL_POSITION } from "react-native-circle-checkbox";  


const IMG_LOGOTOKENDEFAULT = require("../assets/img/logoToken.png")
const IMG_LEFTROW = require('../assets/img/leftrow.png')

const { width } = Dimensions.get('window')

export default class createtoken extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tokenAll : '' ,
			tokenSimple : '' ,
			tokenTotal : '',
			pricision : '',
			tokenImage : IMG_LOGOTOKENDEFAULT ,

			isChecked: false ,
			// showBackUp : false ,

			unableClick:{
				borderColor: '#dddddd',
				backgroundColor: '#ffffff',
				color: '#dddddd',
				disabled: true,
			},
			enableClick : {
				borderColor : '#ffcb00' ,
				backgroundColor : '#ffcb00' ,
				color : '#231815' ,
				disabled : false ,
			},

			pressText : '提示' ,
			//创建token提示
			showCreate : false ,
			CreateBtnList : [
				{ pressFn: () => { this.setState({showCreate:false}) }, btnTitle: '取消'} ,
				{ pressFn: () => { this.setState({showCreate:false , showPass : true}) }, btnTitle: '确认'}
			],
			CreateBtnConten : '创建Token需要消耗500EKT！',

			showPass : false ,
			wallettitle : '请输入钱包密码' ,
			passwordFromStorage : '',

			//输入密码提示错误
			showFail : false ,
			FailtoastList : [
				{ pressFn: () => { this.setState({showFail:false}) }, btnTitle: '确认'}
			],
			FailbtnContent: '交易密码输入错误，请重新输入！',
			//创建成功
			showSuccess : false ,
			SuccesstoastList : [
				{ 
					pressFn: () => { 
						InteractionManager.runAfterInteractions( () => {
							this.setState({
								showSuccess: false
							});
							this.props.navigation.navigate('App', {})
					})}, 
					btnTitle: '确认'
				}
			],
			SuccessbtnContent: '恭喜您，Token已创建成功!',
		};
	}
	componentDidMount() {
	}

	//token全称 不超过60个字母 空格算一个字符
	tokenNameAll(s) {
		let rg = /^(?=.*[a-zA-Z])[a-zA-Z ]{1,60}$/
		if(rg.test(s)){
			this.setState({
				tokenAll : s 
			})
		}else{
			
		}
	}

	//创建提示+密码输入
	_create = () => {
		this.getPas('password');
		if(this.state.tokenSimple === 'EKT'){
			toastShort('Token简称与已有Token重复，请修改！')
		}else{
			this.setState({
				showCreate: true,
			})
		}
	}

	leftClick = () => {
		this.setState({
			showPass : false
		})
	}

	_endPas = (value) => {
		if ( value === this.state.passwordFromStorage) {
			setTimeout(() => {
				this.setState({
					showPass: false
				},
				() => {
					this.setState({
						showSuccess:true
					})
				})
			}, 500);
		}else{
			setTimeout(() => {
				this.setState({
					showPass: false
				},
				() => {
					this.setState({
						showFail:true
					})
				})
			}, 500);
		}
	}

	async getPas (key) {
		try {
			let password = await getStorage(key);
			this.setState({
				passwordFromStorage : password
			})
			console.log('i am in createToken get pas', this.state.passwordFromStorage);
		} catch (e) {
			console.log(e.message);
		}
	}
	render() {
		let {tokenAll ,tokenSimple ,tokenTotal,pressText ,wallettitle,showPass,showCreate,CreateBtnConten,CreateBtnList,enableClick,unableClick,showFail,showSuccess,FailbtnContent,FailtoastList,SuccessbtnContent,SuccesstoastList,pricision,isChecked} = this.state;
		let {borderColor ,color ,backgroundColor,disabled} = tokenTotal&&tokenAll&&tokenSimple&&pricision&&isChecked ? enableClick : unableClick ; 
		return (
			<View style={{backgroundColor : '#ffffff' , height : '100%' }}>
				<View style={{marginTop : 10}}>
					<View style={styles.CTI}>
						<TextInput 
							style={styles.CTInput} 
							underlineColorAndroid = "transparent"
							placeholder='请输入Token全称，不超过60个字母'
							placeholderTextColo='#c1c1c1'
							maxLength = {60}
							onChangeText = { (tokenAll) => this.setState({tokenAll}) }
							value = {tokenAll}></TextInput>

					</View>
					<View style={styles.CTI}>
						<TextInput 
							style={styles.CTInput}
							underlineColorAndroid = "transparent"
							placeholder='请输入Token简称，不超过6个字母'
							placeholderTextColo='#c1c1c1'
							maxLength = {6}
							onChangeText = { (tokenSimple) => this.setState({
								tokenSimple:tokenSimple.toUpperCase()
							}) }
							value = {tokenSimple}></TextInput>
					</View>
					<View style={styles.CTI}>
						<TextInput 
							style={styles.CTInput}
							underlineColorAndroid = "transparent"
							placeholder='请输入Token总量，最低1万，最高1000亿'
							placeholderTextColo='#c1c1c1'
							maxLength = {12}
							keyboardType={"numeric"} 
							onChangeText = { (tokenTotal) => this.setState({tokenTotal}) }
							value = {tokenTotal}></TextInput>
					</View>
					<View style={styles.CTI}>
						<TextInput 
							style={styles.CTInput}
							underlineColorAndroid = "transparent"
							placeholder='请输入精确到小数点后几位，0-10位'
							placeholderTextColo='#c1c1c1'
							maxLength = {2}
							keyboardType={"numeric"} 
							onChangeText = { (pricision) => this.setState({pricision}) }
							value = {pricision}></TextInput>
					</View>
					<View style={styles.CTAgree}>
						<CircleCheckBox
							checked={isChecked}
							onToggle={(isChecked) => this.setState({isChecked:!this.state.isChecked})}
							labelPosition={LABEL_POSITION.RIGHT}
							label=""
							outerSize={15}
							innerSize={9}
							filterSize={13}
							outerColor="#444"
							innerColor="#ffd400"
							filterColor="white"
							styleCheckboxContainer={{ marginLeft : 16}}
						/>
						{/* <View style={{ marginLeft : 5 }} ></View> */}
						<Text style={{ color: "#444444", fontSize: 14, height: 54, width: 110, marginLeft: 5 }}>
							我已阅读并同意
						</Text>
						<Text style={{ color: "#ffcb00", fontSize: 14, height: 54, width: 100 }}>
							Token 创建协议 
						</Text>
					</View>
					<View style={styles.CTF}>
						<Text style={styles.CTFText}>* 创建完成后，此钱包会成为该Token的主地址</Text>
					</View>
					<View style={styles.CTF}>
						<Text style={styles.CTFText}>* 如需上架到Token列表，请发申请邮箱到EKTcoin@gmail.com</Text>
					</View>
				</View>
				<View style={{position:'relative'}}>
				<TouchableHighlight
					style={{
						marginTop: 40,
						borderWidth: 1,
						borderColor: borderColor,
						borderRadius: 40,
						height: 45,
						backgroundColor: backgroundColor,
						position : 'absolute' ,
						left : 16 ,
						right : 16 
					}}
					disabled = {disabled}
					onPress = { () => {this._create()}}
					underlayColor = '#fed853'>
					<Text
						style={{
							fontSize: 16,
							fontFamily: "PingFangSC-Regular",
							color: color ,
							lineHeight : 45 ,
							textAlign: 'center',
						}}>
						确认创建
					</Text>
				</TouchableHighlight>
				</View>
				{/* <Toast showToast={showTokenSimple} btnList={tokenSimpleBtnList} toastTitle={pressText} btnContent={tokenSimpleBtnContent}></Toast> */}
				<Toast showToast={showCreate} btnList={CreateBtnList} toastTitle={pressText} btnContent={CreateBtnConten}></Toast>
				<Password wallettitle={wallettitle} showPass={showPass} LeftFunc={this.leftClick} onEnd={this._endPas}>
				</Password>
				<Toast showToast={showFail} btnList={FailtoastList} toastTitle={pressText} btnContent={FailbtnContent} ></Toast>
				<Toast showToast={showSuccess} btnList={SuccesstoastList} toastTitle={pressText} btnContent={SuccessbtnContent}></Toast>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	CTHImage:{
		width : 75 ,
		height : 75 ,
		marginLeft : (width - 75)/2 ,
		borderRadius: 37.5,
		borderWidth: 1,
		borderColor: "#dddddd" ,
		overflow : 'hidden'
	},
	CTHText:{
		marginTop : 10 ,
		fontFamily : "PingFangSC-Regular",
		fontSize : 12 ,
		color : "#c1c1c1",
		textAlign : "center",
		// backgroundColor: 'blue',
	},
	CTI:{
		borderTopWidth: 1,
		borderTopColor: "#dddddd",
	},
	CTInput:{
		marginLeft : 16 ,
		height : 58 ,
		padding : 0
	},
	CTF:{
		// borderTopWidth: 1,
		// borderTopColor: "#dddddd",
	},
	CTFText:{
		marginTop : 5 ,
		marginLeft : 16 ,
		// fontFamily : 'MicrosoftYaHei',
		fontSize : 12 ,
		color : "#7d7d7d" ,
		textAlign : "left",
	},
	CTAgree: {
		borderTopWidth: 1,
		borderTopColor: "#dddddd",
		flexDirection: "row",
		// fontFamily:'MicrosoftYaHei'
		paddingTop: 15
	}
});