/**
 * 项目初始化内容
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ImageBackground ,
	TouchableHighlight,
	Clipboard,
	InteractionManager
} from 'react-native';
import MeItem from '../../components/meItem.js' ;
import Password from '../../components/password';
import Toast from '../../components/toast'
import { getStorage } from '../../utils/common_utils.js';
import {toastShort} from '../../utils/ToastUtil'

const mebg = require('../../assets/img/mebg.png') ;
const rightYellow = require('../../assets/img/rightyellow.png') ;

export default class me extends Component {
	constructor () {
		super() 
		this.state = {
			EKTnumber : 600 ,
			//两种情况
			showBackUp : false ,
			step1No : '导出私匙' ,
			step1Yes : '导出私钥（请备份）',

			// tokenSuccess : false ,
			//未创建token
			step2 : '创建 Token' ,
			//已创建token
			// step2Yes : '修改 Token' ,

			step3 : '设置' ,

			//读取storage中的交易密码
			passwordFromStorage : '',

			wallettitle : '请输入钱包密码' ,
			showPass : false ,

			content : '',
			//显示私钥toast
			showPriv : false ,
			privList : [
				{ pressFn: this._hideKey.bind(this), btnTitle: '复制' }
			],
			pressText : '我的私密钥' 
		}	
	}

	componentWillMount () {
		let {showBackUp} = this.props.nav.state.params;
		this.setState({
			showBackUp : showBackUp
		})
	}

	async _hideKey() {
		// 点击复制个人token
		let {privkey} = this.props.nav.state.params;
		Clipboard.setString(privkey);
		try {
			let content = await Clipboard.getString();
			this.setState({
				showPriv: false ,
				content : content ,
				showBackUp : false  
			});
		} catch (e) {
			this.setState({
				content: e.message,
				showPriv: false
			});
		}
	}
	
	async getPas(key) {
		try {
			let pasaword = await getStorage(key);
			this.setState({
				passwordFromStorage : pasaword
			})
			console.log('haahahah====',password)
		}catch(e){

		}
	}

	//替换地址中间的三分之一为***
	useStar(vl) {
		let hideVl = vl.substr(10, vl.length-20);
		let showVl=vl.replace(hideVl, "***");
		return showVl;
	}

	toTwo = () => {
		let { navigate } = this.props.nav ;
		let {addressEKT} = this.props.nav.state.params;
		navigate('ItemDeExEkttail', {
			headerTitle : '转入' ,
			addressEKT : addressEKT
		})
	}

	//备份秘钥输入密码框弹出
	press1 = () => {
		this.getPas('password');
		this.setState({
			showPass : true
		})
	}

	//跳转创建token
	press2 = () => {
		let {EKTnumber,showBackUp} = this.state ;
		// let {showBackUp}=this.props.nav.state.params;
		// let showBackUpPanduan = showBackUp || this.state.showBackUp;
		if (EKTnumber < 500) {
			toastShort('暂时仅对EKT持有数量超过500的开放');
		} else if (showBackUp) {
			toastShort('请先完成私钥备份')
		}else{
			let { navigate } = this.props.nav ;
			navigate('CreateToken',{
				headerTitle : '创建Token'
			})
		}
	}

	//跳转设置
	press3 () {
		let { navigate } = this.props.nav ;
		let {privkey,addressEKT} = this.props.nav.state.params;
		navigate('Setting',{
			headerTitle : '设置' ,
			privkey : privkey ,
			addressEKT : addressEKT
		})
	} 

	//密码输入返回键函数
	leftClick = () => {
		this.setState({
			showPass : false 
		})
	}

	//显示私钥
	showPrivkey = (value) => {
		console.log('--dsds----pass====',value)
		let {passwordFromStorage} = this.state ;
		InteractionManager.runAfterInteractions( () => {
			console.log('i am in ');
			if (passwordFromStorage===value) {
				// this.setState(
				// 	{
				// 		showPass: false,
				// 	},
				// 	() => {
				// 		this.setState({
				// 			showPriv: true
				// 		})
				// 	}
				// )
				setTimeout(() => {
					this.setState({showPass:false});
					setTimeout(() => {
						this.setState({showPriv:true})
					}, 500);
				}, 500);
			}else{
				this.setState({showPass:false})
			}
		})
	}

	render() {
		let { wallettitle , showPass , showPriv , privList , pressText   , step1No , step1Yes , step3  , step2 ,showBackUp} = this.state ;

		let {addressEKT,privkey}=this.props.nav.state.params;
		
		return (
			<View 
				style={{ flex : 1 , flexDirection: 'column'  }}>
					<TouchableHighlight onPress = {this.toTwo}>
					<ImageBackground 
						source={mebg} 
						style={{ height : 172 , position : 'relative'}}>
						<Text 
							style={{ fontSize: 21, color : '#ffffff',marginLeft : 15 ,marginTop : 65  }}>我的EKT钱包</Text>
						<View 
							style={{ flex : 1 , flexDirection : 'row', justifyContent : 'space-between',paddingHorizontal:15, alignContent : 'center'}}>
							<Text 
								style={{ color : '#e6c518', fontSize : 18}}>{'0x'+ this.useStar(addressEKT) }</Text>
							<ImageBackground 
								source={rightYellow} 
								style={{ width : 9, height : 16 }}>
								<Text style={{ width : 50, height : 50 }} ></Text>
							</ImageBackground>
						</View>
					</ImageBackground>
					</TouchableHighlight>
					<View>
						<MeItem title={ showBackUp ? step1Yes : step1No} _pressCb={() => this.press1()} >  </MeItem>
						<MeItem title={step2} _pressCb={() => this.press2()}>  </MeItem>
						<MeItem title={step3} _pressCb={() => this.press3()}>  </MeItem>
					</View>
				<Password wallettitle={wallettitle} showPass={showPass} LeftFunc={this.leftClick} onEnd={this.showPrivkey}>
				</Password>
				<Toast showToast={showPriv} btnList={privList} toastTitle={pressText} btnContent={privkey} ></Toast>
			</View>
		) 
	}

}

const styles = StyleSheet.create({
	onLaunch : {
		backgroundColor : '#000' ,
		height : '100%' ,
		position : 'relative' 
	},
	icon : {
		width : 30 ,
		height : 30
	}
});