/**
 * 项目初始化内容
 */

import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image ,
	Dimensions ,
	BackHandler,
	AppState,
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import MyWallet from './layouts/wallet';
import Me from './layouts/me';

const launchgif = require('./assets/img/toplaunch.gif') ;
const logo = require('./assets/img/logo.png') ;
const myWallet = require('./assets/img/mywallet.png') ;
const myWalletAc = require('./assets/img/mywalletac.png') ;
const meLogo = require('./assets/img/me.png') ;
const meLogoAc = require('./assets/img/meactive.png') ;
const { width, height } = Dimensions.get('window');

class App extends Component {
	
	constructor (props) {
		super(props);
	}
	
	state = {
		selectedTab: 'MyWallet',
		currentAppState : AppState.currentState,
	}

	// 安卓返回键的监听和唤醒状态的判断
	componentDidMount(){
		if(Platform.OS === 'android'){
			BackHandler.addEventListener('hardwareBackPress',this._onBackPressed);
		}
		AppState.addEventListener('change', this._onAppStateChanged)        
	}

	componentWillUnmount(){
		if (Platform.OS === 'android') {
			BackHandler.removeEventListener('hardwareBackPress', this._onBackPressed);
		}
		AppState.removeEventListener('change', this._onAppStateChanged)
	}

	_onBackPressed() {
		return true;
	}

	_onAppStateChanged = (nextAppState) => {
		if (this.state.currentAppState.match(/inactive|background/) && nextAppState === 'active' && this.props.navigation.state.routeName.match(/Qr|CreateToken/) === false) {
				this.props.navigation.navigate('WakeUp')
		}
		this.setState({
			currentAppState: nextAppState
		});
	}

	icons = {
		Home: {
			default: (
				<Image
					style={styles.image}
					source={myWallet}
				/>
			),
			selected: <Image 
				style={styles.image}
				source={myWalletAc}
				/>
		},
		Me: {
			default: (
				<Image
					style={styles.image}
					source={meLogo}
				/>
			),
			selected: (
				<Image
					style={styles.image}
					source={meLogoAc}
				/>
			)
		}
	}

	_welcome = () => {
		return (
			<View style={styles.onLaunch} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
				<Image
					source={launchgif}
					style={{ width: '100%', height: 150, marginTop: 150 }} />
				<View style={styles.bottomSign}>
					<Image
						source={logo}
						style={styles.bottomImg} />
					<Text style={{ color: '#7d7d7d', textAlign: 'center' }}>Copyright © 2018 EKT版权所有</Text>
				</View>
			</View>
		)
	}

	_home = () => {
		return (
			<TabNavigator>
				<TabNavigator.Item
					selected={this.state.selectedTab === 'MyWallet'}
					renderIcon={() => this.icons.Home.default}
					renderSelectedIcon={() => this.icons.Home.selected}
					onPress={() => this.setState({ selectedTab: 'MyWallet' })}
				>
					<MyWallet nav={this.props.navigation}/>
				</TabNavigator.Item>
				<TabNavigator.Item
					selected={this.state.selectedTab === 'Me'}
					renderIcon={() => this.icons.Me.default}
					renderSelectedIcon={() => this.icons.Me.selected}
					onPress={() => this.setState({ selectedTab: 'Me' })}
				>
					<Me nav={this.props.navigation}/>
				</TabNavigator.Item>
			</TabNavigator>
		)
	}

	render() {
		return (
			<View style={{ flex : 1 , backgroundColor : '#ffffff'}}>
				{this._home () }
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
	bottomSign : {
		position : 'absolute',
		bottom : 10 ,
		width : '100%'
	},
	bottomImg : {
		width: 20, 
		height: 20, 
		marginLeft: 'auto', 
		marginRight: 'auto', 
		marginBottom: 7
	},
	image : {
		width : 30 ,
		height : 30
	}
});


export default App ;
