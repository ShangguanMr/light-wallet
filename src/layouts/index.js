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
	Dimensions
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import { createBottomTabNavigator } from 'react-navigation'

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
	
	constructor () {
		super() 

	}

	state = {
		selectedTab: 'MyWallet'
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
				source={myWalletAc} />
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
		// const {navigate} = this.props.navigation ;
		return (
			<View style={{ flex : 1 , backgroundColor : '#ffffff'}}>
				{this._home () }
			</View>
		) 
	}

}
// const MainScreenNavigator = TabNavigator({
//     Home: {
//         screen: MyWallet
//     },
//     Certificate: {
//         screen: Me
//     },
// }, {
//     animationEnabled: false, // 切换页面时不显示动画
//     tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
//     swipeEnabled: false, // 禁止左右滑动
//     backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
//     tabBarOptions: {
//         activeBackgroundColor : '#000000',
//         inactiveBackgroundColor :'#ffffff',
//         showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
//         indicatorStyle: {height: 0}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
//         activeTintColor: '#000000',   //label和icon的前景色 活跃状态下（选中）
//         inactiveTintColor: 'gray',   //label和icon的前景色 活跃状态下（未选中）
//         showLabel: false ,
//         style: {
//             backgroundColor: '#fff', // TabBar 背景色
//         },
//         labelStyle: {
//             fontSize: 0, // 文字大小
//         },
//     },
// });


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