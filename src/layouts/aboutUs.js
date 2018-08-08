/**
 * 我-设置-关于我们
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

const IMG_LOGO = require('../assets/img/logoEKT.png');

export default class aboutUs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			version: 'v1.0.0'
		};
	}
	render() {
		return (
			<View style={styles.aboutUs}>
				<View style={styles.aboutUsLogo}>
					<Image source={IMG_LOGO} style={styles.aboutUsLogoImage}></Image>
					<Text style={styles.aboutUsLogoText}>当 前 版 本 {this.state.version}</Text>
				</View>
				<View style={styles.aboutUsConnect}>
					<View style={styles.aboutUsConnectWay}>
						<Text
							style={{
									fontFamily: 'PingFangSC-Regular',
									fontSize: 12,
									color: '#444444',
									textAlign: 'center'
							}}>联系邮箱：EKTcoin@gmail.com</Text>
						<Text
							style={{
									fontFamily: 'PingFangSC-Regular',
									fontSize: 12,
									color: '#444444',
									marginLeft: 14,
									textAlign: 'center'
							}}>官方网站：ekt8.io</Text>
					</View>
					<Text style={styles.aboutUsConnectTerm}>使用条款</Text>
				</View>
				<View style={styles.aboutUsSelf}>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 12,
							fontFamily: 'PingFangSC-Regular',
							color: '#7d7d7d'
						}}
					>EKT 版 权 所 有</Text>
					<Text
						style={{
							paddingTop: 10,
							textAlign: 'center',
							fontSize: 10,
							fontFamily: 'PingFangSC-Regular',
							color: '#7d7d7d'
						}}
					>Copyright©2018 EKT All Right Reserve</Text>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	aboutUs: {
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		paddingTop:136,
		backgroundColor: '#ffffff',
		position: 'relative'
	},
	aboutUsLogoImage: {
		width: 110,
		height: 110,
		borderWidth: 1,
		borderRadius: 20
	},
	aboutUsLogoText: {
		color: '#444444',
		fontSize: 14,
		fontFamily: 'PingFangSC-Regular',
		marginTop: 15
	},
	aboutUsConnect: {
		marginTop: 80
	},
	aboutUsConnectWay: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ffffff',
	},
	aboutUsConnectTerm: {
		marginTop: 20,
		fontSize: 14,
		color: '#ffd400',
		textAlign: 'center',
		fontFamily: 'PingFangSC-Regular',
	},
	aboutUsSelf: {
		position: 'absolute',
		bottom: 13
	}
});
