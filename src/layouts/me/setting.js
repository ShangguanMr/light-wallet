/**
 * 设置
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
	InteractionManager
} from 'react-native';
import MeItem from '../../components/meItem.js';
import Toast from '../../components/toast.js';
import Password from '../../components/password.js';
import {connect} from 'react-redux';
import {resetNavigation,clearDataByKey, removeStorage} from '../../utils/common_utils'
//引用lodash工具;
var _ = require("lodash");
import {getUserInfo} from '../../reducers/actions/me/me';
import { getStorage } from '../../utils/common_utils.js';

class setting extends Component {
	constructor() {
		super()
		this.state = {
			step1 : '显示币种' ,
			step2 : '修改密码' ,
			step3 : '关于我们' ,
			noticeTitle : '确定要退出钱包？',
			btnContent: '退出钱包后，将从本机删除此钱包相关信息。但不会影响您的资金安全，可通过导入私钥方式恢复。' ,
			toastList : [
					{ pressFn: this._hideToastNo, btnTitle: '取消'},
					{ pressFn: this._hideToastYes, btnTitle: '确定'}
			],
			showToast : false ,
			showPass : false ,
			wallettitle : '请输入钱包密码' ,
			successJump : 'CreateWallet' ,

			passwordFromStorage : ''
		}
	}

	
	press1 = () => {
		const { navigate } = this.props.navigation ;
		navigate('CurrencyList',{
			headerTitle: '显示币种'
		})
	}

	press2 = () => {
        const { navigate } = this.props.navigation ;
        let {privkey,addressEKT} = this.props.navigation.state.params ;
        console.log('------',privkey);
        
		navigate('ChangePas'  , {
			headerTitle: '修改密码' ,
            privkey : privkey ,
            addressEKT : addressEKT
		})
	}

	press3 = () => {
		const { navigate } = this.props.navigation ;
		navigate('AboutUs' , {
			headerTitle: '关于我们'
		})
	}

	noticeBackup() {
		this.setState({
			showToast: true ,
		})
	}

	async getPas  (key) {
		try {
			let pasaword = await getStorage(key);
			this.setState({
				passwordFromStorage: pasaword
			})
			console.log('haahahah====', password)
		} catch (e) {

		}
	}

	_hideToastYes = () => {
		/**
		 * hide第一个提示toast之后
		 * 延迟800毫秒 显示第二个保存 token 的toast
		 */
		this.getPas('password');
		// InteractionManager.runAfterInteractions( () => {
		// 	this.setState(
		// 		{showToast: false},
		// 		{showPass: true}
		// 	)
		// })
		this.setState({
			showToast: false ,
			showPass: true
		})
	}

	_hideToastNo = () => {
		this.setState({
			showToast: false
		})
	}

	leftClick = () => {
		this.setState({
			showPass : false 
		})
	}

	_onEnd = (value) => {
		let {passwordFromStorage} = this.state;
		if (value === passwordFromStorage){
			InteractionManager.runAfterInteractions( () => {
				this.setState({
					showPass: false
				})
				console.log('exit App');
				//清除所有数据
				removeStorage('address');
				removeStorage('privkey');
				//重定向到createWallet页面
				InteractionManager.runAfterInteractions( () => {
					this.props.navigation.dispatch(resetNavigation(0,'Splash'));
				})
			})
		}else{
			this.setState({showPass:false})
		}
		           
	}

	render() {
		const { showToast , toastList , noticeTitle , btnContent ,
						showPass , wallettitle , successJump  } = this.state;
		return (
			<View style={ styles.container }>
				<View >
					<MeItem title={this.state.step1} _pressCb={() => this.press1()} >  </MeItem>
					<MeItem title={this.state.step2} _pressCb={() => this.press2()}>  </MeItem>
					<MeItem title={this.state.step3} _pressCb={() => this.press3()}>  </MeItem>
				</View>
				<View style={ styles.mainContainer}>
					<View style={styles.mainItem}>
						<TouchableHighlight
							style={styles.btn1}
							onPress={this.noticeBackup.bind(this)}
							underlayColor={'#ffcb00'}>
							<Text style={styles.btnText1}>
								退出钱包
							</Text>
						</TouchableHighlight>
					</View>
				</View>
				<Toast showToast={showToast} btnList={toastList} toastTitle={noticeTitle} btnContent={btnContent}></Toast>
				<Password showPass={showPass} wallettitle={wallettitle} LeftFunc={this.leftClick} onEnd={this._onEnd}></Password>
			</View>
		)
	}

    // noticeBackup() {
    //     // this.props.getUserInfo().then((res)=>{
    //     //     console.log("xxxxs",res);
    //     // });
    //     // return;
    //     toastShort("轻提示测试");
    //     return;
    //     this.setState({
    //         showToast: true,
    //     })
    // }

}

function mapStateToProps(state) {
    let {data} = state.me;
    return {data: data}
}

//或者直接写在页面里面也可以；
function mapDispatchToProps(dispatch) {
    return {
        getUserInfo: (params) => dispatch(getUserInfo(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(setting);

//页面样式；
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff'
    },
    icon: {
        width: 30,
        height: 30
    },
    mainContainer: {
        marginBottom: 75
    },
    mainItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    btn1: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: 45,
        width: 325,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#fed853',
        backgroundColor: '#fed853'
    },
    btnText1: {
        fontSize: 15,
        color: '#231815'
    },
});