/**
 * 创建Token 3/3
 */

import React, { Component } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
} from "react-native";
import Toast from '../components/toast'
import CircleCheckBox, { LABEL_POSITION } from "react-native-circle-checkbox";  

const IMG_LEFTROW = require('../assets/img/leftrow.png')

export default class createtoken3 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isChecked : false ,
			checked : false ,
			tokenWeb : '' ,
			tokenPaper : '' ,
			tokenEmail : '' ,
			pressText: "提示",
			//请填写正确的网址
			showWeb : false ,
			webtoastList : [
				{ pressFn: () => { this.setState({showWeb:false}) }, btnTitle: '确认'}
			],
			webbtnContent: '请填写正确的网址!',
			//请填写正确的网页地址
			showWhitePaper : false ,
			papertoastList : [
				{ pressFn: () => { this.setState({showWhitePaper:false}) }, btnTitle: '确认'}
			],
			paperbtnContent: '请填写正确的网页地址!',
			//邮箱格式错误
			showEmail : false ,
			emailtoastList : [
				{ pressFn: () => { this.setState({showEmail:false}) }, btnTitle: '确认'}
			],
			emailbtnContent: '邮箱格式错误!',
			//总校验
			showall : false ,
			alltoastList : [
				{ pressFn: () => { this.setState({showall:false}) }, btnTitle: '确认'}
			],
			allbtnContent: '请输入正确格式内容!',
			//创建成功
			showSuccess : false ,
			SuccesstoastList : [
				{ 
					pressFn: () => { 
						this.setState({showSuccess:false}) ; 
						this.props.navigation.navigate('App',{
							// tokenSuccess : this.state.tokenSuccess
						})}, btnTitle: '确认'}
			],
			SuccessbtnContent: '恭喜您，Token已创建成功!',

			tokenSuccess : false 
		};
	}

	changeChecked = () => {
		this.setState({
			isChecked: !this.state.isChecked ,
		})
		let { isChecked } = this.state ;
		this.props.navigation.setParams({
			backgroundColor : isChecked ? '#ffffff' : '#ffcb00'  ,
			borderColor : isChecked ? '#dddddd' : '#ffcb00' ,
			color : isChecked ? '#dddddd' : '#ffffff'   ,
			disabled : isChecked ? true : false   ,
		})
	}

	componentDidMount() {
		let {tokenSuccess} = this.props.navigation.state.params ;
		this.setState({
			tokenSuccess : tokenSuccess
		})
		this.props.navigation.setParams({
			navigatePress: this.navigatePress 
		})
	}
	navigatePress = () => {
		let {tokenEmail,tokenPaper,tokenWeb} = this.state ;
		let rg1 = /\b(http|https)/ ;
		let rg2 = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
		let resultAll = rg1.test(tokenPaper) && rg1.test(tokenWeb) && rg2.test(tokenEmail);
		if (resultAll) {
			this.setState({
				showSuccess : true ,
				tokenSuccess : true 
			})
		}else{
			this.setState({
				showall : true
			})
		}
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
					backgroundColor : navigation.state.params.backgroundColor ? navigation.state.params.backgroundColor:'#ffffff' ,
					borderColor: navigation.state.params.borderColor ? navigation.state.params.borderColor : '#dddddd',
					height : 25 , 
					marginRight : 16 ,
					
			}}>
				<Text style={{
					lineHeight : 23 ,
					width : 40 ,
					textAlign : 'center' ,
					color :  navigation.state.params.color ? navigation.state.params.color : '#dddddd',
					fontFamily : 'PingFangSC-Regular' ,
					fontSize : 14
				}}>创建</Text>
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

	//校验官网地址是否正确 需要检测网址开头是否有http/https
	wrongWeb = () =>{
		let rg = /\b(http|https)/;
		let {tokenWeb} = this.state;
		if(rg.test(tokenWeb)){

		}else{
			this.setState({
				showWeb : true 
			})
		}
	}

	//检验白皮书地址是否正确 需要检测网址开头是否有http/https
	wrongPaper = () =>{
		let rg = /\b(http|https)/;
		let {tokenPaper} = this.state;
		if (rg.test(tokenPaper)) {

		}else{
			this.setState({
				showWhitePaper : true 
			})
		}
	}

	//检验邮箱格式是否正确
	wrongEmail = () =>{
		let rg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/ ;
		let {tokenEmail} = this.state;
		if(rg.test(tokenEmail)){

		}else{
			this.setState({
				showEmail : true 
			})
		}
	}

	render() {
		let {showWeb,showWhitePaper,showEmail,webtoastList,webbtnContent,papertoastList,paperbtnContent,emailtoastList,emailbtnContent,pressText,showall,alltoastList,allbtnContent,showSuccess,SuccessbtnContent,SuccesstoastList} = this.state ;
		return (
			<View style = {{height : '100%' , backgroundColor : '#ffffff'}}>
				<View style={styles.CT}>
					<View style={styles.CTI}>
						<TextInput
							underlineColorAndroid="transparent"
							style={styles.CTInput}
							placeholder='请输入Token项目官网地址'
							placeholderTextColo='#c1c1c1'
							onChangeText = { (tokenWeb) => this.setState({tokenWeb}) }
							value = {this.state.tokenWeb}
							onEndEditing = {this.wrongWeb}></TextInput>
					</View>
					<View style={styles.CTI}>
						<TextInput
							style={styles.CTInput}
							underlineColorAndroid = "transparent"
							placeholder='请输入Token项目白皮书地址'
							placeholderTextColo='#c1c1c1'
							onChangeText = { (tokenPaper) => this.setState({tokenPaper}) }
							value = {this.state.tokenPaper}
							onEndEditing = {this.wrongPaper}></TextInput>
					</View>
					<View style={styles.CTI}>
						<TextInput
							style={styles.CTInput}
							underlineColorAndroid = "transparent"
							placeholder='请输入Token项目联系邮箱'
							placeholderTextColo='#c1c1c1'
							onChangeText = { (tokenEmail) => this.setState({tokenEmail}) }
							value = {this.state.tokenEmail}
							onEndEditing = {this.wrongEmail}
						></TextInput>
					</View>
					<View style={styles.CTAgree}>
						<CircleCheckBox
							checked={this.state.isChecked}
							onToggle={(checked) => this.changeChecked()}
							labelPosition={LABEL_POSITION.RIGHT}
							label=""
							outerSize={15}
							innerSize={9}
							filterSize={13}
							outerColor="#444"
							innerColor="#ffd400"
							filterColor="white"
							styleCheckboxContainer={{marginTop : 3 , marginLeft : 16}}
						/>
						<View style={{ marginLeft : 5 }} ></View>
						<Text style={{ color: "#444444", fontSize: 14, height: 54, width: 110, marginLeft: 5 }}>
							我已阅读并同意
						</Text>
						<Text style={{ color: "#ffcb00", fontSize: 14, height: 54, width: 100 }}>
							Token 创建协议 
						</Text>
					</View>
					<Toast showToast={showWeb} btnList={webtoastList} toastTitle={pressText} btnContent={webbtnContent} ></Toast>
					<Toast showToast={showWhitePaper} btnList={papertoastList} toastTitle={pressText} btnContent={paperbtnContent} ></Toast>
					<Toast showToast={showEmail} btnList={emailtoastList} toastTitle={pressText} btnContent={emailbtnContent} ></Toast>
					<Toast showToast={showall} btnList={alltoastList} toastTitle={pressText} btnContent={allbtnContent} ></Toast>
					<Toast showToast={showSuccess} btnList={SuccesstoastList} toastTitle={pressText} btnContent={SuccessbtnContent}></Toast>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	CT: {
		marginTop: 10,
	},
	CTH: {
		marginTop: 25,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center"
	},
	CTHImage: {
		width: 75,
		height: 75,
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#dddddd",
		borderRadius: 37.5
	},
	CTHText: {
		marginTop: 10,
		fontFamily: "PingFangSC-Regular",
		fontSize: 12,
		color: "#c1c1c1",
		textAlign: "center",
		// backgroundColor: 'blue',
	},
	CTI: {
		borderTopWidth: 1,
		borderTopColor: "#dddddd",
	},
	CTInput: {
		marginLeft: 16,
		height: 58 ,
		padding : 0
	},
	CTAgree: {
		borderTopWidth: 1,
		borderTopColor: "#dddddd",
		flexDirection: "row",
		// fontFamily:'MicrosoftYaHei'
		paddingTop : 15
	}
});